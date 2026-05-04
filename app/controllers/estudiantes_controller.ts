import Estudiante from '#models/estudiante'
import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'

interface ApoderadoVinculoInput {
  apoderadoId?: number
  // Si no se manda apoderadoId, los siguientes campos crean uno nuevo
  dni?: string | null
  nombre?: string
  apellido?: string | null
  whatsapp?: string
  email?: string | null
  parentesco?: string | null
  esPrincipal?: boolean
}

export default class EstudiantesController {
  public async index({}: HttpContext) {
    try {
      const estudiantes = await Estudiante.query()
        .preload('person')
        .preload('apoderados', (q) => {
          q.pivotColumns(['parentesco', 'es_principal'])
        })
      return {
        status: 'success',
        message: 'estudiantes fetched with success',
        data: estudiantes,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'estudiantes fetch error',
        error,
      }
    }
  }

  public async show({ params }: HttpContext) {
    try {
      const estudiante = await Estudiante.query()
        .where('id', params.id)
        .preload('person')
        .preload('apoderados', (q) => {
          q.pivotColumns(['parentesco', 'es_principal'])
        })
        .firstOrFail()
      return {
        status: 'success',
        message: 'estudiante fetched with success',
        data: estudiante,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'estudiante fetch error',
        error,
      }
    }
  }

  /**
   * Crea estudiante. Acepta:
   *  - personId, nombreApoderado, numeroApoderado (legacy, opcional)
   *  - apoderados: ApoderadoVinculoInput[] -> crea/enlaza apoderados nuevos
   */
  public async store({ request }: HttpContext) {
    const trx = await db.transaction()
    try {
      const data = request.only(['personId', 'nombreApoderado', 'numeroApoderado'])
      const estudiante = await Estudiante.create(data, { client: trx })

      const apoderados: ApoderadoVinculoInput[] = request.input('apoderados', [])
      if (Array.isArray(apoderados) && apoderados.length > 0) {
        await this.attachApoderados(estudiante, apoderados, trx)
      }

      await trx.commit()

      const fresh = await Estudiante.query()
        .where('id', estudiante.id)
        .preload('person')
        .preload('apoderados', (q) => q.pivotColumns(['parentesco', 'es_principal']))
        .firstOrFail()

      return {
        status: 'success',
        message: 'estudiante created successfully',
        data: fresh,
      }
    } catch (error) {
      await trx.rollback()
      return {
        status: 'error',
        message: 'estudiante store error',
        error,
      }
    }
  }

  public async update({ params, request }: HttpContext) {
    const trx = await db.transaction()
    try {
      const estudiante = await Estudiante.query({ client: trx })
        .where('id', params.id)
        .firstOrFail()
      const data = request.only(['personId', 'nombreApoderado', 'numeroApoderado'])
      estudiante.merge(data)
      await estudiante.save()

      // Si vino "apoderados", reemplaza la lista entera (sync semantic)
      const apoderados: ApoderadoVinculoInput[] | undefined = request.input('apoderados')
      if (Array.isArray(apoderados)) {
        await estudiante.related('apoderados').detach([], trx)
        if (apoderados.length > 0) {
          await this.attachApoderados(estudiante, apoderados, trx)
        }
      }

      await trx.commit()

      const fresh = await Estudiante.query()
        .where('id', estudiante.id)
        .preload('person')
        .preload('apoderados', (q) => q.pivotColumns(['parentesco', 'es_principal']))
        .firstOrFail()

      return {
        status: 'success',
        message: 'estudiante updated successfully',
        data: fresh,
      }
    } catch (error) {
      await trx.rollback()
      return {
        status: 'error',
        message: 'estudiante update error',
        error,
      }
    }
  }

  public async destroy({ params }: HttpContext) {
    try {
      const estudiante = await Estudiante.findOrFail(params.id)
      await estudiante.delete()
      return {
        status: 'success',
        message: 'estudiante deleted successfully',
        data: estudiante,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'estudiante delete error',
        error,
      }
    }
  }

  // ---- helpers ----

  private async attachApoderados(
    estudiante: Estudiante,
    apoderados: ApoderadoVinculoInput[],
    trx: any
  ) {
    const Apoderado = (await import('#models/apoderado')).default

    for (const a of apoderados) {
      let apoderadoId = a.apoderadoId

      if (!apoderadoId) {
        // crear nuevo apoderado
        const nuevo = await Apoderado.create(
          {
            dni: a.dni ?? null,
            nombre: a.nombre || 'Apoderado sin nombre',
            apellido: a.apellido ?? null,
            whatsapp: a.whatsapp || 'sin-numero',
            email: a.email ?? null,
            parentesco: a.parentesco ?? null,
          },
          { client: trx }
        )
        apoderadoId = nuevo.id
      }

      await estudiante.related('apoderados').attach(
        {
          [apoderadoId]: {
            parentesco: a.parentesco ?? null,
            es_principal: a.esPrincipal ?? false,
          },
        },
        trx
      )
    }
  }
}

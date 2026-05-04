import Matricula from '#models/matricula'
import Ciclo from '#models/ciclo'
import CuotaMatricula from '#models/cuota_matricula'
import { generarCronograma, borrarCronograma } from '#services/cuotas_service'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'

export default class MatriculasController {
  public async index({}: HttpContext) {
    try {
      const matriculas = await Matricula.query()
        .preload('estudiante', (est) => est.preload('person'))
        .preload('ciclo')
        .preload('turno')
      return {
        status: 'success',
        message: 'matriculas fetched with success',
        data: matriculas,
      }
    } catch (error) {
      return { status: 'error', message: 'matriculas fetch error', error }
    }
  }

  public async show({ params }: HttpContext) {
    try {
      const matricula = await Matricula.query()
        .where('id', params.id)
        .preload('estudiante', (est) => est.preload('person'))
        .preload('ciclo')
        .preload('turno')
        .preload('cuotas')
        .firstOrFail()
      return {
        status: 'success',
        message: 'matricula fetched with success',
        data: matricula,
      }
    } catch (error) {
      return { status: 'error', message: 'matricula fetch error', error }
    }
  }

  public async store({ request }: HttpContext) {
    const trx = await db.transaction()
    try {
      const data = request.only([
        'estudianteId',
        'cicloId',
        'modalidad',
        'turnoId',
        'precioMatricula',
        'precioMensualidad',
        'fechaInicio',
        'fechaFin',
      ])

      // Defaults de fechas: si no se envían, usa las del ciclo
      let fechaInicio = data.fechaInicio ? DateTime.fromISO(data.fechaInicio) : null
      let fechaFin = data.fechaFin ? DateTime.fromISO(data.fechaFin) : null

      if (!fechaInicio || !fechaFin) {
        const ciclo = await Ciclo.find(data.cicloId, { client: trx })
        if (!ciclo) {
          await trx.rollback()
          return { status: 'error', message: 'ciclo no encontrado' }
        }
        fechaInicio = fechaInicio || ciclo.fechaInicio
        fechaFin = fechaFin || ciclo.fechaFin
      }

      // estado siempre arranca pendiente; cambia a 'matriculado' cuando se paga la cuota matrícula
      const matricula = await Matricula.create(
        { ...data, fechaInicio, fechaFin, estado: 'pendiente' },
        { client: trx }
      )

      await generarCronograma({
        matricula,
        fechaInicio: fechaInicio!,
        fechaFin: fechaFin!,
        precioMatricula: Number(data.precioMatricula),
        precioMensualidad: Number(data.precioMensualidad),
        trx,
      })

      await trx.commit()

      const fresh = await Matricula.query()
        .where('id', matricula.id)
        .preload('cuotas')
        .firstOrFail()

      return {
        status: 'success',
        message: 'matricula created with cronograma',
        data: fresh,
      }
    } catch (error) {
      await trx.rollback()
      return { status: 'error', message: 'matricula store error', error }
    }
  }

  public async update({ params, request }: HttpContext) {
    const trx = await db.transaction()
    try {
      const matricula = await Matricula.query({ client: trx }).where('id', params.id).firstOrFail()

      // En update NO aceptamos cambio manual de estado; lo controla el servicio
      // de cuotas según el pago de la cuota tipo matrícula.
      const data = request.only([
        'estudianteId',
        'cicloId',
        'modalidad',
        'turnoId',
        'precioMatricula',
        'precioMensualidad',
        'fechaInicio',
        'fechaFin',
      ])

      const fechasCambian =
        (data.fechaInicio &&
          data.fechaInicio !== matricula.fechaInicio?.toISODate()) ||
        (data.fechaFin && data.fechaFin !== matricula.fechaFin?.toISODate())
      const preciosCambian =
        (data.precioMatricula !== undefined &&
          Number(data.precioMatricula) !== Number(matricula.precioMatricula)) ||
        (data.precioMensualidad !== undefined &&
          Number(data.precioMensualidad) !== Number(matricula.precioMensualidad))

      matricula.merge(data)
      await matricula.save()

      // Si cambian fechas o precios y NO hay pagos validados, regenerar cronograma
      if (fechasCambian || preciosCambian) {
        const tieneValidados = await CuotaMatricula.query({ client: trx })
          .where('matricula_id', matricula.id)
          .whereHas('pagos', (pq) => pq.where('estado', 'validado'))
          .first()

        if (!tieneValidados) {
          await borrarCronograma(matricula.id, trx)
          await generarCronograma({
            matricula,
            fechaInicio: matricula.fechaInicio!,
            fechaFin: matricula.fechaFin!,
            precioMatricula: Number(matricula.precioMatricula),
            precioMensualidad: Number(matricula.precioMensualidad),
            trx,
          })
        }
      }

      await trx.commit()
      return {
        status: 'success',
        message: 'matricula updated successfully',
        data: matricula,
      }
    } catch (error) {
      await trx.rollback()
      return { status: 'error', message: 'matricula update error', error }
    }
  }

  public async destroy({ params }: HttpContext) {
    try {
      const matricula = await Matricula.findOrFail(params.id)
      await matricula.delete()
      return {
        status: 'success',
        message: 'matricula deleted successfully',
        data: matricula,
      }
    } catch (error) {
      return { status: 'error', message: 'matricula delete error', error }
    }
  }
}

import Profesor from '#models/profesor'
import Person from '#models/person'
import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProfesoresController {
  public async index({}: HttpContext) {
    try {
      const profesores = await Profesor.query()
        .preload('person', (q) => q.preload('sede'))
        .preload('cursos')
        .orderBy('id', 'desc')
      return {
        status: 'success',
        message: 'profesores fetched with success',
        data: profesores,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'profesores fetch error',
        error,
      }
    }
  }

  public async show({ params }: HttpContext) {
    try {
      const profesor = await Profesor.query()
        .where('id', params.id)
        .preload('person', (q) => q.preload('sede'))
        .preload('cursos')
        .firstOrFail()
      return {
        status: 'success',
        message: 'profesor fetched with success',
        data: profesor,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'profesor fetch error',
        error,
      }
    }
  }

  /**
   * Crea Person + Profesor + asocia cursos en una sola transacción.
   * Body esperado:
   *   { dni, nombre, apellido, whatsapp, email, sedeId, carrera, cursoIds: number[] }
   */
  public async store({ request }: HttpContext) {
    const trx = await db.transaction()
    try {
      const personData = request.only(['dni', 'nombre', 'apellido', 'whatsapp', 'email', 'sedeId'])
      const person = await Person.create({ ...personData, tipo: 'profesor' }, { client: trx })

      const profesor = await Profesor.create(
        {
          personId: person.id,
          carrera: request.input('carrera') || null,
        },
        { client: trx }
      )

      const cursoIds: number[] = request.input('cursoIds', [])
      if (Array.isArray(cursoIds) && cursoIds.length > 0) {
        await profesor.related('cursos').attach(cursoIds, trx)
      }

      await trx.commit()

      const fresh = await Profesor.query()
        .where('id', profesor.id)
        .preload('person', (q) => q.preload('sede'))
        .preload('cursos')
        .firstOrFail()

      return {
        status: 'success',
        message: 'profesor created successfully',
        data: fresh,
      }
    } catch (error) {
      await trx.rollback()
      return {
        status: 'error',
        message: 'profesor store error',
        error,
      }
    }
  }

  public async update({ params, request }: HttpContext) {
    const trx = await db.transaction()
    try {
      const profesor = await Profesor.query({ client: trx }).where('id', params.id).firstOrFail()
      const person = await Person.query({ client: trx }).where('id', profesor.personId).firstOrFail()

      const personData = request.only(['dni', 'nombre', 'apellido', 'whatsapp', 'email', 'sedeId'])
      person.merge(personData)
      await person.save()

      profesor.merge({ carrera: request.input('carrera', profesor.carrera) })
      await profesor.save()

      if (request.input('cursoIds') !== undefined) {
        const cursoIds: number[] = request.input('cursoIds', [])
        await profesor.related('cursos').sync(cursoIds, true, trx)
      }

      await trx.commit()

      const fresh = await Profesor.query()
        .where('id', profesor.id)
        .preload('person', (q) => q.preload('sede'))
        .preload('cursos')
        .firstOrFail()

      return {
        status: 'success',
        message: 'profesor updated successfully',
        data: fresh,
      }
    } catch (error) {
      await trx.rollback()
      return {
        status: 'error',
        message: 'profesor update error',
        error,
      }
    }
  }

  public async destroy({ params }: HttpContext) {
    const trx = await db.transaction()
    try {
      const profesor = await Profesor.query({ client: trx }).where('id', params.id).firstOrFail()
      const personId = profesor.personId

      await profesor.related('cursos').detach()
      await profesor.useTransaction(trx).delete()
      await Person.query({ client: trx }).where('id', personId).delete()

      await trx.commit()
      return {
        status: 'success',
        message: 'profesor deleted successfully',
        data: { id: profesor.id },
      }
    } catch (error) {
      await trx.rollback()
      return {
        status: 'error',
        message: 'profesor delete error',
        error,
      }
    }
  }
}

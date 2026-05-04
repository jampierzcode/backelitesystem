import Apoderado from '#models/apoderado'
import type { HttpContext } from '@adonisjs/core/http'

export default class ApoderadosController {
  /**
   * Lista apoderados. Acepta ?estudiante_id=... para filtrar por estudiante.
   */
  public async index({ request }: HttpContext) {
    try {
      const query = Apoderado.query()
      const estudianteId = request.input('estudiante_id')
      if (estudianteId) {
        query.whereHas('estudiantes', (q) => q.where('estudiantes.id', estudianteId))
      }
      query.orderBy('nombre', 'asc')

      const apoderados = await query
      return {
        status: 'success',
        message: 'apoderados fetched',
        data: apoderados,
      }
    } catch (error) {
      return { status: 'error', message: 'apoderados fetch error', error }
    }
  }

  public async show({ params }: HttpContext) {
    try {
      const apoderado = await Apoderado.query()
        .where('id', params.id)
        .preload('estudiantes', (q) => q.preload('person'))
        .firstOrFail()
      return { status: 'success', message: 'apoderado fetched', data: apoderado }
    } catch (error) {
      return { status: 'error', message: 'apoderado fetch error', error }
    }
  }

  public async store({ request }: HttpContext) {
    try {
      const data = request.only([
        'dni',
        'nombre',
        'apellido',
        'whatsapp',
        'email',
        'parentesco',
      ])
      const apoderado = await Apoderado.create(data)
      return { status: 'success', message: 'apoderado created', data: apoderado }
    } catch (error) {
      return { status: 'error', message: 'apoderado store error', error }
    }
  }

  public async update({ params, request }: HttpContext) {
    try {
      const apoderado = await Apoderado.findOrFail(params.id)
      const data = request.only([
        'dni',
        'nombre',
        'apellido',
        'whatsapp',
        'email',
        'parentesco',
      ])
      apoderado.merge(data)
      await apoderado.save()
      return { status: 'success', message: 'apoderado updated', data: apoderado }
    } catch (error) {
      return { status: 'error', message: 'apoderado update error', error }
    }
  }

  public async destroy({ params }: HttpContext) {
    try {
      const apoderado = await Apoderado.findOrFail(params.id)
      await apoderado.delete()
      return {
        status: 'success',
        message: 'apoderado deleted',
        data: { id: apoderado.id },
      }
    } catch (error) {
      return { status: 'error', message: 'apoderado delete error', error }
    }
  }
}

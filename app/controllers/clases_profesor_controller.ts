import ClaseProfesor from '#models/clase_profesor'
import type { HttpContext } from '@adonisjs/core/http'

export default class ClasesProfesorController {
  /**
   * Lista clases. Acepta ?profesor_id=... y ?ciclo_id=... como filtros.
   */
  public async index({ request }: HttpContext) {
    try {
      const query = ClaseProfesor.query().preload('curso').preload('ciclo').preload('profesor')

      const profesorId = request.input('profesor_id')
      if (profesorId) query.where('profesor_id', profesorId)

      const cicloId = request.input('ciclo_id')
      if (cicloId) query.where('ciclo_id', cicloId)

      query.orderBy('dia', 'asc').orderBy('hora_inicio', 'asc')

      const clases = await query
      return {
        status: 'success',
        message: 'clases fetched with success',
        data: clases,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'clases fetch error',
        error,
      }
    }
  }

  public async show({ params }: HttpContext) {
    try {
      const clase = await ClaseProfesor.query()
        .where('id', params.id)
        .preload('curso')
        .preload('ciclo')
        .preload('profesor')
        .firstOrFail()
      return {
        status: 'success',
        message: 'clase fetched with success',
        data: clase,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'clase fetch error',
        error,
      }
    }
  }

  public async store({ request, response }: HttpContext) {
    try {
      const data = request.only([
        'profesorId',
        'cursoId',
        'cicloId',
        'dia',
        'horaInicio',
        'horaFin',
        'activo',
      ])

      const validation = this.validateHorario(data.horaInicio, data.horaFin)
      if (validation) {
        return response.badRequest({ status: 'error', message: validation })
      }

      const clase = await ClaseProfesor.create(data)
      const fresh = await ClaseProfesor.query()
        .where('id', clase.id)
        .preload('curso')
        .preload('ciclo')
        .firstOrFail()

      return {
        status: 'success',
        message: 'clase created successfully',
        data: fresh,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'clase store error',
        error,
      }
    }
  }

  public async update({ params, request, response }: HttpContext) {
    try {
      const clase = await ClaseProfesor.findOrFail(params.id)
      const data = request.only([
        'profesorId',
        'cursoId',
        'cicloId',
        'dia',
        'horaInicio',
        'horaFin',
        'activo',
      ])

      const horaInicio = data.horaInicio ?? clase.horaInicio
      const horaFin = data.horaFin ?? clase.horaFin
      const validation = this.validateHorario(horaInicio, horaFin)
      if (validation) {
        return response.badRequest({ status: 'error', message: validation })
      }

      clase.merge(data)
      await clase.save()

      const fresh = await ClaseProfesor.query()
        .where('id', clase.id)
        .preload('curso')
        .preload('ciclo')
        .firstOrFail()

      return {
        status: 'success',
        message: 'clase updated successfully',
        data: fresh,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'clase update error',
        error,
      }
    }
  }

  public async destroy({ params }: HttpContext) {
    try {
      const clase = await ClaseProfesor.findOrFail(params.id)
      await clase.delete()
      return {
        status: 'success',
        message: 'clase deleted successfully',
        data: { id: clase.id },
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'clase delete error',
        error,
      }
    }
  }

  private validateHorario(horaInicio?: string, horaFin?: string): string | null {
    if (!horaInicio || !horaFin) return null
    if (horaFin <= horaInicio) {
      return 'hora_fin debe ser mayor que hora_inicio'
    }
    return null
  }
}

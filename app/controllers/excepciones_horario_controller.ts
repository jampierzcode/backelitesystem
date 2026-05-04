import ExcepcionHorario from '#models/excepcion_horario'
import type { HttpContext } from '@adonisjs/core/http'

export default class ExcepcionesHorarioController {
  /**
   * Lista excepciones. Filtros: ?sede_id=, ?desde=YYYY-MM-DD, ?hasta=YYYY-MM-DD
   */
  public async index({ request }: HttpContext) {
    try {
      const query = ExcepcionHorario.query()

      const sedeId = request.input('sede_id')
      if (sedeId !== undefined && sedeId !== null && sedeId !== '') {
        query.where('sede_id', sedeId)
      }

      const desde = request.input('desde')
      if (desde) query.where('fecha', '>=', desde)
      const hasta = request.input('hasta')
      if (hasta) query.where('fecha', '<=', hasta)

      query.orderBy('fecha', 'asc')

      const excepciones = await query
      return {
        status: 'success',
        message: 'excepciones fetched',
        data: excepciones,
      }
    } catch (error) {
      return { status: 'error', message: 'excepciones fetch error', error }
    }
  }

  public async show({ params }: HttpContext) {
    try {
      const exc = await ExcepcionHorario.findOrFail(params.id)
      return { status: 'success', message: 'excepcion fetched', data: exc }
    } catch (error) {
      return { status: 'error', message: 'excepcion fetch error', error }
    }
  }

  public async store({ request, response }: HttpContext) {
    try {
      const data = request.only([
        'sedeId',
        'fecha',
        'tipo',
        'horaInicio',
        'horaFin',
        'motivo',
      ])

      if (!data.fecha || !data.tipo) {
        return response.badRequest({
          status: 'error',
          message: 'fecha y tipo son requeridos',
        })
      }
      if (data.tipo === 'horario_especial' && (!data.horaInicio || !data.horaFin)) {
        return response.badRequest({
          status: 'error',
          message: 'horario_especial requiere horaInicio y horaFin',
        })
      }
      if (data.horaFin && data.horaInicio && data.horaFin <= data.horaInicio) {
        return response.badRequest({
          status: 'error',
          message: 'horaFin debe ser mayor que horaInicio',
        })
      }

      const exc = await ExcepcionHorario.create(data)
      return { status: 'success', message: 'excepcion creada', data: exc }
    } catch (error) {
      return { status: 'error', message: 'excepcion store error', error }
    }
  }

  public async update({ params, request, response }: HttpContext) {
    try {
      const exc = await ExcepcionHorario.findOrFail(params.id)
      const data = request.only([
        'sedeId',
        'fecha',
        'tipo',
        'horaInicio',
        'horaFin',
        'motivo',
      ])

      const tipo = data.tipo ?? exc.tipo
      const horaInicio = data.horaInicio ?? exc.horaInicio
      const horaFin = data.horaFin ?? exc.horaFin

      if (tipo === 'horario_especial' && (!horaInicio || !horaFin)) {
        return response.badRequest({
          status: 'error',
          message: 'horario_especial requiere horaInicio y horaFin',
        })
      }
      if (horaFin && horaInicio && horaFin <= horaInicio) {
        return response.badRequest({
          status: 'error',
          message: 'horaFin debe ser mayor que horaInicio',
        })
      }

      exc.merge(data)
      await exc.save()
      return { status: 'success', message: 'excepcion updated', data: exc }
    } catch (error) {
      return { status: 'error', message: 'excepcion update error', error }
    }
  }

  public async destroy({ params }: HttpContext) {
    try {
      const exc = await ExcepcionHorario.findOrFail(params.id)
      await exc.delete()
      return {
        status: 'success',
        message: 'excepcion deleted',
        data: { id: exc.id },
      }
    } catch (error) {
      return { status: 'error', message: 'excepcion delete error', error }
    }
  }
}

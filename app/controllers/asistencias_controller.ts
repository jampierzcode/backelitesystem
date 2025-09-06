// app/controllers/asistencias_controller.ts
import Asistencia from '#models/asistencia'
import type { HttpContext } from '@adonisjs/core/http'

export default class AsistenciasController {
  public async index({ request }: HttpContext) {
    try {
      const fechaInicio = request.input('fechaInicio')
      const fechaFin = request.input('fechaFin')
      const estado = request.input('estado')

      const query = Asistencia.query()
        .preload('estudiante', (est) => {
          est.preload('person')
        })
        .preload('recorder')

      console.log(query)

      // Filtro por rango de fechas
      if (fechaInicio && fechaFin) {
        query.whereBetween('fecha', [fechaInicio, fechaFin])
      } else if (fechaInicio) {
        query.where('fecha', fechaInicio)
      }

      // Filtro por estado
      if (estado) {
        query.where('estado', estado)
      }

      const asistencias = await query

      return {
        status: 'success',
        message: 'asistencias fetched successfully',
        data: asistencias,
      }
    } catch (error) {
      console.log(error)
      return {
        status: 'error',
        message: 'asistencias fetch error',
        error,
      }
    }
  }

  public async show({ params }: HttpContext) {
    try {
      const asistencia = await Asistencia.findOrFail(params.id)
      await asistencia.load('estudiante')
      await asistencia.load('recorder')

      return {
        status: 'success',
        message: 'asistencia fetched successfully',
        data: asistencia,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'asistencia fetch error',
        error,
      }
    }
  }

  public async store({ request, auth }: HttpContext) {
    try {
      await auth.check()

      const data = request.only(['estudianteId', 'fecha', 'horaEntrada', 'horaSalida', 'estado'])
      const newData = { ...data, recorderId: auth?.user!.id }

      const asistencia = await Asistencia.create(newData)

      return {
        status: 'success',
        message: 'asistencia created successfully',
        data: asistencia,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'asistencia store error',
        error,
      }
    }
  }

  public async update({ params, request }: HttpContext) {
    try {
      const asistencia = await Asistencia.findOrFail(params.id)

      const data = request.only([
        'estudianteId',
        'recorderId',
        'fecha',
        'horaEntrada',
        'horaSalida',
        'estado',
      ])

      asistencia.merge(data)
      await asistencia.save()

      return {
        status: 'success',
        message: 'asistencia updated successfully',
        data: asistencia,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'asistencia update error',
        error,
      }
    }
  }

  public async destroy({ params }: HttpContext) {
    try {
      const asistencia = await Asistencia.findOrFail(params.id)
      await asistencia.delete()

      return {
        status: 'success',
        message: 'asistencia deleted successfully',
        data: asistencia,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'asistencia delete error',
        error,
      }
    }
  }
}

import Schedule from '#models/schedule'
import type { HttpContext } from '@adonisjs/core/http'

export default class SchedulesController {
  public async index({}: HttpContext) {
    try {
      const schedules = await Schedule.all()
      return {
        status: 'success',
        message: 'schedules fetched successfully',
        data: schedules,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'schedules fetch error',
        error,
      }
    }
  }

  public async show({ params }: HttpContext) {
    try {
      const schedule = await Schedule.findOrFail(params.id)
      return {
        status: 'success',
        message: 'schedule fetched successfully',
        data: schedule,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'schedule fetch error',
        error,
      }
    }
  }

  public async store({ request }: HttpContext) {
    try {
      const data = request.only(['dia', 'horaInicio', 'horaFin', 'activo'])
      const schedule = await Schedule.create(data)
      return {
        status: 'success',
        message: 'schedule created successfully',
        data: schedule,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'schedule store error',
        error,
      }
    }
  }

  public async update({ params, request }: HttpContext) {
    try {
      const schedule = await Schedule.findOrFail(params.id)
      const data = request.only(['dia', 'horaInicio', 'horaFin', 'activo'])
      schedule.merge(data)
      await schedule.save()
      return {
        status: 'success',
        message: 'schedule updated successfully',
        data: schedule,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'schedule update error',
        error,
      }
    }
  }

  public async destroy({ params }: HttpContext) {
    try {
      const schedule = await Schedule.findOrFail(params.id)
      await schedule.delete()
      return {
        status: 'success',
        message: 'schedule deleted successfully',
        data: schedule,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'schedule delete error',
        error,
      }
    }
  }
}

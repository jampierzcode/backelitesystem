import Ciclo from '#models/ciclo'
import type { HttpContext } from '@adonisjs/core/http'

export default class CiclosController {
  public async index({}: HttpContext) {
    try {
      const ciclos = await Ciclo.all()
      return {
        status: 'success',
        message: 'ciclos fetched with success',
        data: ciclos,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'ciclos fetch error',
        error,
      }
    }
  }

  public async show({ params }: HttpContext) {
    try {
      const ciclo = await Ciclo.findOrFail(params.id)
      return {
        status: 'success',
        message: 'ciclo fetched with success',
        data: ciclo,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'ciclo fetch error',
        error,
      }
    }
  }

  public async store({ request }: HttpContext) {
    try {
      const data = request.only(['nombre', 'fechaInicio', 'fechaFin', 'status'])
      const ciclo = await Ciclo.create(data)
      return {
        status: 'success',
        message: 'ciclo created successfully',
        data: ciclo,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'ciclo store error',
        error,
      }
    }
  }

  public async update({ params, request }: HttpContext) {
    try {
      const ciclo = await Ciclo.findOrFail(params.id)
      const data = request.only(['nombre', 'fechaInicio', 'fechaFin', 'status'])
      ciclo.merge(data)
      await ciclo.save()
      return {
        status: 'success',
        message: 'ciclo updated successfully',
        data: ciclo,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'ciclo update error',
        error,
      }
    }
  }

  public async destroy({ params }: HttpContext) {
    try {
      const ciclo = await Ciclo.findOrFail(params.id)
      await ciclo.delete()
      return {
        status: 'success',
        message: 'ciclo deleted successfully',
        data: ciclo,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'ciclo delete error',
        error,
      }
    }
  }
}

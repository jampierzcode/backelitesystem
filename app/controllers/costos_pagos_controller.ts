import CostoPago from '#models/costo_pago'
import type { HttpContext } from '@adonisjs/core/http'

export default class CostoPagosController {
  public async index({}: HttpContext) {
    try {
      const costos = await CostoPago.all()
      return {
        status: 'success',
        message: 'costos pagos fetched with success',
        data: costos,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'costos pagos fetch error',
        error,
      }
    }
  }

  public async show({ params }: HttpContext) {
    try {
      const costo = await CostoPago.findOrFail(params.id)
      return {
        status: 'success',
        message: 'costo pago fetched with success',
        data: costo,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'costo pago fetch error',
        error,
      }
    }
  }

  public async store({ request }: HttpContext) {
    try {
      const data = request.only(['nombre', 'precio'])
      const costo = await CostoPago.create(data)
      return {
        status: 'success',
        message: 'costo pago created successfully',
        data: costo,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'costo pago store error',
        error,
      }
    }
  }

  public async update({ params, request }: HttpContext) {
    try {
      const costo = await CostoPago.findOrFail(params.id)
      const data = request.only(['nombre', 'precio'])
      costo.merge(data)
      await costo.save()
      return {
        status: 'success',
        message: 'costo pago updated successfully',
        data: costo,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'costo pago update error',
        error,
      }
    }
  }

  public async destroy({ params }: HttpContext) {
    try {
      const costo = await CostoPago.findOrFail(params.id)
      await costo.delete()
      return {
        status: 'success',
        message: 'costo pago deleted successfully',
        data: costo,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'costo pago delete error',
        error,
      }
    }
  }
}

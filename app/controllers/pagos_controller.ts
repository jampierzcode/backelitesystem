import Pago from '#models/pago'
import type { HttpContext } from '@adonisjs/core/http'

export default class PagosController {
  public async index({}: HttpContext) {
    try {
      const pagos = await Pago.all()
      return {
        status: 'success',
        message: 'pagos fetched with success',
        data: pagos,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'pagos fetch error',
        error,
      }
    }
  }

  public async show({ params }: HttpContext) {
    try {
      const pago = await Pago.findOrFail(params.id)
      return {
        status: 'success',
        message: 'pago fetched with success',
        data: pago,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'pago fetch error',
        error,
      }
    }
  }

  public async store({ request }: HttpContext) {
    try {
      const data = request.only([
        'matriculaId',
        'tipo',
        'metodo',
        'monto',
        'codigoOperacion',
        'imagenVoucherUrl',
        'estado',
      ])
      const pago = await Pago.create(data)
      return {
        status: 'success',
        message: 'pago created successfully',
        data: pago,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'pago store error',
        error,
      }
    }
  }

  public async update({ params, request }: HttpContext) {
    try {
      const pago = await Pago.findOrFail(params.id)
      const data = request.only([
        'matriculaId',
        'tipo',
        'metodo',
        'monto',
        'codigoOperacion',
        'imagenVoucherUrl',
        'estado',
      ])
      pago.merge(data)
      await pago.save()
      return {
        status: 'success',
        message: 'pago updated successfully',
        data: pago,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'pago update error',
        error,
      }
    }
  }

  public async destroy({ params }: HttpContext) {
    try {
      const pago = await Pago.findOrFail(params.id)
      await pago.delete()
      return {
        status: 'success',
        message: 'pago deleted successfully',
        data: pago,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'pago delete error',
        error,
      }
    }
  }
}

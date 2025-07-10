import Conversacion from '#models/conversacion'
import type { HttpContext } from '@adonisjs/core/http'

export default class ConversacionesController {
  public async index({}: HttpContext) {
    try {
      const conversaciones = await Conversacion.all()
      return {
        status: 'success',
        message: 'conversaciones fetched with success',
        data: conversaciones,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'conversaciones fetch error',
        error,
      }
    }
  }

  public async show({ params }: HttpContext) {
    try {
      const conversacion = await Conversacion.findOrFail(params.id)
      return {
        status: 'success',
        message: 'conversacion fetched with success',
        data: conversacion,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'conversacion fetch error',
        error,
      }
    }
  }

  public async store({ request }: HttpContext) {
    try {
      const data = request.only(['numeroWhatsapp', 'estadoActual', 'ultimoMensaje'])
      const conversacion = await Conversacion.create(data)
      return {
        status: 'success',
        message: 'conversacion created successfully',
        data: conversacion,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'conversacion store error',
        error,
      }
    }
  }

  public async update({ params, request }: HttpContext) {
    try {
      const conversacion = await Conversacion.findOrFail(params.id)
      const data = request.only(['numeroWhatsapp', 'estadoActual', 'ultimoMensaje'])
      conversacion.merge(data)
      await conversacion.save()
      return {
        status: 'success',
        message: 'conversacion updated successfully',
        data: conversacion,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'conversacion update error',
        error,
      }
    }
  }

  public async destroy({ params }: HttpContext) {
    try {
      const conversacion = await Conversacion.findOrFail(params.id)
      await conversacion.delete()
      return {
        status: 'success',
        message: 'conversacion deleted successfully',
        data: conversacion,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'conversacion delete error',
        error,
      }
    }
  }
}

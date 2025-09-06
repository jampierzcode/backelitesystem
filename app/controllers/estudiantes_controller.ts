import Estudiante from '#models/estudiante'
import type { HttpContext } from '@adonisjs/core/http'

export default class EstudiantesController {
  public async index({}: HttpContext) {
    try {
      const estudiantes = await Estudiante.query().preload('person')
      return {
        status: 'success',
        message: 'estudiantes fetched with success',
        data: estudiantes,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'estudiantes fetch error',
        error,
      }
    }
  }

  public async show({ params }: HttpContext) {
    try {
      const estudiante = await Estudiante.findOrFail(params.id)
      return {
        status: 'success',
        message: 'estudiante fetched with success',
        data: estudiante,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'estudiante fetch error',
        error,
      }
    }
  }

  public async store({ request }: HttpContext) {
    try {
      const data = request.only(['personId', 'nombreApoderado', 'numeroApoderado'])
      const estudiante = await Estudiante.create(data)
      return {
        status: 'success',
        message: 'estudiante created successfully',
        data: estudiante,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'estudiante store error',
        error,
      }
    }
  }

  public async update({ params, request }: HttpContext) {
    try {
      const estudiante = await Estudiante.findOrFail(params.id)
      const data = request.only(['personId', 'nombreApoderado', 'numeroApoderado'])
      estudiante.merge(data)
      await estudiante.save()
      return {
        status: 'success',
        message: 'estudiante updated successfully',
        data: estudiante,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'estudiante update error',
        error,
      }
    }
  }

  public async destroy({ params }: HttpContext) {
    try {
      const estudiante = await Estudiante.findOrFail(params.id)
      await estudiante.delete()
      return {
        status: 'success',
        message: 'estudiante deleted successfully',
        data: estudiante,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'estudiante delete error',
        error,
      }
    }
  }
}

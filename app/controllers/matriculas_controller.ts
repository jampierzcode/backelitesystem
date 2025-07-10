import Matricula from '#models/matricula'
import type { HttpContext } from '@adonisjs/core/http'

export default class MatriculasController {
  public async index({}: HttpContext) {
    try {
      const matriculas = await Matricula.all()
      return {
        status: 'success',
        message: 'matriculas fetched with success',
        data: matriculas,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'matriculas fetch error',
        error,
      }
    }
  }

  public async show({ params }: HttpContext) {
    try {
      const matricula = await Matricula.findOrFail(params.id)
      return {
        status: 'success',
        message: 'matricula fetched with success',
        data: matricula,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'matricula fetch error',
        error,
      }
    }
  }

  public async store({ request }: HttpContext) {
    try {
      const data = request.only([
        'estudianteId',
        'cicloId',
        'modalidad',
        'turno',
        'precioMatricula',
        'precioMensualidad',
        'estado',
      ])
      const matricula = await Matricula.create(data)
      return {
        status: 'success',
        message: 'matricula created successfully',
        data: matricula,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'matricula store error',
        error,
      }
    }
  }

  public async update({ params, request }: HttpContext) {
    try {
      const matricula = await Matricula.findOrFail(params.id)
      const data = request.only([
        'estudianteId',
        'cicloId',
        'modalidad',
        'turno',
        'precioMatricula',
        'precioMensualidad',
        'estado',
      ])
      matricula.merge(data)
      await matricula.save()
      return {
        status: 'success',
        message: 'matricula updated successfully',
        data: matricula,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'matricula update error',
        error,
      }
    }
  }

  public async destroy({ params }: HttpContext) {
    try {
      const matricula = await Matricula.findOrFail(params.id)
      await matricula.delete()
      return {
        status: 'success',
        message: 'matricula deleted successfully',
        data: matricula,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'matricula delete error',
        error,
      }
    }
  }
}

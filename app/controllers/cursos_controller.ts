import Curso from '#models/curso'
import type { HttpContext } from '@adonisjs/core/http'

export default class CursosController {
  public async index({}: HttpContext) {
    try {
      const cursos = await Curso.query().orderBy('nombre', 'asc')
      return {
        status: 'success',
        message: 'cursos fetched with success',
        data: cursos,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'cursos fetch error',
        error,
      }
    }
  }

  public async show({ params }: HttpContext) {
    try {
      const curso = await Curso.findOrFail(params.id)
      return {
        status: 'success',
        message: 'curso fetched with success',
        data: curso,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'curso fetch error',
        error,
      }
    }
  }

  public async store({ request }: HttpContext) {
    try {
      const data = request.only(['nombre', 'descripcion', 'activo'])
      const curso = await Curso.create(data)
      return {
        status: 'success',
        message: 'curso created successfully',
        data: curso,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'curso store error',
        error,
      }
    }
  }

  public async update({ params, request }: HttpContext) {
    try {
      const curso = await Curso.findOrFail(params.id)
      const data = request.only(['nombre', 'descripcion', 'activo'])
      curso.merge(data)
      await curso.save()
      return {
        status: 'success',
        message: 'curso updated successfully',
        data: curso,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'curso update error',
        error,
      }
    }
  }

  public async destroy({ params }: HttpContext) {
    try {
      const curso = await Curso.findOrFail(params.id)
      await curso.delete()
      return {
        status: 'success',
        message: 'curso deleted successfully',
        data: curso,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'curso delete error',
        error,
      }
    }
  }
}

import Person from '#models/person'
import type { HttpContext } from '@adonisjs/core/http'

export default class PersonsController {
  public async index({}: HttpContext) {
    try {
      const persons = await Person.query().preload('estudiante')

      return {
        status: 'success',
        message: 'persons fetched with success',
        data: persons,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'persons fetch error',
        error,
      }
    }
  }

  public async show({ params }: HttpContext) {
    try {
      const person = await Person.findOrFail(params.id)
      return {
        status: 'success',
        message: 'person fetched with success',
        data: person,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'person fetch error',
        error,
      }
    }
  }

  public async store({ request }: HttpContext) {
    try {
      const data = request.only([
        'dni',
        'nombre',
        'apellido',
        'whatsapp',
        'email',
        'tipo',
        'sedeId',
      ])
      console.log(data)
      const person = await Person.create(data)
      return {
        status: 'success',
        message: 'person created successfully',
        data: person,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'person store error',
        error,
      }
    }
  }

  public async update({ params, request }: HttpContext) {
    try {
      const person = await Person.findOrFail(params.id)
      const data = request.only([
        'dni',
        'nombre',
        'apellido',
        'whatsapp',
        'email',
        'tipo',
        'sedeId',
      ])
      person.merge(data)
      await person.save()
      return {
        status: 'success',
        message: 'person updated successfully',
        data: person,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'person update error',
        error,
      }
    }
  }

  public async destroy({ params }: HttpContext) {
    try {
      const person = await Person.findOrFail(params.id)
      await person.delete()
      return {
        status: 'success',
        message: 'person deleted successfully',
        data: person,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'person delete error',
        error,
      }
    }
  }
}

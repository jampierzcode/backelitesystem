import Turno from '#models/turno'
import type { HttpContext } from '@adonisjs/core/http'

export default class TurnosController {
  public async index({}: HttpContext) {
    try {
      const items = await Turno.query().orderBy('orden', 'asc').orderBy('id', 'asc')
      return { status: 'success', data: items }
    } catch (error) {
      return { status: 'error', message: 'turnos fetch error', error }
    }
  }

  public async store({ request }: HttpContext) {
    try {
      const data = request.only(['nombre', 'horaInicio', 'horaFin', 'activo', 'orden'])
      const item = await Turno.create({
        ...data,
        activo: data.activo ?? true,
        orden: data.orden ?? 0,
      })
      return { status: 'success', data: item }
    } catch (error) {
      return { status: 'error', message: 'turno store error', error }
    }
  }

  public async update({ params, request }: HttpContext) {
    try {
      const item = await Turno.findOrFail(params.id)
      const data = request.only(['nombre', 'horaInicio', 'horaFin', 'activo', 'orden'])
      item.merge(data)
      await item.save()
      return { status: 'success', data: item }
    } catch (error) {
      return { status: 'error', message: 'turno update error', error }
    }
  }

  public async destroy({ params }: HttpContext) {
    try {
      const item = await Turno.findOrFail(params.id)
      await item.delete()
      return { status: 'success', data: { id: item.id } }
    } catch (error) {
      return { status: 'error', message: 'turno delete error', error }
    }
  }

  /** GET /api/public/turnos — para que el sitio público arme el select */
  public async indexPublico({}: HttpContext) {
    try {
      const items = await Turno.query()
        .where('activo', true)
        .orderBy('orden', 'asc')
        .orderBy('id', 'asc')
      return { status: 'success', data: items }
    } catch (error) {
      return { status: 'error', message: 'turnos publico error', error }
    }
  }
}

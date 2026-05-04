import PoliticaAsistencia from '#models/politica_asistencia'
import type { HttpContext } from '@adonisjs/core/http'

export default class PoliticasAsistenciaController {
  public async index({}: HttpContext) {
    try {
      const items = await PoliticaAsistencia.query().preload('sede').orderBy('id', 'asc')
      return { status: 'success', message: 'politicas fetched', data: items }
    } catch (error) {
      return { status: 'error', message: 'politicas fetch error', error }
    }
  }

  public async show({ params }: HttpContext) {
    try {
      const item = await PoliticaAsistencia.query()
        .where('id', params.id)
        .preload('sede')
        .firstOrFail()
      return { status: 'success', message: 'politica fetched', data: item }
    } catch (error) {
      return { status: 'error', message: 'politica fetch error', error }
    }
  }

  public async store({ request }: HttpContext) {
    try {
      const data = request.only([
        'sedeId',
        'toleranciaMinutosTardanza',
        'permiteMarcarFueraHorario',
      ])
      const item = await PoliticaAsistencia.create(data)
      return { status: 'success', message: 'politica creada', data: item }
    } catch (error) {
      return { status: 'error', message: 'politica store error', error }
    }
  }

  public async update({ params, request }: HttpContext) {
    try {
      const item = await PoliticaAsistencia.findOrFail(params.id)
      const data = request.only([
        'sedeId',
        'toleranciaMinutosTardanza',
        'permiteMarcarFueraHorario',
      ])
      item.merge(data)
      await item.save()
      return { status: 'success', message: 'politica updated', data: item }
    } catch (error) {
      return { status: 'error', message: 'politica update error', error }
    }
  }

  public async destroy({ params }: HttpContext) {
    try {
      const item = await PoliticaAsistencia.findOrFail(params.id)
      await item.delete()
      return { status: 'success', message: 'politica deleted', data: { id: item.id } }
    } catch (error) {
      return { status: 'error', message: 'politica delete error', error }
    }
  }
}

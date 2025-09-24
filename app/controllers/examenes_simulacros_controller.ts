import ExamenSimulacro from '#models/examen_simulacro'
import type { HttpContext } from '@adonisjs/core/http'

export default class ExamenesSimulacroController {
  public async index({ response }: HttpContext) {
    const examenes = await ExamenSimulacro.all()
    return response.json(examenes)
  }

  public async show({ params, response }: HttpContext) {
    const examen = await ExamenSimulacro.query()
      .where('id', params.id)
      .preload('notas', (notaQuery) => {
        notaQuery.preload('estudiante', (estQuery) => {
          estQuery.preload('person')
        })
      })
      .firstOrFail()

    return response.json(examen)
  }

  public async store({ request, response }: HttpContext) {
    const data = request.only([
      'estado',
      'fecha',
      'horaInicio',
      'horaFin',
      'fecha_reprogramacion',
      'documento_url',
      'canal',
    ])
    const examen = await ExamenSimulacro.create(data)
    return response.status(201).json(examen)
  }

  public async update({ params, request, response }: HttpContext) {
    const examen = await ExamenSimulacro.findOrFail(params.id)
    const data = request.only([
      'estado',
      'fecha',
      'horaInicio',
      'horaFin',
      'fecha_reprogramacion',
      'documento_url',
      'canal',
    ])
    examen.merge(data)
    await examen.save()
    return response.json(examen)
  }

  public async destroy({ params, response }: HttpContext) {
    const examen = await ExamenSimulacro.findOrFail(params.id)
    await examen.delete()
    return response.noContent()
  }
}

import ExamenSimulacro from '#models/examen_simulacro'
import NotaSimulacro from '#models/nota_simulacro'
import type { HttpContext } from '@adonisjs/core/http'

export default class NotasSimulacroController {
  public async index({ response }: HttpContext) {
    const notas = await NotaSimulacro.query()
      .preload('estudiante', (est) => est.preload('person'))
      .preload('examen')
    return response.json(notas)
  }

  public async store({ request, response }: HttpContext) {
    const { examen_id, estudiante_id, nota } = request.only(['examen_id', 'estudiante_id', 'nota'])

    // Verificar que el examen esté iniciado
    const examen = await ExamenSimulacro.findOrFail(examen_id)
    if (examen.estado !== 'iniciado') {
      return response
        .status(400)
        .json({ error: 'Solo se pueden registrar notas para exámenes iniciados' })
    }

    const notaRecord = await NotaSimulacro.create({
      examenId: examen_id,
      estudianteId: estudiante_id,
      nota,
    })

    return response.status(201).json(notaRecord)
  }

  public async update({ params, request, response }: HttpContext) {
    const nota = await NotaSimulacro.findOrFail(params.id)
    nota.merge(request.only(['nota']))
    await nota.save()
    return response.json(nota)
  }

  public async destroy({ params, response }: HttpContext) {
    const nota = await NotaSimulacro.findOrFail(params.id)
    await nota.delete()
    return response.noContent()
  }
}

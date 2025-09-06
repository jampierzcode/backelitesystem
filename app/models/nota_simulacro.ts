import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import ExamenSimulacro from './examen_simulacro.js'
import Estudiante from './estudiante.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class NotaSimulacro extends BaseModel {
  static table = 'notas_simulacro'

  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public examenId: number

  @column()
  declare public estudianteId: number

  @column()
  declare public nota: number

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime

  @belongsTo(() => ExamenSimulacro)
  declare public examen: BelongsTo<typeof ExamenSimulacro>

  @belongsTo(() => Estudiante)
  declare public estudiante: BelongsTo<typeof Estudiante>
}

// app/models/asistencia.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Estudiante from './estudiante.js'
import User from './user.js'

export default class Asistencia extends BaseModel {
  static table = 'asistencias'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'estudiante_id' })
  declare estudianteId: number

  @belongsTo(() => Estudiante)
  declare estudiante: BelongsTo<typeof Estudiante>

  @column({ columnName: 'recorder_id' })
  declare recorderId: number | null

  @belongsTo(() => User, { foreignKey: 'recorderId' })
  declare recorder: BelongsTo<typeof User>

  @column.date() // 👈 Para tipo DATE en DB
  declare public fecha: DateTime

  @column.dateTime({ columnName: 'hora_entrada' })
  declare horaEntrada: DateTime | null

  @column.dateTime({ columnName: 'hora_salida' })
  declare horaSalida: DateTime | null

  @column()
  declare estado: 'presente' | 'tardanza' | 'falta' | 'justificada'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: false, autoUpdate: true })
  declare updatedAt: DateTime | null
}

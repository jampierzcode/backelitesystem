import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Profesor from './profesor.js'
import Curso from './curso.js'
import Ciclo from './ciclo.js'
import Turno from './turno.js'

export type DiaSemana =
  | 'Lunes'
  | 'Martes'
  | 'Miércoles'
  | 'Jueves'
  | 'Viernes'
  | 'Sábado'
  | 'Domingo'

export default class ClaseProfesor extends BaseModel {
  static table = 'clases_profesor'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'profesor_id' })
  declare profesorId: number

  @column({ columnName: 'curso_id' })
  declare cursoId: number

  @column({ columnName: 'ciclo_id' })
  declare cicloId: number | null

  @column({ columnName: 'turno_id' })
  declare turnoId: number | null

  @belongsTo(() => Turno)
  declare turno: BelongsTo<typeof Turno>

  @column()
  declare dia: DiaSemana

  @column({ columnName: 'hora_inicio' })
  declare horaInicio: string

  @column({ columnName: 'hora_fin' })
  declare horaFin: string

  @column()
  declare activo: boolean

  @belongsTo(() => Profesor)
  declare profesor: BelongsTo<typeof Profesor>

  @belongsTo(() => Curso)
  declare curso: BelongsTo<typeof Curso>

  @belongsTo(() => Ciclo)
  declare ciclo: BelongsTo<typeof Ciclo>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: false, autoUpdate: true })
  declare updatedAt: DateTime | null
}

// app/models/estudiante.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'

import Person from './person.js'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Estudiante extends BaseModel {
  static table = 'estudiantes'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'person_id' })
  declare personId: number

  @belongsTo(() => Person)
  declare person: BelongsTo<typeof Person>

  @column({ columnName: 'nombre_apoderado' })
  declare nombreApoderado: string

  @column({ columnName: 'numero_apoderado' })
  declare numeroApoderado: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: false, autoUpdate: true })
  declare updatedAt: DateTime | null
}

// app/models/estudiante.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, manyToMany } from '@adonisjs/lucid/orm'

import Person from './person.js'
import Apoderado from './apoderado.js'

import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'

export default class Estudiante extends BaseModel {
  static table = 'estudiantes'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'person_id' })
  declare personId: number

  @belongsTo(() => Person)
  declare person: BelongsTo<typeof Person>

  // Columnas legacy — mantenidas hasta que confirmemos que nada las consulta.
  // El flujo nuevo usa la relación M:N con Apoderado.
  @column({ columnName: 'nombre_apoderado' })
  declare nombreApoderado: string | null

  @column({ columnName: 'numero_apoderado' })
  declare numeroApoderado: string | null

  @manyToMany(() => Apoderado, {
    pivotTable: 'estudiante_apoderado',
    pivotForeignKey: 'estudiante_id',
    pivotRelatedForeignKey: 'apoderado_id',
    pivotColumns: ['parentesco', 'es_principal'],
  })
  declare apoderados: ManyToMany<typeof Apoderado>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: false, autoUpdate: true })
  declare updatedAt: DateTime | null
}

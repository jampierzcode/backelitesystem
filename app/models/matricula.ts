// app/models/matricula.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'

import Estudiante from './estudiante.js'
import Ciclo from './ciclo.js'
import CuotaMatricula from './cuota_matricula.js'
import Turno from './turno.js'

import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export default class Matricula extends BaseModel {
  static table = 'matriculas'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'estudiante_id' })
  declare estudianteId: number

  @belongsTo(() => Estudiante)
  declare estudiante: BelongsTo<typeof Estudiante>

  @column({ columnName: 'ciclo_id' })
  declare cicloId: number

  @belongsTo(() => Ciclo)
  declare ciclo: BelongsTo<typeof Ciclo>

  @column()
  declare modalidad: 'presencial' | 'virtual'

  @column({ columnName: 'turno_id' })
  declare turnoId: number | null

  @belongsTo(() => Turno)
  declare turno: BelongsTo<typeof Turno>

  @column({ columnName: 'precio_matricula' })
  declare precioMatricula: number

  @column({ columnName: 'precio_mensualidad' })
  declare precioMensualidad: number

  @column()
  declare estado: 'pendiente' | 'matriculado'

  @column.date({ columnName: 'fecha_inicio' })
  declare fechaInicio: DateTime | null

  @column.date({ columnName: 'fecha_fin' })
  declare fechaFin: DateTime | null

  @hasMany(() => CuotaMatricula, { foreignKey: 'matriculaId' })
  declare cuotas: HasMany<typeof CuotaMatricula>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: false, autoUpdate: true })
  declare updatedAt: DateTime | null
}

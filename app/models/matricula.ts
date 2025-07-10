// app/models/matricula.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'

import Estudiante from './estudiante.js'
import Ciclo from './ciclo.js'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

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

  @column()
  declare turno: 'MAÑANA' | 'TARDE'

  @column({ columnName: 'precio_matricula' })
  declare precioMatricula: number

  @column({ columnName: 'precio_mensualidad' })
  declare precioMensualidad: number

  @column()
  declare estado: 'pendiente' | 'matriculado'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: false, autoUpdate: true })
  declare updatedAt: DateTime | null
}

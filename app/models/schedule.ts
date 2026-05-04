import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

import Sede from './sede.js'

export default class Schedule extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'sede_id' })
  declare sedeId: number | null

  @belongsTo(() => Sede)
  declare sede: BelongsTo<typeof Sede>

  @column()
  declare dia: string

  @column({ columnName: 'hora_inicio' })
  declare horaInicio: string

  @column({ columnName: 'hora_fin' })
  declare horaFin: string

  @column()
  declare activo: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

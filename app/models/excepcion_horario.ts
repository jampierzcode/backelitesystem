import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Sede from './sede.js'

export type TipoExcepcion = 'cerrado_total' | 'horario_especial'

export default class ExcepcionHorario extends BaseModel {
  static table = 'excepciones_horario'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'sede_id' })
  declare sedeId: number | null

  @belongsTo(() => Sede)
  declare sede: BelongsTo<typeof Sede>

  @column.date()
  declare fecha: DateTime

  @column()
  declare tipo: TipoExcepcion

  @column({ columnName: 'hora_inicio' })
  declare horaInicio: string | null

  @column({ columnName: 'hora_fin' })
  declare horaFin: string | null

  @column()
  declare motivo: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: false, autoUpdate: true })
  declare updatedAt: DateTime | null
}

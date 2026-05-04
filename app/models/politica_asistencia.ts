import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Sede from './sede.js'

export default class PoliticaAsistencia extends BaseModel {
  static table = 'politicas_asistencia'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'sede_id' })
  declare sedeId: number | null

  @belongsTo(() => Sede)
  declare sede: BelongsTo<typeof Sede>

  @column({ columnName: 'tolerancia_minutos_tardanza' })
  declare toleranciaMinutosTardanza: number

  @column({ columnName: 'permite_marcar_fuera_horario' })
  declare permiteMarcarFueraHorario: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: false, autoUpdate: true })
  declare updatedAt: DateTime | null
}

import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Profesor from './profesor.js'

export type TipoContrato = 'planilla' | 'honorarios' | 'locacion'
export type EstadoContrato = 'activo' | 'finalizado' | 'cancelado'
export type Moneda = 'PEN' | 'USD'

export default class Contrato extends BaseModel {
  static table = 'contratos'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'profesor_id' })
  declare profesorId: number

  @column()
  declare tipo: TipoContrato

  @column.date({ columnName: 'fecha_inicio' })
  declare fechaInicio: DateTime

  @column.date({ columnName: 'fecha_fin' })
  declare fechaFin: DateTime | null

  @column({ columnName: 'sueldo_mensual' })
  declare sueldoMensual: number | null

  @column({ columnName: 'tarifa_hora' })
  declare tarifaHora: number | null

  @column({ columnName: 'horas_semanales' })
  declare horasSemanales: number | null

  @column()
  declare moneda: Moneda

  @column()
  declare estado: EstadoContrato

  @column({ columnName: 'archivo_nombre' })
  declare archivoNombre: string | null

  @column({ columnName: 'archivo_path' })
  declare archivoPath: string | null

  @column()
  declare notas: string | null

  @belongsTo(() => Profesor)
  declare profesor: BelongsTo<typeof Profesor>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: false, autoUpdate: true })
  declare updatedAt: DateTime | null
}

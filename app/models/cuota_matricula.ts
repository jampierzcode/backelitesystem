import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

import Matricula from './matricula.js'
import Pago from './pago.js'

export type TipoCuota = 'matricula' | 'mensualidad'
export type EstadoCuota = 'pendiente' | 'parcial' | 'pagada'

export default class CuotaMatricula extends BaseModel {
  static table = 'cuotas_matricula'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'matricula_id' })
  declare matriculaId: number

  @column()
  declare tipo: TipoCuota

  @column({ columnName: 'numero_cuota' })
  declare numeroCuota: number

  @column.date({ columnName: 'mes_referencia' })
  declare mesReferencia: DateTime | null

  @column({ columnName: 'monto_esperado' })
  declare montoEsperado: number

  @column({ columnName: 'monto_pagado' })
  declare montoPagado: number

  @column.date({ columnName: 'fecha_vencimiento' })
  declare fechaVencimiento: DateTime

  @column()
  declare estado: EstadoCuota

  @column()
  declare notas: string | null

  @belongsTo(() => Matricula)
  declare matricula: BelongsTo<typeof Matricula>

  @hasMany(() => Pago, { foreignKey: 'cuotaId' })
  declare pagos: HasMany<typeof Pago>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: false, autoUpdate: true })
  declare updatedAt: DateTime | null
}

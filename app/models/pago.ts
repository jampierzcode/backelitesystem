// app/models/pago.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import Matricula from './matricula.js'
import CuotaMatricula from './cuota_matricula.js'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Pago extends BaseModel {
  static table = 'pagos'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'matricula_id' })
  declare matriculaId: number

  @belongsTo(() => Matricula)
  declare matricula: BelongsTo<typeof Matricula>

  @column({ columnName: 'cuota_id' })
  declare cuotaId: number | null

  @belongsTo(() => CuotaMatricula, { foreignKey: 'cuotaId' })
  declare cuota: BelongsTo<typeof CuotaMatricula>

  @column()
  declare tipo: 'matricula' | 'mensualidad'

  @column()
  declare metodo: 'efectivo' | 'yape' | 'plin' | 'tarjeta'

  @column()
  declare monto: number

  @column()
  declare codigoOperacion: string | null

  @column()
  declare imagenVoucherUrl: string | null

  @column({ columnName: 'imagen_voucher_key' })
  declare imagenVoucherKey: string | null

  @column()
  declare estado: 'pendiente' | 'validado' | 'rechazado'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: false, autoUpdate: true })
  declare updatedAt: DateTime | null
}

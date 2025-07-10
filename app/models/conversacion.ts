// app/models/conversacion.ts
import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Conversacion extends BaseModel {
  static table = 'conversaciones'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'numero_whatsapp' })
  declare numeroWhatsapp: string

  @column({ columnName: 'estado_actual' })
  declare estadoActual: string

  @column({ columnName: 'ultimo_mensaje' })
  declare ultimoMensaje: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: false, autoUpdate: true })
  declare updatedAt: DateTime | null
}

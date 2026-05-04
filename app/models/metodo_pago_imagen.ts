import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class MetodoPagoImagen extends BaseModel {
  static table = 'metodos_pago_imagenes'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare url: string

  @column({ columnName: 'storage_key' })
  declare storageKey: string | null

  @column()
  declare descripcion: string | null

  @column()
  declare orden: number

  @column()
  declare activo: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: false, autoUpdate: true })
  declare updatedAt: DateTime | null
}

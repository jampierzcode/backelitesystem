import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Configuracion extends BaseModel {
  static table = 'configuracion'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'nombre_empresa' })
  declare nombreEmpresa: string

  @column({ columnName: 'logo_url' })
  declare logoUrl: string | null

  @column()
  declare mision: string | null

  @column()
  declare vision: string | null

  @column({ columnName: 'email_contacto' })
  declare emailContacto: string | null

  @column({ columnName: 'whatsapp_contacto' })
  declare whatsappContacto: string | null

  @column({ columnName: 'whatsapp_notificaciones' })
  declare whatsappNotificaciones: string | null

  @column({ columnName: 'telefono_fijo' })
  declare telefonoFijo: string | null

  @column({ columnName: 'direccion_principal' })
  declare direccionPrincipal: string | null

  @column({ columnName: 'estados_cuenta' })
  declare estadosCuenta: string | null

  @column({ columnName: 'moneda_default' })
  declare monedaDefault: string

  @column()
  declare beneficios: string | null

  @column({ columnName: 'admin_url' })
  declare adminUrl: string | null

  @column()
  declare notas: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: false, autoUpdate: true })
  declare updatedAt: DateTime | null
}

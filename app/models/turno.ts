import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Turno extends BaseModel {
  static table = 'turnos'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nombre: string

  @column({ columnName: 'hora_inicio' })
  declare horaInicio: string

  @column({ columnName: 'hora_fin' })
  declare horaFin: string

  @column()
  declare activo: boolean

  @column()
  declare orden: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: false, autoUpdate: true })
  declare updatedAt: DateTime | null
}

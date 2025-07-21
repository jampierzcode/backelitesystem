import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Sede extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name_referential: string

  @column()
  declare direction: string

  @column()
  declare department: string

  @column()
  declare province: string

  @column()
  declare district: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

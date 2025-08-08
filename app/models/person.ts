// app/models/person.ts
import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import Sede from './sede.js' // Asegúrate que este modelo existe y está bien ubicado
import type { BelongsTo, HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import Estudiante from './estudiante.js'

export default class Person extends BaseModel {
  static table = 'persons'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare dni: string | null

  @column()
  declare nombre: string

  @column()
  declare apellido: string | null

  @column()
  declare whatsapp: string

  @column()
  declare email: string | null

  @column()
  declare tipo: 'estudiante' | 'profesor' | 'secretaria' | 'admin'

  @column({ columnName: 'sede_id' })
  declare sedeId: number | null

  @belongsTo(() => Sede)
  declare sede: BelongsTo<typeof Sede>

  @hasOne(() => Estudiante, { foreignKey: 'personId' })
  declare estudiante: HasOne<typeof Estudiante>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: false, autoUpdate: true })
  declare updatedAt: DateTime | null
}

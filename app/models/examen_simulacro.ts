import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import NotaSimulacro from './nota_simulacro.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class ExamenSimulacro extends BaseModel {
  static table = 'examenes_simulacro'
  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public estado: 'creado' | 'iniciado' | 'finalizado' | 'reprogramado'

  @column.date()
  declare public fecha: DateTime

  @column({ columnName: 'hora_inicio' })
  public horaInicio?: string | null

  @column({ columnName: 'hora_fin' })
  public horaFin?: string | null

  @column.date()
  declare public fechaReprogramacion?: DateTime | null

  @column()
  public documentoUrl?: string | null

  @column()
  declare public canal: 'canal 1' | 'canal 2' | 'canal 3' | 'canal 4'

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime

  @hasMany(() => NotaSimulacro, { foreignKey: 'examenId' })
  declare public notas: HasMany<typeof NotaSimulacro>
}

// app/models/ciclo.ts
import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Ciclo extends BaseModel {
  static table = 'ciclos'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nombre: string

  @column.date({ columnName: 'fecha_inicio' })
  declare fechaInicio: DateTime

  @column.date({ columnName: 'fecha_fin' })
  declare fechaFin: DateTime

  @column()
  declare status: boolean

  @column({ columnName: 'montoMatriculaPresencial' })
  declare montoMatriculaPresencial: number

  @column({ columnName: 'montoMensualidadPresencial' })
  declare montoMensualidadPresencial: number

  @column({ columnName: 'montoMatriculaVirtual' })
  declare montoMatriculaVirtual: number

  @column({ columnName: 'montoMensualidadVirtual' })
  declare montoMensualidadVirtual: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: false, autoUpdate: true })
  declare updatedAt: DateTime | null
}

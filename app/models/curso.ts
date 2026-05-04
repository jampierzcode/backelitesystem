import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

import Profesor from './profesor.js'

export default class Curso extends BaseModel {
  static table = 'cursos'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nombre: string

  @column()
  declare descripcion: string | null

  @column()
  declare activo: boolean

  @manyToMany(() => Profesor, {
    pivotTable: 'profesor_curso',
    pivotForeignKey: 'curso_id',
    pivotRelatedForeignKey: 'profesor_id',
  })
  declare profesores: ManyToMany<typeof Profesor>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: false, autoUpdate: true })
  declare updatedAt: DateTime | null
}

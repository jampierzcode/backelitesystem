import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, manyToMany, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany, HasMany } from '@adonisjs/lucid/types/relations'

import Person from './person.js'
import Curso from './curso.js'
import ClaseProfesor from './clase_profesor.js'
import Contrato from './contrato.js'

export default class Profesor extends BaseModel {
  static table = 'profesores'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'person_id' })
  declare personId: number

  @column()
  declare carrera: string | null

  @belongsTo(() => Person)
  declare person: BelongsTo<typeof Person>

  @manyToMany(() => Curso, {
    pivotTable: 'profesor_curso',
    pivotForeignKey: 'profesor_id',
    pivotRelatedForeignKey: 'curso_id',
  })
  declare cursos: ManyToMany<typeof Curso>

  @hasMany(() => ClaseProfesor, { foreignKey: 'profesorId' })
  declare clases: HasMany<typeof ClaseProfesor>

  @hasMany(() => Contrato, { foreignKey: 'profesorId' })
  declare contratos: HasMany<typeof Contrato>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: false, autoUpdate: true })
  declare updatedAt: DateTime | null
}

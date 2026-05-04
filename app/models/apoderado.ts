import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

import Estudiante from './estudiante.js'

export default class Apoderado extends BaseModel {
  static table = 'apoderados'

  // Cuando se preload vía pivot, expone los campos extras de la relación
  // bajo nombres que no chocan con las columnas propias del apoderado.
  serializeExtras() {
    const out: Record<string, any> = {}
    if ('pivot_es_principal' in this.$extras) {
      out.esPrincipal = !!this.$extras.pivot_es_principal
    }
    if ('pivot_parentesco' in this.$extras) {
      out.parentescoRelacion = this.$extras.pivot_parentesco
    }
    return out
  }

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
  declare parentesco: string | null

  @manyToMany(() => Estudiante, {
    pivotTable: 'estudiante_apoderado',
    pivotForeignKey: 'apoderado_id',
    pivotRelatedForeignKey: 'estudiante_id',
    pivotColumns: ['parentesco', 'es_principal'],
  })
  declare estudiantes: ManyToMany<typeof Estudiante>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: false, autoUpdate: true })
  declare updatedAt: DateTime | null
}

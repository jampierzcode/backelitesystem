import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * clases_profesor no tenía enum turno, solo dia + hora_inicio/fin.
 * Agregamos turno_id opcional para poder filtrar el horario semanal del profe
 * por turno (ej. "todas mis clases del turno mañana").
 */
export default class extends BaseSchema {
  protected tableName = 'clases_profesor'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('turno_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('turnos')
        .onDelete('SET NULL')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['turno_id'])
      table.dropColumn('turno_id')
    })
  }
}

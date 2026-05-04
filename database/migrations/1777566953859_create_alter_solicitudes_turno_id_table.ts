import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'solicitudes_matricula'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('turno_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('turnos')
        .onDelete('RESTRICT')
    })

    this.defer(async (db) => {
      await db
        .from('solicitudes_matricula')
        .where('turno', 'MAÑANA')
        .update({ turno_id: 1 })
      await db
        .from('solicitudes_matricula')
        .where('turno', 'TARDE')
        .update({ turno_id: 2 })
      await db.rawQuery('ALTER TABLE solicitudes_matricula DROP COLUMN turno')
    })
  }

  async down() {
    this.defer(async (db) => {
      await db.rawQuery(
        "ALTER TABLE solicitudes_matricula ADD COLUMN turno ENUM('MAÑANA','TARDE') NULL"
      )
      await db
        .from('solicitudes_matricula')
        .where('turno_id', 1)
        .update({ turno: 'MAÑANA' })
      await db
        .from('solicitudes_matricula')
        .where('turno_id', 2)
        .update({ turno: 'TARDE' })
    })
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['turno_id'])
      table.dropColumn('turno_id')
    })
  }
}

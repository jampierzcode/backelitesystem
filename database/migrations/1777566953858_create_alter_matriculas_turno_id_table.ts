import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'matriculas'

  async up() {
    // 1) agregar columna turno_id (nullable mientras migramos datos)
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('turno_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('turnos')
        .onDelete('RESTRICT')
    })

    // 2) backfill: pasar enum 'MAÑANA'/'TARDE' a turno_id (1/2)
    this.defer(async (db) => {
      await db
        .from('matriculas')
        .where('turno', 'MAÑANA')
        .update({ turno_id: 1 })
      await db
        .from('matriculas')
        .where('turno', 'TARDE')
        .update({ turno_id: 2 })

      // 3) drop columna vieja (raw porque dropEnum no es estándar en knex)
      await db.rawQuery('ALTER TABLE matriculas DROP COLUMN turno')
    })
  }

  async down() {
    // Re-crear enum y backfill desde turno_id
    this.defer(async (db) => {
      await db.rawQuery(
        "ALTER TABLE matriculas ADD COLUMN turno ENUM('MAÑANA','TARDE') NULL"
      )
      await db.from('matriculas').where('turno_id', 1).update({ turno: 'MAÑANA' })
      await db.from('matriculas').where('turno_id', 2).update({ turno: 'TARDE' })
    })
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['turno_id'])
      table.dropColumn('turno_id')
    })
  }
}

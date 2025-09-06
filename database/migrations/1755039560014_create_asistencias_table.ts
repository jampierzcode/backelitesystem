// database/migrations/xxxx_asistencias.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'asistencias'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('estudiante_id')
        .unsigned()
        .references('id')
        .inTable('estudiantes')
        .onDelete('CASCADE')
        .notNullable()

      table
        .integer('recorder_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')

      table.date('fecha').notNullable()

      table.timestamp('hora_entrada').nullable()
      table.timestamp('hora_salida').nullable()

      table.enum('estado', ['presente', 'tardanza', 'falta', 'justificada']).notNullable()

      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

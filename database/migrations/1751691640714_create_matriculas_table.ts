import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'matriculas'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('estudiante_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('estudiantes')
        .onDelete('CASCADE')
      table
        .integer('ciclo_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('ciclos')
        .onDelete('CASCADE')
      table.enum('modalidad', ['presencial', 'virtual']).notNullable()
      table.enum('turno', ['MAÑANA', 'TARDE']).notNullable()
      table.float('precio_matricula').notNullable()
      table.float('precio_mensualidad').notNullable()
      table.enum('estado', ['pendiente', 'matriculado']).notNullable()
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

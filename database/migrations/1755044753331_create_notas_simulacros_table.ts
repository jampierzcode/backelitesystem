import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notas_simulacro'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('examen_id')
        .unsigned()
        .references('id')
        .inTable('examenes_simulacro')
        .onDelete('CASCADE')
        .notNullable()

      table
        .integer('estudiante_id')
        .unsigned()
        .references('id')
        .inTable('estudiantes')
        .onDelete('CASCADE')
        .notNullable()

      table.decimal('nota', 5, 2).notNullable()

      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'profesor_curso'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('profesor_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('profesores')
        .onDelete('CASCADE')
      table
        .integer('curso_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('cursos')
        .onDelete('CASCADE')

      table.unique(['profesor_id', 'curso_id'])

      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

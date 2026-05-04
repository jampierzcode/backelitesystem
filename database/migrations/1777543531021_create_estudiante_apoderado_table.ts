import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'estudiante_apoderado'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('estudiante_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('estudiantes')
        .onDelete('CASCADE')
      table
        .integer('apoderado_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('apoderados')
        .onDelete('CASCADE')
      table.string('parentesco', 50).nullable()
      table.boolean('es_principal').notNullable().defaultTo(false)

      table.unique(['estudiante_id', 'apoderado_id'])

      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

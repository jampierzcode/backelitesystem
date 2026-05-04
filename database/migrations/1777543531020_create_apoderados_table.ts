import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'apoderados'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('dni', 20).nullable()
      table.string('nombre', 255).notNullable()
      table.string('apellido', 255).nullable()
      table.string('whatsapp', 50).notNullable()
      table.string('email', 255).nullable()
      table.string('parentesco', 50).nullable() // Madre, Padre, Tutor, Tío, etc.
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

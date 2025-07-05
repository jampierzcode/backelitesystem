import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'persons'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').unsigned()
      table.string('dni', 255).nullable()
      table.string('nombre', 255).notNullable()
      table.string('apellido', 255).nullable()
      table.string('whatsapp', 255).notNullable()
      table.string('email', 255).nullable()
      table.enum('tipo', ['estudiante', 'profesor', 'secretaria', 'admin']).notNullable()
      table
        .integer('sede_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('sedes')
        .onDelete('SET NULL')
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

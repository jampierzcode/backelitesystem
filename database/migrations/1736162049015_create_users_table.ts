import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table
        .integer('person_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('persons')
        .onDelete('SET NULL')
      table.string('email', 254).notNullable().unique()
      table.timestamp('email_verified_at').nullable()
      table.string('password').notNullable()
      table
        .integer('rol_id')
        .nullable()
        .unsigned()
        .references('id')
        .inTable('roles')
        .onDelete('SET NULL')
      table.enum('status', ['activo', 'inactivo']).notNullable()
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

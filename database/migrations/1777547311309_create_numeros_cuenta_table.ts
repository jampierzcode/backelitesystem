import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'numeros_cuenta'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('sede_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('sedes')
        .onDelete('CASCADE')
      table.string('banco', 100).notNullable() // BCP, Interbank, Yape, Plin, etc.
      table.string('titular', 255).notNullable()
      table.string('numero_cuenta', 100).notNullable()
      table.string('cci', 100).nullable()
      table.string('alias', 100).nullable() // alias yape/plin
      table.boolean('activo').notNullable().defaultTo(true)
      table.string('notas', 255).nullable()

      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

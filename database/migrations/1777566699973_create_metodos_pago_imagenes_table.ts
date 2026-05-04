import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'metodos_pago_imagenes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.text('url').notNullable()
      table.string('storage_key', 500).nullable()
      table.string('descripcion', 255).nullable() // ej. "BCP", "Yape", etc.
      table.integer('orden').notNullable().defaultTo(0)
      table.boolean('activo').notNullable().defaultTo(true)
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

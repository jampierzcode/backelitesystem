import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'pagos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('matricula_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('matriculas')
        .onDelete('CASCADE')
      table.enum('tipo', ['matricula', 'mensualidad']).notNullable()
      table.enum('metodo', ['efectivo', 'yape', 'plin', 'tarjeta']).notNullable()
      table.float('monto').notNullable()
      table.string('codigo_operacion', 255).nullable()
      table.text('imagen_voucher_url').nullable()
      table.enum('estado', ['pendiente', 'validado', 'rechazado']).notNullable()
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

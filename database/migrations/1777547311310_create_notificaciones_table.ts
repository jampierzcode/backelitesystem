import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notificaciones'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('user_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.string('tipo', 50).notNullable() // solicitud_matricula, pago_recibido, etc.
      table.string('titulo', 255).notNullable()
      table.text('mensaje').nullable()
      table.json('payload').nullable() // datos extra: solicitudId, etc.
      table.string('url', 500).nullable() // ruta a abrir en frontend al click
      table.boolean('leida').notNullable().defaultTo(false)

      table.index(['user_id', 'leida'])
      table.index(['tipo', 'created_at'])

      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

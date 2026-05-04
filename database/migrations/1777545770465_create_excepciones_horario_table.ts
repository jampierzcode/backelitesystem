import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'excepciones_horario'

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
      table.date('fecha').notNullable()
      table.enum('tipo', ['cerrado_total', 'horario_especial']).notNullable()
      table.time('hora_inicio').nullable()
      table.time('hora_fin').nullable()
      table.string('motivo', 255).nullable()

      // Una sola excepción por sede+fecha (NULL sede_id = global)
      table.unique(['sede_id', 'fecha'])

      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

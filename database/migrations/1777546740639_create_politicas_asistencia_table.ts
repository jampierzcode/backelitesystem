import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'politicas_asistencia'

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
      table.integer('tolerancia_minutos_tardanza').notNullable().defaultTo(15)
      table.boolean('permite_marcar_fuera_horario').notNullable().defaultTo(false)

      // Una política por sede (o una global si sede_id IS NULL)
      table.unique(['sede_id'])

      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

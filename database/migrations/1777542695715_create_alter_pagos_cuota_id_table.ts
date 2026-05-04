import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'pagos'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('cuota_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('cuotas_matricula')
        .onDelete('SET NULL')
      table.index(['cuota_id'])
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['cuota_id'])
      table.dropColumn('cuota_id')
    })
  }
}

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'matriculas'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.date('fecha_inicio').nullable()
      table.date('fecha_fin').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('fecha_inicio')
      table.dropColumn('fecha_fin')
    })
  }
}

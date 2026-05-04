import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'solicitudes_matricula'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('comprobante_matricula_url').nullable()
      table.string('comprobante_matricula_key', 500).nullable()
      table.text('comprobante_mensualidad_url').nullable()
      table.string('comprobante_mensualidad_key', 500).nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('comprobante_matricula_url')
      table.dropColumn('comprobante_matricula_key')
      table.dropColumn('comprobante_mensualidad_url')
      table.dropColumn('comprobante_mensualidad_key')
    })
  }
}

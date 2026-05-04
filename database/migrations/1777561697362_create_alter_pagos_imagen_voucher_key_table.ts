import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'pagos'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('imagen_voucher_key', 500).nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('imagen_voucher_key')
    })
  }
}

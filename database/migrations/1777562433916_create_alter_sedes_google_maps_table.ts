import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'sedes'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('google_maps_url').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('google_maps_url')
    })
  }
}

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'configuracion'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('beneficios').nullable()
      table.string('admin_url', 500).nullable() // URL del frontend admin para links en notificaciones
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('beneficios')
      table.dropColumn('admin_url')
    })
  }
}

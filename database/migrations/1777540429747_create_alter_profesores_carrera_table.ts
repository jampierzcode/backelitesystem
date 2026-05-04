import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'profesores'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('carrera', 255).nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('carrera')
    })
  }
}

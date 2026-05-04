import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'persons'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.unique(['dni'], { indexName: 'persons_dni_unique' })
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropUnique(['dni'], 'persons_dni_unique')
    })
  }
}

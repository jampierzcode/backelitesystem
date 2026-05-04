import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'estudiantes'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropUnique(['nombre_apoderado'])
      table.dropUnique(['numero_apoderado'])
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.unique(['nombre_apoderado'])
      table.unique(['numero_apoderado'])
    })
  }
}

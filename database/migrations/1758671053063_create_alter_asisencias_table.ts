import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'asistencias'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.time('hora_entrada').nullable().alter()
      table.time('hora_salida').nullable().alter()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'examenes_simulacro'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.time('hora_inicio').nullable().alter()
      table.time('hora_fin').nullable().alter()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

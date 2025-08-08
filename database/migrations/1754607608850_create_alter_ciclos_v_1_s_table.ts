import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'ciclos'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.decimal('montoMatriculaPresencial', 10, 2).notNullable()
      table.decimal('montoMensualidadPresencial', 10, 2).notNullable()
      table.decimal('montoMatriculaVirtual', 10, 2).notNullable()
      table.decimal('montoMensualidadVirtual', 10, 2).notNullable()
    })
  }

  async down() {}
}

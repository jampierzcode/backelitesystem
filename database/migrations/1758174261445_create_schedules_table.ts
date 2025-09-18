import { BaseSchema } from '@adonisjs/lucid/schema'

export default class ScheduleSchema extends BaseSchema {
  protected tableName = 'schedules'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('dia').notNullable() // Lunes, Martes, etc
      table.time('hora_inicio').notNullable()
      table.time('hora_fin').notNullable()
      table.boolean('activo').defaultTo(true) // por si quieres habilitar/deshabilitar
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

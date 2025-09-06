import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'examenes_simulacro'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.enum('estado', ['creado', 'iniciado', 'finalizado', 'reprogramado']).notNullable()
      table.date('fecha').notNullable()

      table.timestamp('hora_inicio').nullable()
      table.timestamp('hora_fin').nullable()

      table.date('fecha_reprogramacion').nullable()
      table.string('documento_url').nullable()

      table.enum('canal', ['canal 1', 'canal 2', 'canal 3', 'canal 4']).notNullable()

      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'clases_profesor'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('profesor_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('profesores')
        .onDelete('CASCADE')
      table
        .integer('curso_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('cursos')
        .onDelete('RESTRICT')
      table
        .integer('ciclo_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('ciclos')
        .onDelete('SET NULL')

      table
        .enum('dia', ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'])
        .notNullable()
      table.time('hora_inicio').notNullable()
      table.time('hora_fin').notNullable()
      table.boolean('activo').notNullable().defaultTo(true)

      table.index(['profesor_id', 'dia'])

      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

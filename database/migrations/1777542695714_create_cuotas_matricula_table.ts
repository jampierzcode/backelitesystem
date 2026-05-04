import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cuotas_matricula'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('matricula_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('matriculas')
        .onDelete('CASCADE')

      table.enum('tipo', ['matricula', 'mensualidad']).notNullable()
      table.integer('numero_cuota').unsigned().notNullable()
      table.date('mes_referencia').nullable() // primer día del mes (solo para mensualidades)
      table.decimal('monto_esperado', 10, 2).notNullable()
      table.decimal('monto_pagado', 10, 2).notNullable().defaultTo(0)
      table.date('fecha_vencimiento').notNullable()
      table.enum('estado', ['pendiente', 'parcial', 'pagada']).notNullable().defaultTo('pendiente')
      table.string('notas', 500).nullable()

      table.index(['matricula_id', 'estado'])
      table.index(['matricula_id', 'numero_cuota'])

      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

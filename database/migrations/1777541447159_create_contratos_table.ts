import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'contratos'

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

      table.enum('tipo', ['planilla', 'honorarios', 'locacion']).notNullable()
      table.date('fecha_inicio').notNullable()
      table.date('fecha_fin').nullable()

      table.decimal('sueldo_mensual', 10, 2).nullable()
      table.decimal('tarifa_hora', 10, 2).nullable()
      table.decimal('horas_semanales', 5, 2).nullable()

      table.enum('moneda', ['PEN', 'USD']).notNullable().defaultTo('PEN')
      table.enum('estado', ['activo', 'finalizado', 'cancelado']).notNullable().defaultTo('activo')

      table.string('archivo_nombre', 255).nullable() // nombre original del archivo subido
      table.string('archivo_path', 500).nullable() // ruta relativa en storage
      table.text('notas').nullable()

      table.index(['profesor_id', 'estado'])

      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

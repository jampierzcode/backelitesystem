import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'turnos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nombre', 50).notNullable().unique()
      table.time('hora_inicio').notNullable()
      table.time('hora_fin').notNullable()
      table.boolean('activo').notNullable().defaultTo(true)
      table.integer('orden').notNullable().defaultTo(0)
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable()
    })

    // Filas default — corresponden a los enum viejos MAÑANA/TARDE
    this.defer(async (db) => {
      await db.table('turnos').insert([
        {
          id: 1,
          nombre: 'MAÑANA',
          hora_inicio: '08:00:00',
          hora_fin: '12:00:00',
          activo: true,
          orden: 1,
          created_at: new Date(),
        },
        {
          id: 2,
          nombre: 'TARDE',
          hora_inicio: '14:00:00',
          hora_fin: '18:00:00',
          activo: true,
          orden: 2,
          created_at: new Date(),
        },
      ])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

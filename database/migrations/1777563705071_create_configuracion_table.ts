import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'configuracion'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nombre_empresa', 255).notNullable().defaultTo('Mi Academia')
      table.text('logo_url').nullable()
      table.text('mision').nullable()
      table.text('vision').nullable()
      table.string('email_contacto', 255).nullable()
      table.string('whatsapp_contacto', 50).nullable()
      table.string('whatsapp_notificaciones', 50).nullable()
      table.string('telefono_fijo', 50).nullable()
      table.string('direccion_principal', 500).nullable()
      table.text('estados_cuenta').nullable() // texto libre con cuentas bancarias
      table.string('moneda_default', 10).notNullable().defaultTo('PEN')
      table.text('notas').nullable()

      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable()
    })

    this.defer(async (db) => {
      // Singleton: insertar fila base con id=1
      await db.table('configuracion').insert({
        id: 1,
        nombre_empresa: 'Academia Élite',
        moneda_default: 'PEN',
        created_at: new Date(),
      })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

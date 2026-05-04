import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'solicitudes_matricula'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Datos personales (la persona aún NO existe en BD hasta que el admin apruebe)
      table.string('nombre', 255).notNullable()
      table.string('apellido', 255).nullable()
      table.string('dni', 20).nullable()
      table.string('email', 255).nullable()
      table.string('whatsapp', 50).notNullable()

      // Datos de la matrícula solicitada
      table
        .integer('ciclo_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('ciclos')
        .onDelete('RESTRICT')
      table.enum('modalidad', ['presencial', 'virtual']).notNullable()
      table.enum('turno', ['MAÑANA', 'TARDE']).notNullable()
      table
        .integer('sede_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('sedes')
        .onDelete('SET NULL')

      // Pago (opcional; el solicitante puede mandar URL del voucher o dejar vacío)
      table.text('comprobante_pago_url').nullable()
      table.decimal('monto_referencia', 10, 2).nullable()

      // Estado del flujo
      table
        .enum('estado', ['pendiente', 'aprobada', 'rechazada'])
        .notNullable()
        .defaultTo('pendiente')

      // Notas del admin / motivo de rechazo
      table.text('notas_admin').nullable()

      // Cuando se aprueba, enlace al estudiante y la matrícula creados
      table
        .integer('estudiante_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('estudiantes')
        .onDelete('SET NULL')
      table
        .integer('matricula_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('matriculas')
        .onDelete('SET NULL')

      // IP del solicitante (para rate limit / auditoría)
      table.string('ip_origen', 50).nullable()

      table.index(['estado', 'created_at'])

      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

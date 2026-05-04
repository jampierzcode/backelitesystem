import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * Backfill: convierte estudiantes.nombre_apoderado/numero_apoderado en filas
 * de la tabla `apoderados` y las enlaza vía `estudiante_apoderado`.
 *
 * - Las columnas viejas en `estudiantes` se quedan (deuda a dropear más adelante
 *   una vez verifiquemos que el código nuevo no las lee).
 * - Solo se crea apoderado si hay al menos uno de nombre o número.
 */
export default class extends BaseSchema {
  protected tableName = 'estudiantes'

  async up() {
    this.defer(async (db) => {
      const estudiantes = await db
        .from('estudiantes')
        .select('id', 'nombre_apoderado', 'numero_apoderado')
        .whereNotNull('nombre_apoderado')
        .orWhereNotNull('numero_apoderado')

      for (const est of estudiantes) {
        const nombre = (est.nombre_apoderado || '').trim() || 'Apoderado sin nombre'
        const whatsapp = (est.numero_apoderado || '').trim() || 'sin-numero'

        const [apoderadoId] = await db
          .table('apoderados')
          .insert({
            nombre,
            whatsapp,
            created_at: new Date(),
          })

        await db.table('estudiante_apoderado').insert({
          estudiante_id: est.id,
          apoderado_id: apoderadoId,
          es_principal: true,
          created_at: new Date(),
        })
      }
    })
  }

  async down() {
    // Vaciar las tablas creadas (no podemos saber con certeza qué venía del backfill
    // vs qué fue agregado después). Down sólo borra TODOS los apoderados.
    this.defer(async (db) => {
      await db.from('estudiante_apoderado').delete()
      await db.from('apoderados').delete()
    })
  }
}

import Notificacion from '#models/notificacion'
import User from '#models/user'
import transmit from '@adonisjs/transmit/services/main'
import type { TransactionClientContract } from '@adonisjs/lucid/types/database'

export interface CrearNotificacionInput {
  tipo: string
  titulo: string
  mensaje?: string | null
  payload?: Record<string, any> | null
  url?: string | null
}

/**
 * Crea una notificación para CADA admin/superadmin en BD,
 * y emite el evento Transmit por el canal `admin/notifications`
 * para que los clientes conectados la reciban en tiempo real.
 */
export async function notificarAdmins(
  input: CrearNotificacionInput,
  trx?: TransactionClientContract
): Promise<Notificacion[]> {
  // Buscar todos los users con rol admin/superadmin (los que verán la campana)
  const usersQuery = User.query().preload('role')
  if (trx) usersQuery.useTransaction(trx)
  const users = await usersQuery
  const adminUsers = users.filter(
    (u) => u.role && ['admin', 'superadmin'].includes(u.role.name)
  )

  const creadas: Notificacion[] = []
  for (const u of adminUsers) {
    const n = await Notificacion.create(
      {
        userId: u.id,
        tipo: input.tipo,
        titulo: input.titulo,
        mensaje: input.mensaje ?? null,
        payload: input.payload ?? null,
        url: input.url ?? null,
        leida: false,
      },
      { client: trx }
    )
    creadas.push(n)
  }

  // Broadcast en tiempo real (canal global de admins)
  try {
    transmit.broadcast('admin/notifications', {
      tipo: input.tipo,
      titulo: input.titulo,
      mensaje: input.mensaje ?? null,
      payload: input.payload ?? null,
      url: input.url ?? null,
      createdAt: new Date().toISOString(),
    })
  } catch {
    // Si Transmit no está conectado todavía, no es crítico
  }

  return creadas
}

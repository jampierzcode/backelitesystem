import Notificacion from '#models/notificacion'
import type { HttpContext } from '@adonisjs/core/http'

export default class NotificacionesController {
  /**
   * Lista las notificaciones del usuario autenticado.
   * ?solo_no_leidas=true para filtrar
   */
  public async index({ auth, request }: HttpContext) {
    try {
      await auth.check()
      const userId = auth?.user!.id

      const query = Notificacion.query().where('user_id', userId)
      if (request.input('solo_no_leidas') === 'true') {
        query.where('leida', false)
      }
      query.orderBy('created_at', 'desc').limit(50)

      const items = await query
      const noLeidas = await Notificacion.query()
        .where('user_id', userId)
        .where('leida', false)
        .count('* as total')
      const totalNoLeidas = Number((noLeidas[0] as any).$extras?.total ?? 0)

      return {
        status: 'success',
        data: items,
        meta: { totalNoLeidas },
      }
    } catch (error) {
      return { status: 'error', message: 'notificaciones fetch error', error }
    }
  }

  public async marcarLeida({ auth, params, response }: HttpContext) {
    try {
      await auth.check()
      const n = await Notificacion.findOrFail(params.id)
      if (n.userId !== auth?.user!.id) {
        return response.forbidden({ status: 'error', message: 'no autorizado' })
      }
      n.leida = true
      await n.save()
      return { status: 'success', data: n }
    } catch (error) {
      return { status: 'error', message: 'marcar leída error', error }
    }
  }

  public async marcarTodasLeidas({ auth }: HttpContext) {
    try {
      await auth.check()
      await Notificacion.query()
        .where('user_id', auth?.user!.id)
        .where('leida', false)
        .update({ leida: true })
      return { status: 'success' }
    } catch (error) {
      return { status: 'error', message: 'marcar todas leídas error', error }
    }
  }
}

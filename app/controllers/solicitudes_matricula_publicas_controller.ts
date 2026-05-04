import SolicitudMatricula from '#models/solicitud_matricula'
import { notificarAdmins } from '#services/notificaciones_service'
import { notificarSolicitudWhatsapp } from '#services/whatsapp_bot_service'
import type { HttpContext } from '@adonisjs/core/http'

// Rate limit casero: 10 solicitudes por hora por IP
const RATE_LIMIT_MAX = 10
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000
const intentos = new Map<string, number[]>()

function checkRateLimit(ip: string): { ok: boolean; remaining: number } {
  const ahora = Date.now()
  const previos = (intentos.get(ip) || []).filter((t) => ahora - t < RATE_LIMIT_WINDOW_MS)
  if (previos.length >= RATE_LIMIT_MAX) {
    intentos.set(ip, previos)
    return { ok: false, remaining: 0 }
  }
  previos.push(ahora)
  intentos.set(ip, previos)
  return { ok: true, remaining: RATE_LIMIT_MAX - previos.length }
}

export default class SolicitudesMatriculaPublicasController {
  /**
   * POST /api/public/solicitudes-matricula
   * Endpoint público (sin auth) para que el sitio externo envíe solicitudes.
   */
  public async store({ request, response }: HttpContext) {
    const ip = request.ip()
    const limit = checkRateLimit(ip)
    if (!limit.ok) {
      return response.tooManyRequests({
        status: 'error',
        message: 'Demasiadas solicitudes. Intenta más tarde.',
      })
    }

    try {
      const data = request.only([
        'nombre',
        'apellido',
        'dni',
        'email',
        'whatsapp',
        'cicloId',
        'modalidad',
        'turnoId',
        'sedeId',
        'comprobantePagoUrl',
        'comprobanteMatriculaUrl',
        'comprobanteMatriculaKey',
        'comprobanteMensualidadUrl',
        'comprobanteMensualidadKey',
        'montoReferencia',
      ])

      // Validación mínima
      const requeridos: Array<keyof typeof data> = [
        'nombre',
        'whatsapp',
        'cicloId',
        'modalidad',
        'turnoId',
      ]
      for (const k of requeridos) {
        if (!data[k]) {
          return response.badRequest({
            status: 'error',
            message: `Campo requerido: ${String(k)}`,
          })
        }
      }

      const solicitud = await SolicitudMatricula.create({
        ...data,
        estado: 'pendiente',
        ipOrigen: ip,
      })

      // Notificar admins (BD + Transmit broadcast)
      try {
        await solicitud.load('ciclo')
        await solicitud.load('sede')
        await notificarAdmins({
          tipo: 'solicitud_matricula',
          titulo: 'Nueva solicitud de matrícula',
          mensaje: `${data.nombre} ${data.apellido || ''} solicita matrícula en ${solicitud.ciclo?.nombre || 'ciclo'}`,
          payload: { solicitudId: solicitud.id },
          url: `/solicitudes-matricula/${solicitud.id}`,
        })
      } catch {
        // No bloquea la solicitud si la notificación falla
      }

      // Disparar WhatsApp al admin via apiBotElite (no bloquea si bot offline)
      try {
        await solicitud.load('turno')
      } catch {
        // ignore
      }
      notificarSolicitudWhatsapp({
        nombre: data.nombre,
        apellido: data.apellido,
        dni: data.dni,
        whatsapp: data.whatsapp,
        ciclo: solicitud.ciclo?.nombre,
        modalidad: data.modalidad,
        turno: (solicitud as any).turno?.nombre || null,
        sede:
          (solicitud as any).sede?.name_referential ||
          (solicitud as any).sede?.nameReferential ||
          null,
        solicitudId: solicitud.id,
      }).catch(() => {})

      return {
        status: 'success',
        message: 'Solicitud recibida. Nos pondremos en contacto pronto.',
        data: {
          id: solicitud.id,
          numeroSeguimiento: `SOL-${solicitud.id.toString().padStart(6, '0')}`,
        },
      }
    } catch (error) {
      return { status: 'error', message: 'solicitud store error', error }
    }
  }

  /**
   * GET /api/public/ciclos
   * Lista de ciclos activos para mostrar en el form público.
   */
  public async ciclos({}: HttpContext) {
    const Ciclo = (await import('#models/ciclo')).default
    const items = await Ciclo.query()
      .where('status', true)
      .orderBy('fecha_inicio', 'desc')
    return { status: 'success', data: items }
  }

  /**
   * GET /api/public/sedes
   * Lista de sedes para el selector público.
   */
  public async sedes({}: HttpContext) {
    const Sede = (await import('#models/sede')).default
    const items = await Sede.query().orderBy('name_referential', 'asc')
    return { status: 'success', data: items }
  }
}

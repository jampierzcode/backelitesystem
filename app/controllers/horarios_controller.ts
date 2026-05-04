import { obtenerEstadoOperativo } from '#services/horario_operativo_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class HorariosController {
  /**
   * GET /horarios/operativo-actual?sede_id=X
   */
  public async operativoActual({ request }: HttpContext) {
    try {
      const sedeIdRaw = request.input('sede_id')
      const sedeId = sedeIdRaw ? Number(sedeIdRaw) : null

      const estado = await obtenerEstadoOperativo(sedeId)

      return {
        status: 'success',
        data: {
          abierto: estado.abierto,
          ahora: estado.ahora.toISO(),
          fuente: estado.fuente,
          horarioVigente:
            estado.horaInicio && estado.horaFin
              ? { horaInicio: estado.horaInicio, horaFin: estado.horaFin }
              : undefined,
          motivo: estado.motivo,
        },
      }
    } catch (error) {
      return { status: 'error', message: 'operativo-actual error', error }
    }
  }
}

import { DateTime } from 'luxon'
import Schedule from '#models/schedule'
import ExcepcionHorario from '#models/excepcion_horario'

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

export interface EstadoOperativo {
  abierto: boolean
  ahora: DateTime
  fuente: 'regular' | 'excepcion'
  horaInicio: string | null
  horaFin: string | null
  motivo: string | null
}

/**
 * Calcula el estado operativo de la academia para una sede en este momento.
 * - Excepción del día tiene prioridad sobre el schedule regular.
 * - Si sedeId es null, busca la política global.
 */
export async function obtenerEstadoOperativo(sedeId: number | null): Promise<EstadoOperativo> {
  const ahora = DateTime.now().setZone('America/Lima')
  const hoyISO = ahora.toISODate()
  const horaActual = ahora.toFormat('HH:mm:ss')
  const dia = DIAS[ahora.weekday % 7]

  // 1) buscar excepción
  const excQuery = ExcepcionHorario.query().where('fecha', hoyISO!)
  if (sedeId) excQuery.where((q) => q.where('sede_id', sedeId).orWhereNull('sede_id'))
  else excQuery.whereNull('sede_id')
  const excepcion = await excQuery.orderBy('sede_id', 'desc').first()

  if (excepcion) {
    if (excepcion.tipo === 'cerrado_total') {
      return {
        abierto: false,
        ahora,
        fuente: 'excepcion',
        horaInicio: null,
        horaFin: null,
        motivo: excepcion.motivo,
      }
    }
    const dentro =
      horaActual >= (excepcion.horaInicio || '00:00:00') &&
      horaActual <= (excepcion.horaFin || '23:59:59')
    return {
      abierto: dentro,
      ahora,
      fuente: 'excepcion',
      horaInicio: excepcion.horaInicio,
      horaFin: excepcion.horaFin,
      motivo: excepcion.motivo,
    }
  }

  // 2) Schedule regular
  const schedQuery = Schedule.query().where('dia', dia)
  if (sedeId) schedQuery.where((q) => q.where('sede_id', sedeId).orWhereNull('sede_id'))
  else schedQuery.whereNull('sede_id')
  const schedule = await schedQuery.orderBy('sede_id', 'desc').first()

  if (!schedule || !schedule.activo) {
    return {
      abierto: false,
      ahora,
      fuente: 'regular',
      horaInicio: null,
      horaFin: null,
      motivo: schedule ? 'Día deshabilitado' : 'Sin horario configurado',
    }
  }

  const dentro = horaActual >= schedule.horaInicio && horaActual <= schedule.horaFin

  return {
    abierto: dentro,
    ahora,
    fuente: 'regular',
    horaInicio: schedule.horaInicio,
    horaFin: schedule.horaFin,
    motivo: dentro ? null : 'Fuera de horario',
  }
}

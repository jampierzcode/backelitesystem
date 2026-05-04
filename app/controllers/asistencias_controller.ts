// app/controllers/asistencias_controller.ts
import Asistencia from '#models/asistencia'
import Estudiante from '#models/estudiante'
import PoliticaAsistencia from '#models/politica_asistencia'
import { obtenerEstadoOperativo } from '#services/horario_operativo_service'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'

export default class AsistenciasController {
  public async index({ request }: HttpContext) {
    try {
      const fechaInicio = request.input('fechaInicio')
      const fechaFin = request.input('fechaFin')
      const estado = request.input('estado')

      const query = Asistencia.query()
        .preload('estudiante', (est) => est.preload('person'))
        .preload('recorder')

      if (fechaInicio && fechaFin) {
        query.whereBetween('fecha', [fechaInicio, fechaFin])
      } else if (fechaInicio) {
        query.where('fecha', fechaInicio)
      }
      if (estado) query.where('estado', estado)

      const asistencias = await query
      return { status: 'success', message: 'asistencias fetched', data: asistencias }
    } catch (error) {
      return { status: 'error', message: 'asistencias fetch error', error }
    }
  }

  public async show({ params }: HttpContext) {
    try {
      const asistencia = await Asistencia.findOrFail(params.id)
      await asistencia.load('estudiante')
      await asistencia.load('recorder')
      return { status: 'success', message: 'asistencia fetched', data: asistencia }
    } catch (error) {
      return { status: 'error', message: 'asistencia fetch error', error }
    }
  }

  public async store({ request, auth }: HttpContext) {
    try {
      await auth.check()
      const data = request.only(['estudianteId', 'fecha', 'horaEntrada', 'horaSalida', 'estado'])
      const newData = { ...data, recorderId: auth?.user!.id }
      const asistencia = await Asistencia.create(newData)
      return { status: 'success', message: 'asistencia created', data: asistencia }
    } catch (error) {
      return { status: 'error', message: 'asistencia store error', error }
    }
  }

  public async update({ params, request }: HttpContext) {
    try {
      const asistencia = await Asistencia.findOrFail(params.id)
      const data = request.only([
        'estudianteId',
        'recorderId',
        'fecha',
        'horaEntrada',
        'horaSalida',
        'estado',
      ])
      asistencia.merge(data)
      await asistencia.save()
      return { status: 'success', message: 'asistencia updated', data: asistencia }
    } catch (error) {
      return { status: 'error', message: 'asistencia update error', error }
    }
  }

  public async destroy({ params }: HttpContext) {
    try {
      const asistencia = await Asistencia.findOrFail(params.id)
      await asistencia.delete()
      return { status: 'success', message: 'asistencia deleted', data: asistencia }
    } catch (error) {
      return { status: 'error', message: 'asistencia delete error', error }
    }
  }

  /**
   * POST /asistencias/marcar-qr
   * body: { estudianteId }
   *
   * Lógica:
   *  1. Busca estudiante y su sede (de la persona)
   *  2. Verifica que no haya marcado hoy ya
   *  3. Mira estado operativo + política
   *  4. Si cerrado y política no permite → 403
   *  5. Si abierto: calcula presente/tardanza según hora_inicio + tolerancia
   */
  public async marcarQr({ request, auth, response }: HttpContext) {
    try {
      await auth.check()
      const estudianteId = Number(request.input('estudianteId'))
      if (!estudianteId) {
        return response.badRequest({ status: 'error', message: 'estudianteId requerido' })
      }

      const estudiante = await Estudiante.query()
        .where('id', estudianteId)
        .preload('person')
        .first()
      if (!estudiante) {
        return response.notFound({ status: 'error', message: 'Estudiante no encontrado' })
      }

      const sedeId = estudiante.person?.sedeId ?? null
      const ahora = DateTime.now().setZone('America/Lima')
      const fechaHoy = ahora.toISODate()

      // ¿ya marcó hoy?
      const existente = await Asistencia.query()
        .where('estudiante_id', estudianteId)
        .where('fecha', fechaHoy!)
        .first()
      if (existente) {
        return response.conflict({
          status: 'error',
          message: 'Ya registró asistencia hoy',
          data: existente,
        })
      }

      // Estado operativo + política
      const estado = await obtenerEstadoOperativo(sedeId)

      const politicaQuery = PoliticaAsistencia.query()
      if (sedeId) {
        politicaQuery.where((q) => q.where('sede_id', sedeId).orWhereNull('sede_id'))
      } else {
        politicaQuery.whereNull('sede_id')
      }
      const politica = await politicaQuery.orderBy('sede_id', 'desc').first()

      const tolerancia = politica?.toleranciaMinutosTardanza ?? 15
      const permiteFuera = politica?.permiteMarcarFueraHorario ?? false

      if (!estado.abierto && !permiteFuera) {
        return response.forbidden({
          status: 'error',
          message: 'Academia cerrada. ' + (estado.motivo || ''),
        })
      }

      // Calcular estado de la asistencia
      let nuevoEstado: 'presente' | 'tardanza' = 'presente'
      if (estado.horaInicio) {
        const inicio = DateTime.fromFormat(estado.horaInicio, 'HH:mm:ss', {
          zone: 'America/Lima',
        }).set({
          year: ahora.year,
          month: ahora.month,
          day: ahora.day,
        })
        const limite = inicio.plus({ minutes: tolerancia })
        if (ahora > limite) nuevoEstado = 'tardanza'
      }

      const asistencia = await Asistencia.create({
        estudianteId,
        fecha: ahora,
        horaEntrada: ahora.toFormat('HH:mm:ss'),
        estado: nuevoEstado,
        recorderId: auth?.user!.id,
      })

      await asistencia.load('estudiante', (est) => est.preload('person'))

      return {
        status: 'success',
        message: `Asistencia registrada como ${nuevoEstado}`,
        data: asistencia,
      }
    } catch (error) {
      return { status: 'error', message: 'marcar-qr error', error }
    }
  }

  /**
   * GET /asistencias/sin-marcar-hoy?fecha=YYYY-MM-DD&sede_id=X
   * Devuelve estudiantes que NO tienen asistencia ese día.
   */
  public async sinMarcarHoy({ request }: HttpContext) {
    try {
      const fecha = request.input('fecha') || DateTime.now().setZone('America/Lima').toISODate()
      const sedeId = request.input('sede_id')

      const query = Estudiante.query().preload('person')
      query.whereDoesntHave('person', () => {}) // dummy preserva chainability
      // Subquery: NO existe asistencia con esa fecha
      query.whereNotExists((q) => {
        q.from('asistencias')
          .whereRaw('asistencias.estudiante_id = estudiantes.id')
          .where('asistencias.fecha', fecha)
      })

      const estudiantes = await query
      const filtrados = sedeId
        ? estudiantes.filter((e) => e.person?.sedeId === Number(sedeId))
        : estudiantes

      return {
        status: 'success',
        message: 'estudiantes sin marcar',
        data: filtrados,
      }
    } catch (error) {
      return { status: 'error', message: 'sin-marcar-hoy error', error }
    }
  }

  /**
   * POST /asistencias/marcar-falta-masiva
   * body: { estudianteIds: number[], fecha: 'YYYY-MM-DD' }
   * Crea (o salta si ya existe) asistencias estado='falta' para esos estudiantes.
   */
  public async marcarFaltaMasiva({ request, auth, response }: HttpContext) {
    const trx = await db.transaction()
    try {
      await auth.check()
      const estudianteIds: number[] = request.input('estudianteIds', [])
      const fecha = request.input('fecha')
      if (!Array.isArray(estudianteIds) || estudianteIds.length === 0) {
        await trx.rollback()
        return response.badRequest({
          status: 'error',
          message: 'estudianteIds requerido (array no vacío)',
        })
      }
      if (!fecha) {
        await trx.rollback()
        return response.badRequest({ status: 'error', message: 'fecha requerida' })
      }

      // Buscar los que YA tienen asistencia ese día (no duplicar)
      const yaTienen = await Asistencia.query({ client: trx })
        .where('fecha', fecha)
        .whereIn('estudiante_id', estudianteIds)
        .select('estudiante_id')
      const idsConAsistencia = new Set(yaTienen.map((a) => a.estudianteId))
      const idsACrear = estudianteIds.filter((id) => !idsConAsistencia.has(id))

      const recorderId = auth?.user!.id
      const fechaDt = DateTime.fromISO(fecha)

      const creados = await Asistencia.createMany(
        idsACrear.map((eid) => ({
          estudianteId: eid,
          fecha: fechaDt,
          estado: 'falta' as const,
          recorderId,
        })),
        { client: trx }
      )

      await trx.commit()
      return {
        status: 'success',
        message: `${creados.length} faltas registradas (${idsConAsistencia.size} ya tenían asistencia)`,
        data: { creados: creados.length, omitidos: idsConAsistencia.size },
      }
    } catch (error) {
      await trx.rollback()
      return { status: 'error', message: 'marcar-falta-masiva error', error }
    }
  }
}

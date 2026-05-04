import SolicitudMatricula from '#models/solicitud_matricula'
import Person from '#models/person'
import Estudiante from '#models/estudiante'
import Matricula from '#models/matricula'
import Ciclo from '#models/ciclo'
import Pago from '#models/pago'
import CuotaMatricula from '#models/cuota_matricula'
import { generarCronograma, recalcularCuota } from '#services/cuotas_service'
import { generarUrlFirmada } from '#services/storage_service'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * Refresca las URLs firmadas a partir de las keys (válidas hasta vencer).
 * Usar en lectura para garantizar que el frontend siempre reciba URLs vivas.
 */
async function refrescarUrlsSolicitud(s: SolicitudMatricula): Promise<void> {
  if (s.comprobanteMatriculaKey) {
    s.comprobanteMatriculaUrl = await generarUrlFirmada(s.comprobanteMatriculaKey)
  }
  if (s.comprobanteMensualidadKey) {
    s.comprobanteMensualidadUrl = await generarUrlFirmada(s.comprobanteMensualidadKey)
  }
}

export default class SolicitudesMatriculaController {
  public async index({ request }: HttpContext) {
    try {
      const query = SolicitudMatricula.query()
        .preload('ciclo')
        .preload('sede')
        .preload('turno')
      const estado = request.input('estado')
      if (estado) query.where('estado', estado)
      query.orderBy('created_at', 'desc')

      const items = await query
      // Refrescar URLs solo si tiene keys (es liviano, paralelo)
      await Promise.all(items.map(refrescarUrlsSolicitud))
      return { status: 'success', message: 'solicitudes fetched', data: items }
    } catch (error) {
      return { status: 'error', message: 'solicitudes fetch error', error }
    }
  }

  public async show({ params }: HttpContext) {
    try {
      const item = await SolicitudMatricula.query()
        .where('id', params.id)
        .preload('ciclo')
        .preload('sede')
        .preload('turno')
        .preload('estudiante', (e) => e.preload('person'))
        .preload('matricula')
        .firstOrFail()
      await refrescarUrlsSolicitud(item)
      return { status: 'success', message: 'solicitud fetched', data: item }
    } catch (error) {
      return { status: 'error', message: 'solicitud fetch error', error }
    }
  }

  /**
   * POST /solicitudes-matricula/:id/aprobar
   * Crea Person + Estudiante + Matricula + cronograma + pagos automáticos
   * por los vouchers de matrícula y/o mensualidad subidos por el solicitante.
   *
   * Body opcional:
   *   precioMatricula, precioMensualidad (override de descuentos)
   *   registrarPagoMatricula: boolean (default true si hay voucher)
   *   registrarPagoMensualidad: boolean (default true si hay voucher)
   */
  public async aprobar({ params, request }: HttpContext) {
    const trx = await db.transaction()
    try {
      const sol = await SolicitudMatricula.query({ client: trx })
        .where('id', params.id)
        .firstOrFail()

      if (sol.estado !== 'pendiente') {
        await trx.rollback()
        return {
          status: 'error',
          message: `La solicitud ya está ${sol.estado}`,
        }
      }

      // 1) Persona
      const person = await Person.create(
        {
          dni: sol.dni,
          nombre: sol.nombre,
          apellido: sol.apellido,
          whatsapp: sol.whatsapp,
          email: sol.email,
          tipo: 'estudiante',
          sedeId: sol.sedeId,
        },
        { client: trx }
      )

      // 2) Estudiante
      const estudiante = await Estudiante.create(
        { personId: person.id },
        { client: trx }
      )

      // 3) Matrícula
      const ciclo = await Ciclo.find(sol.cicloId, { client: trx })
      if (!ciclo) {
        await trx.rollback()
        return { status: 'error', message: 'ciclo no encontrado' }
      }
      const precioMatriculaCiclo =
        sol.modalidad === 'presencial'
          ? ciclo.montoMatriculaPresencial
          : ciclo.montoMatriculaVirtual
      const precioMensualidadCiclo =
        sol.modalidad === 'presencial'
          ? ciclo.montoMensualidadPresencial
          : ciclo.montoMensualidadVirtual

      const overrideMat = request.input('precioMatricula')
      const overrideMen = request.input('precioMensualidad')

      const precioMatricula =
        overrideMat !== undefined && overrideMat !== null
          ? Number(overrideMat)
          : precioMatriculaCiclo
      const precioMensualidad =
        overrideMen !== undefined && overrideMen !== null
          ? Number(overrideMen)
          : precioMensualidadCiclo

      const matricula = await Matricula.create(
        {
          estudianteId: estudiante.id,
          cicloId: sol.cicloId,
          modalidad: sol.modalidad,
          turnoId: sol.turnoId,
          precioMatricula,
          precioMensualidad,
          estado: 'pendiente',
          fechaInicio: ciclo.fechaInicio,
          fechaFin: ciclo.fechaFin,
        },
        { client: trx }
      )

      const cuotas = await generarCronograma({
        matricula,
        fechaInicio: ciclo.fechaInicio,
        fechaFin: ciclo.fechaFin,
        precioMatricula,
        precioMensualidad,
        trx,
      })

      // 4) Crear pagos automáticos por los vouchers
      const cuotaMatricula = cuotas.find((c) => c.tipo === 'matricula')
      const primeraMensualidad = cuotas
        .filter((c) => c.tipo === 'mensualidad')
        .sort((a, b) => a.numeroCuota - b.numeroCuota)[0]

      const registrarMat = request.input(
        'registrarPagoMatricula',
        !!sol.comprobanteMatriculaKey || !!sol.comprobanteMatriculaUrl
      )
      const registrarMen = request.input(
        'registrarPagoMensualidad',
        !!sol.comprobanteMensualidadKey || !!sol.comprobanteMensualidadUrl
      )
      const metodo = request.input('metodoPago', 'transferencia')

      const pagosCreados: Pago[] = []
      if (registrarMat && cuotaMatricula) {
        const p = await Pago.create(
          {
            matriculaId: matricula.id,
            cuotaId: cuotaMatricula.id,
            tipo: 'matricula',
            metodo: metodo === 'transferencia' ? 'yape' : metodo, // por compat enum
            monto: precioMatricula,
            imagenVoucherUrl: sol.comprobanteMatriculaUrl,
            imagenVoucherKey: sol.comprobanteMatriculaKey,
            estado: 'validado',
          },
          { client: trx }
        )
        pagosCreados.push(p)
      }
      if (registrarMen && primeraMensualidad) {
        const p = await Pago.create(
          {
            matriculaId: matricula.id,
            cuotaId: primeraMensualidad.id,
            tipo: 'mensualidad',
            metodo: metodo === 'transferencia' ? 'yape' : metodo,
            monto: precioMensualidad,
            imagenVoucherUrl: sol.comprobanteMensualidadUrl,
            imagenVoucherKey: sol.comprobanteMensualidadKey,
            estado: 'validado',
          },
          { client: trx }
        )
        pagosCreados.push(p)
      }

      // 5) Recalcular las cuotas afectadas (esto también marca matricula → 'matriculado')
      for (const p of pagosCreados) {
        if (p.cuotaId) await recalcularCuota(p.cuotaId, trx)
      }

      // 6) Actualizar la solicitud
      sol.estado = 'aprobada'
      sol.estudianteId = estudiante.id
      sol.matriculaId = matricula.id
      sol.useTransaction(trx)
      await sol.save()

      await trx.commit()

      return {
        status: 'success',
        message: `Solicitud aprobada. ${pagosCreados.length} pago(s) registrado(s).`,
        data: {
          solicitud: sol,
          personaId: person.id,
          estudianteId: estudiante.id,
          matriculaId: matricula.id,
          pagosCreados: pagosCreados.length,
        },
      }
    } catch (error) {
      await trx.rollback()
      return { status: 'error', message: 'aprobar error', error }
    }
  }

  public async rechazar({ params, request }: HttpContext) {
    try {
      const sol = await SolicitudMatricula.findOrFail(params.id)
      if (sol.estado !== 'pendiente') {
        return { status: 'error', message: `La solicitud ya está ${sol.estado}` }
      }
      sol.estado = 'rechazada'
      sol.notasAdmin = request.input('notas') || null
      await sol.save()
      return { status: 'success', message: 'Solicitud rechazada', data: sol }
    } catch (error) {
      return { status: 'error', message: 'rechazar error', error }
    }
  }

  // Marcador para que TS no se queje del import de DateTime/CuotaMatricula
  public _luxon = DateTime
  public _cuota = CuotaMatricula
}

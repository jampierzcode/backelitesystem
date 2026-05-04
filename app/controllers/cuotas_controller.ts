import CuotaMatricula from '#models/cuota_matricula'
import { generarUrlFirmada } from '#services/storage_service'
import type { HttpContext } from '@adonisjs/core/http'

async function refrescarVouchersDeCuotas(cuotas: CuotaMatricula[]): Promise<void> {
  const tareas: Promise<void>[] = []
  for (const c of cuotas) {
    const pagos = (c as any).pagos || []
    for (const p of pagos) {
      if (p.imagenVoucherKey) {
        tareas.push(
          generarUrlFirmada(p.imagenVoucherKey).then((url) => {
            p.imagenVoucherUrl = url
          })
        )
      }
    }
  }
  await Promise.all(tareas)
}

export default class CuotasController {
  /**
   * Lista cuotas. Acepta ?matricula_id=
   * Preload pagos validados con voucher; refresca URLs firmadas.
   */
  public async index({ request }: HttpContext) {
    try {
      const query = CuotaMatricula.query().preload('pagos')
      const matriculaId = request.input('matricula_id')
      if (matriculaId) query.where('matricula_id', matriculaId)
      query.orderBy('numero_cuota', 'asc')

      const cuotas = await query
      await refrescarVouchersDeCuotas(cuotas)
      return {
        status: 'success',
        message: 'cuotas fetched',
        data: cuotas,
      }
    } catch (error) {
      return { status: 'error', message: 'cuotas fetch error', error }
    }
  }

  public async show({ params }: HttpContext) {
    try {
      const cuota = await CuotaMatricula.query()
        .where('id', params.id)
        .preload('pagos')
        .firstOrFail()
      await refrescarVouchersDeCuotas([cuota])
      return {
        status: 'success',
        message: 'cuota fetched',
        data: cuota,
      }
    } catch (error) {
      return { status: 'error', message: 'cuota fetch error', error }
    }
  }
}

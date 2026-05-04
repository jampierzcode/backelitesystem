import Pago from '#models/pago'
import { recalcularCuota } from '#services/cuotas_service'
import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'

export default class PagosController {
  public async index({}: HttpContext) {
    try {
      const pagos = await Pago.all()
      return {
        status: 'success',
        message: 'pagos fetched with success',
        data: pagos,
      }
    } catch (error) {
      return { status: 'error', message: 'pagos fetch error', error }
    }
  }

  public async show({ params }: HttpContext) {
    try {
      const pago = await Pago.findOrFail(params.id)
      return {
        status: 'success',
        message: 'pago fetched with success',
        data: pago,
      }
    } catch (error) {
      return { status: 'error', message: 'pago fetch error', error }
    }
  }

  public async store({ request }: HttpContext) {
    const trx = await db.transaction()
    try {
      const data = request.only([
        'matriculaId',
        'cuotaId',
        'tipo',
        'metodo',
        'monto',
        'codigoOperacion',
        'imagenVoucherUrl',
        'estado',
      ])
      const pago = await Pago.create(data, { client: trx })

      if (pago.cuotaId) {
        await recalcularCuota(pago.cuotaId, trx)
      }

      await trx.commit()
      return {
        status: 'success',
        message: 'pago created successfully',
        data: pago,
      }
    } catch (error) {
      await trx.rollback()
      return { status: 'error', message: 'pago store error', error }
    }
  }

  public async update({ params, request }: HttpContext) {
    const trx = await db.transaction()
    try {
      const pago = await Pago.query({ client: trx }).where('id', params.id).firstOrFail()
      const data = request.only([
        'matriculaId',
        'cuotaId',
        'tipo',
        'metodo',
        'monto',
        'codigoOperacion',
        'imagenVoucherUrl',
        'estado',
      ])
      const cuotaIdAnterior = pago.cuotaId
      pago.merge(data)
      await pago.save()

      // Recalcular cuota nueva y, si cambió, también la anterior
      if (pago.cuotaId) await recalcularCuota(pago.cuotaId, trx)
      if (cuotaIdAnterior && cuotaIdAnterior !== pago.cuotaId) {
        await recalcularCuota(cuotaIdAnterior, trx)
      }

      await trx.commit()
      return {
        status: 'success',
        message: 'pago updated successfully',
        data: pago,
      }
    } catch (error) {
      await trx.rollback()
      return { status: 'error', message: 'pago update error', error }
    }
  }

  public async destroy({ params }: HttpContext) {
    const trx = await db.transaction()
    try {
      const pago = await Pago.query({ client: trx }).where('id', params.id).firstOrFail()
      const cuotaId = pago.cuotaId
      await pago.useTransaction(trx).delete()

      if (cuotaId) {
        await recalcularCuota(cuotaId, trx)
      }

      await trx.commit()
      return {
        status: 'success',
        message: 'pago deleted successfully',
        data: pago,
      }
    } catch (error) {
      await trx.rollback()
      return { status: 'error', message: 'pago delete error', error }
    }
  }
}

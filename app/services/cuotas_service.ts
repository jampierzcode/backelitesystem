import { DateTime } from 'luxon'
import CuotaMatricula from '#models/cuota_matricula'
import Matricula from '#models/matricula'
import Database from '@adonisjs/lucid/services/db'
import type { TransactionClientContract } from '@adonisjs/lucid/types/database'

const DIA_VENCIMIENTO_MENSUAL = 5 // todos los meses, vencen el día 5

export interface GenerarCuotasInput {
  matricula: Matricula
  fechaInicio: DateTime
  fechaFin: DateTime
  precioMatricula: number
  precioMensualidad: number
  trx?: TransactionClientContract
}

/**
 * Genera el cronograma completo: 1 cuota tipo "matricula" + N mensualidades
 * desde el mes de fechaInicio hasta el mes de fechaFin (inclusive).
 *
 * - Cobra mensualidad completa por cada mes iniciado dentro del rango.
 * - La cuota de matrícula vence el día de fechaInicio.
 * - Las mensualidades vencen el día DIA_VENCIMIENTO_MENSUAL del mes correspondiente.
 */
export async function generarCronograma(input: GenerarCuotasInput): Promise<CuotaMatricula[]> {
  const { matricula, fechaInicio, fechaFin, precioMatricula, precioMensualidad, trx } = input

  const cuotas: Partial<CuotaMatricula>[] = []
  let numero = 1

  cuotas.push({
    matriculaId: matricula.id,
    tipo: 'matricula',
    numeroCuota: numero++,
    mesReferencia: null,
    montoEsperado: precioMatricula,
    montoPagado: 0,
    fechaVencimiento: fechaInicio,
    estado: 'pendiente',
  })

  // Iterar mes a mes desde el mes de inicio hasta el mes de fin
  let cursor = fechaInicio.startOf('month')
  const limite = fechaFin.startOf('month')

  while (cursor <= limite) {
    cuotas.push({
      matriculaId: matricula.id,
      tipo: 'mensualidad',
      numeroCuota: numero++,
      mesReferencia: cursor,
      montoEsperado: precioMensualidad,
      montoPagado: 0,
      fechaVencimiento: cursor.set({ day: DIA_VENCIMIENTO_MENSUAL }),
      estado: 'pendiente',
    })
    cursor = cursor.plus({ months: 1 })
  }

  return await CuotaMatricula.createMany(cuotas, { client: trx })
}

/**
 * Borra todas las cuotas de una matrícula. Útil para regenerar el cronograma
 * cuando cambian fechas/precios y aún no hay pagos.
 */
export async function borrarCronograma(
  matriculaId: number,
  trx?: TransactionClientContract
): Promise<void> {
  await CuotaMatricula.query({ client: trx }).where('matricula_id', matriculaId).delete()
}

/**
 * Recalcula el estado de una cuota a partir de la suma de pagos validados.
 * Si la cuota es de tipo "matricula" y queda pagada/pendiente, sincroniza
 * el estado de la matrícula correspondiente (matriculado/pendiente).
 *
 * Llamar después de crear/actualizar/eliminar un pago.
 */
export async function recalcularCuota(
  cuotaId: number,
  trx?: TransactionClientContract
): Promise<CuotaMatricula | null> {
  const cuota = await CuotaMatricula.find(cuotaId, { client: trx })
  if (!cuota) return null

  // Sumamos pagos validados con query directo para soportar trx correctamente
  const sumQ = Database.from('pagos')
    .where('cuota_id', cuotaId)
    .andWhere('estado', 'validado')
    .sum('monto as total')
  if (trx) sumQ.useTransaction(trx)
  const sumRows = await sumQ
  const total = Number((sumRows[0] as any)?.total ?? 0)

  cuota.montoPagado = total

  if (total <= 0) cuota.estado = 'pendiente'
  else if (total < cuota.montoEsperado) cuota.estado = 'parcial'
  else cuota.estado = 'pagada'

  if (trx) cuota.useTransaction(trx)
  await cuota.save()

  // Sincronizar estado de la matrícula si la cuota es de matrícula
  if (cuota.tipo === 'matricula') {
    const matricula = await Matricula.find(cuota.matriculaId, { client: trx })
    if (matricula) {
      const nuevoEstado = cuota.estado === 'pagada' ? 'matriculado' : 'pendiente'
      if (matricula.estado !== nuevoEstado) {
        matricula.estado = nuevoEstado
        if (trx) matricula.useTransaction(trx)
        await matricula.save()
      }
    }
  }

  return cuota
}

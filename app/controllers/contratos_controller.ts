import Contrato from '#models/contrato'
import db from '@adonisjs/lucid/services/db'
import { uploadFile, generarUrlFirmada, deleteFile } from '#services/storage_service'
import type { HttpContext } from '@adonisjs/core/http'

const STORAGE_FOLDER = 'contratos'
const ALLOWED_EXT = ['pdf', 'png', 'jpg', 'jpeg', 'doc', 'docx']

export default class ContratosController {
  /**
   * Lista contratos. Acepta ?profesor_id=...
   */
  public async index({ request }: HttpContext) {
    try {
      const query = Contrato.query().preload('profesor')
      const profesorId = request.input('profesor_id')
      if (profesorId) query.where('profesor_id', profesorId)
      query.orderBy('fecha_inicio', 'desc')

      const contratos = await query
      return {
        status: 'success',
        message: 'contratos fetched with success',
        data: contratos,
      }
    } catch (error) {
      return { status: 'error', message: 'contratos fetch error', error }
    }
  }

  public async show({ params }: HttpContext) {
    try {
      const contrato = await Contrato.query()
        .where('id', params.id)
        .preload('profesor')
        .firstOrFail()
      return { status: 'success', message: 'contrato fetched', data: contrato }
    } catch (error) {
      return { status: 'error', message: 'contrato fetch error', error }
    }
  }

  public async store({ request, response }: HttpContext) {
    const trx = await db.transaction()
    try {
      const data = request.only([
        'profesorId',
        'tipo',
        'fechaInicio',
        'fechaFin',
        'sueldoMensual',
        'tarifaHora',
        'horasSemanales',
        'moneda',
        'estado',
        'notas',
      ])

      if (!data.profesorId || !data.tipo || !data.fechaInicio) {
        await trx.rollback()
        return response.badRequest({
          status: 'error',
          message: 'profesorId, tipo y fechaInicio son requeridos',
        })
      }

      // Si el nuevo contrato es 'activo', finalizar los demás del mismo profesor
      if ((data.estado || 'activo') === 'activo') {
        await Contrato.query({ client: trx })
          .where('profesor_id', data.profesorId)
          .where('estado', 'activo')
          .update({ estado: 'finalizado' })
      }

      const archivoFields = await this.handleFileUpload(request)

      const contrato = await Contrato.create(
        {
          ...data,
          ...archivoFields,
          estado: data.estado || 'activo',
          moneda: data.moneda || 'PEN',
        },
        { client: trx }
      )

      await trx.commit()
      return { status: 'success', message: 'contrato created', data: contrato }
    } catch (error) {
      await trx.rollback()
      return { status: 'error', message: 'contrato store error', error }
    }
  }

  public async update({ params, request }: HttpContext) {
    const trx = await db.transaction()
    try {
      const contrato = await Contrato.query({ client: trx }).where('id', params.id).firstOrFail()

      const data = request.only([
        'tipo',
        'fechaInicio',
        'fechaFin',
        'sueldoMensual',
        'tarifaHora',
        'horasSemanales',
        'moneda',
        'estado',
        'notas',
      ])

      // Si cambia a activo, finalizar otros activos del mismo profesor
      if (data.estado === 'activo' && contrato.estado !== 'activo') {
        await Contrato.query({ client: trx })
          .where('profesor_id', contrato.profesorId)
          .where('estado', 'activo')
          .whereNot('id', contrato.id)
          .update({ estado: 'finalizado' })
      }

      const archivoFields = await this.handleFileUpload(request)
      // Si vino un nuevo archivo, borrar el anterior del bucket
      if (archivoFields.archivoPath && contrato.archivoPath) {
        await deleteFile(contrato.archivoPath)
      }

      contrato.merge({ ...data, ...archivoFields })
      await contrato.save()

      await trx.commit()
      return { status: 'success', message: 'contrato updated', data: contrato }
    } catch (error) {
      await trx.rollback()
      return { status: 'error', message: 'contrato update error', error }
    }
  }

  public async destroy({ params }: HttpContext) {
    try {
      const contrato = await Contrato.findOrFail(params.id)
      if (contrato.archivoPath) {
        await deleteFile(contrato.archivoPath)
      }
      await contrato.delete()
      return { status: 'success', message: 'contrato deleted', data: { id: contrato.id } }
    } catch (error) {
      return { status: 'error', message: 'contrato delete error', error }
    }
  }

  /**
   * Descarga el archivo del contrato vía presigned URL del bucket.
   * Hace redirect 302 para no romper el contrato actual del front.
   */
  public async download({ params, response }: HttpContext) {
    try {
      const contrato = await Contrato.findOrFail(params.id)
      if (!contrato.archivoPath) {
        return response.notFound({ status: 'error', message: 'contrato sin archivo' })
      }
      const url = await generarUrlFirmada(contrato.archivoPath)
      return response.redirect(url)
    } catch (error) {
      return response.internalServerError({ status: 'error', message: 'download error', error })
    }
  }

  // -------- helpers --------

  private async handleFileUpload(request: HttpContext['request']) {
    const file = request.file('archivo', { size: '20mb', extnames: ALLOWED_EXT })
    if (!file) return {}
    if (!file.isValid) {
      throw new Error(`Archivo inválido: ${file.errors.map((e) => e.message).join(', ')}`)
    }
    const result = await uploadFile(file, STORAGE_FOLDER)
    return {
      archivoNombre: result.filename,
      archivoPath: result.key,
    }
  }
}

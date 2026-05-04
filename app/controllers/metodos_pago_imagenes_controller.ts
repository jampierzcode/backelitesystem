import MetodoPagoImagen from '#models/metodo_pago_imagen'
import { uploadFile, generarUrlFirmada, STORAGE_LIMITS } from '#services/storage_service'
import type { HttpContext } from '@adonisjs/core/http'

async function refrescarUrl(item: MetodoPagoImagen): Promise<void> {
  if (item.storageKey) {
    item.url = await generarUrlFirmada(item.storageKey)
  }
}

export default class MetodosPagoImagenesController {
  /** GET /api/metodos-pago-imagenes (auth) */
  public async index({}: HttpContext) {
    try {
      const items = await MetodoPagoImagen.query().orderBy('orden', 'asc').orderBy('id', 'asc')
      await Promise.all(items.map(refrescarUrl))
      return { status: 'success', data: items }
    } catch (error) {
      return { status: 'error', message: 'fetch error', error }
    }
  }

  /** POST /api/metodos-pago-imagenes (auth, multipart) */
  public async store({ request, response }: HttpContext) {
    try {
      const file = request.file('file', STORAGE_LIMITS) || request.file('archivo', STORAGE_LIMITS)
      if (!file) {
        return response.badRequest({ status: 'error', message: 'Falta archivo (campo: file)' })
      }
      const result = await uploadFile(file, 'metodos-pago')

      const descripcion = request.input('descripcion') || null
      const orden = Number(request.input('orden') ?? 0)

      const item = await MetodoPagoImagen.create({
        url: result.url,
        storageKey: result.key,
        descripcion,
        orden,
        activo: true,
      })
      return { status: 'success', data: item }
    } catch (error: any) {
      return { status: 'error', message: error?.message || 'store error', error }
    }
  }

  /** PUT /api/metodos-pago-imagenes/:id */
  public async update({ params, request }: HttpContext) {
    try {
      const item = await MetodoPagoImagen.findOrFail(params.id)
      const data = request.only(['descripcion', 'orden', 'activo'])
      item.merge(data)
      await item.save()
      return { status: 'success', data: item }
    } catch (error) {
      return { status: 'error', message: 'update error', error }
    }
  }

  /** DELETE /api/metodos-pago-imagenes/:id */
  public async destroy({ params }: HttpContext) {
    try {
      const item = await MetodoPagoImagen.findOrFail(params.id)
      await item.delete()
      return { status: 'success', data: { id: item.id } }
    } catch (error) {
      return { status: 'error', message: 'delete error', error }
    }
  }

  /**
   * GET /api/public/metodos-pago-imagenes (sin auth)
   * Lista las activas, con URLs firmadas frescas. La consume el sitio público
   * y también el bot al responder pagos.
   */
  public async indexPublico({}: HttpContext) {
    try {
      const items = await MetodoPagoImagen.query()
        .where('activo', true)
        .orderBy('orden', 'asc')
        .orderBy('id', 'asc')
      await Promise.all(items.map(refrescarUrl))
      return { status: 'success', data: items }
    } catch (error) {
      return { status: 'error', message: 'fetch error', error }
    }
  }
}

import {
  uploadFile,
  STORAGE_LIMITS,
  generarUrlFirmada,
} from '#services/storage_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class UploadsController {
  /**
   * POST /api/uploads/voucher (auth)
   * Sube un voucher de pago al bucket. Devuelve { url } para guardarlo en pago/etc.
   */
  public async voucher({ request, response }: HttpContext) {
    return this.subir(request, response, 'vouchers')
  }

  /**
   * POST /api/public/uploads/comprobante (sin auth)
   * Para el sitio público de matrícula: sube el comprobante de pago.
   */
  public async comprobantePublico({ request, response }: HttpContext) {
    return this.subir(request, response, 'comprobantes-publicos')
  }

  /**
   * GET /api/uploads/url-firmada?key=...
   * Regenera una URL firmada para una key existente (cuando expira la anterior).
   */
  public async urlFirmada({ request, response }: HttpContext) {
    try {
      const key = request.input('key')
      if (!key) {
        return response.badRequest({ status: 'error', message: 'key requerido' })
      }
      const url = await generarUrlFirmada(key)
      return { status: 'success', data: { url, key } }
    } catch (error: any) {
      return response.internalServerError({
        status: 'error',
        message: error?.message || 'url-firmada error',
      })
    }
  }

  private async subir(request: HttpContext['request'], response: HttpContext['response'], folder: string) {
    const file = request.file('file', STORAGE_LIMITS) || request.file('archivo', STORAGE_LIMITS)
    if (!file) {
      return response.badRequest({ status: 'error', message: 'Falta archivo (campo: file)' })
    }
    try {
      const result = await uploadFile(file, folder)
      return {
        status: 'success',
        message: 'Archivo subido',
        data: result,
      }
    } catch (error: any) {
      return response.internalServerError({
        status: 'error',
        message: error?.message || 'upload error',
      })
    }
  }
}

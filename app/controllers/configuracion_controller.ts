import Configuracion from '#models/configuracion'
import type { HttpContext } from '@adonisjs/core/http'

const SINGLETON_ID = 1

export default class ConfiguracionController {
  /**
   * GET /api/configuracion
   * Devuelve la única fila de configuración (singleton id=1).
   */
  public async show({}: HttpContext) {
    try {
      let cfg = await Configuracion.find(SINGLETON_ID)
      if (!cfg) {
        cfg = await Configuracion.create({
          id: SINGLETON_ID,
          nombreEmpresa: 'Mi Academia',
          monedaDefault: 'PEN',
        })
      }
      return { status: 'success', data: cfg }
    } catch (error) {
      return { status: 'error', message: 'configuracion fetch error', error }
    }
  }

  /**
   * PUT /api/configuracion
   * Actualiza el singleton de configuración.
   */
  public async update({ request }: HttpContext) {
    try {
      let cfg = await Configuracion.find(SINGLETON_ID)
      if (!cfg) {
        cfg = await Configuracion.create({ id: SINGLETON_ID, nombreEmpresa: 'Mi Academia' })
      }
      const data = request.only([
        'nombreEmpresa',
        'logoUrl',
        'mision',
        'vision',
        'emailContacto',
        'whatsappContacto',
        'whatsappNotificaciones',
        'telefonoFijo',
        'direccionPrincipal',
        'estadosCuenta',
        'monedaDefault',
        'beneficios',
        'adminUrl',
        'notas',
      ])
      cfg.merge(data)
      await cfg.save()
      return { status: 'success', message: 'configuracion actualizada', data: cfg }
    } catch (error) {
      return { status: 'error', message: 'configuracion update error', error }
    }
  }

  /**
   * GET /api/public/configuracion
   * Versión pública (sin auth) — solo expone datos seguros (logo, mision, etc.)
   * Útil para el sitio de matrícula pública si quiere mostrar branding.
   */
  public async showPublico({}: HttpContext) {
    try {
      const cfg = await Configuracion.find(SINGLETON_ID)
      if (!cfg) return { status: 'success', data: null }
      // Solo campos seguros públicos
      return {
        status: 'success',
        data: {
          nombreEmpresa: cfg.nombreEmpresa,
          logoUrl: cfg.logoUrl,
          mision: cfg.mision,
          vision: cfg.vision,
          emailContacto: cfg.emailContacto,
          whatsappContacto: cfg.whatsappContacto,
          telefonoFijo: cfg.telefonoFijo,
          direccionPrincipal: cfg.direccionPrincipal,
          estadosCuenta: cfg.estadosCuenta,
          beneficios: cfg.beneficios,
        },
      }
    } catch (error) {
      return { status: 'error', message: 'configuracion publica error', error }
    }
  }
}

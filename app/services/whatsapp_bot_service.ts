import env from '#start/env'

export interface NotificarSolicitudInput {
  nombre: string
  apellido?: string | null
  dni?: string | null
  whatsapp?: string | null
  ciclo?: string | null
  modalidad?: string | null
  turno?: string | null
  sede?: string | null
  solicitudId: number
}

/**
 * Llama al apiBotElite para que envíe un mensaje de WhatsApp al número
 * configurado en la tabla `configuracion`. Si el bot no está corriendo
 * o la configuración falta, no rompe el flujo de la solicitud.
 */
export async function notificarSolicitudWhatsapp(
  payload: NotificarSolicitudInput
): Promise<void> {
  const url = env.get('BOT_WHATSAPP_URL')
  const token = env.get('BOT_INTERNAL_TOKEN')
  if (!url || !token) return

  try {
    await fetch(`${url.replace(/\/$/, '')}/notify-solicitud`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-token': token,
      },
      body: JSON.stringify(payload),
      // Timeout corto para no demorar la respuesta de la solicitud
      signal: AbortSignal.timeout(5000),
    })
  } catch {
    // Silencioso: el bot puede estar caído. La solicitud y la notificación
    // in-app vía Transmit ya se entregaron, así que no es crítico.
  }
}

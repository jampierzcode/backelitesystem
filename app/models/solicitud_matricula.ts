import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Ciclo from './ciclo.js'
import Sede from './sede.js'
import Estudiante from './estudiante.js'
import Matricula from './matricula.js'
import Turno from './turno.js'

export type EstadoSolicitud = 'pendiente' | 'aprobada' | 'rechazada'

export default class SolicitudMatricula extends BaseModel {
  static table = 'solicitudes_matricula'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nombre: string

  @column()
  declare apellido: string | null

  @column()
  declare dni: string | null

  @column()
  declare email: string | null

  @column()
  declare whatsapp: string

  @column({ columnName: 'ciclo_id' })
  declare cicloId: number

  @belongsTo(() => Ciclo)
  declare ciclo: BelongsTo<typeof Ciclo>

  @column()
  declare modalidad: 'presencial' | 'virtual'

  @column({ columnName: 'turno_id' })
  declare turnoId: number | null

  @belongsTo(() => Turno)
  declare turno: BelongsTo<typeof Turno>

  @column({ columnName: 'sede_id' })
  declare sedeId: number | null

  @belongsTo(() => Sede)
  declare sede: BelongsTo<typeof Sede>

  @column({ columnName: 'comprobante_pago_url' })
  declare comprobantePagoUrl: string | null

  @column({ columnName: 'comprobante_matricula_url' })
  declare comprobanteMatriculaUrl: string | null

  @column({ columnName: 'comprobante_matricula_key' })
  declare comprobanteMatriculaKey: string | null

  @column({ columnName: 'comprobante_mensualidad_url' })
  declare comprobanteMensualidadUrl: string | null

  @column({ columnName: 'comprobante_mensualidad_key' })
  declare comprobanteMensualidadKey: string | null

  @column({ columnName: 'monto_referencia' })
  declare montoReferencia: number | null

  @column()
  declare estado: EstadoSolicitud

  @column({ columnName: 'notas_admin' })
  declare notasAdmin: string | null

  @column({ columnName: 'estudiante_id' })
  declare estudianteId: number | null

  @belongsTo(() => Estudiante)
  declare estudiante: BelongsTo<typeof Estudiante>

  @column({ columnName: 'matricula_id' })
  declare matriculaId: number | null

  @belongsTo(() => Matricula)
  declare matricula: BelongsTo<typeof Matricula>

  @column({ columnName: 'ip_origen' })
  declare ipOrigen: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: false, autoUpdate: true })
  declare updatedAt: DateTime | null
}

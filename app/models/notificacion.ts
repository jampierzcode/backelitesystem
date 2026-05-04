import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import User from './user.js'

export default class Notificacion extends BaseModel {
  static table = 'notificaciones'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'user_id' })
  declare userId: number | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare tipo: string

  @column()
  declare titulo: string

  @column()
  declare mensaje: string | null

  @column({
    prepare: (v: any) => (v ? JSON.stringify(v) : null),
    consume: (v: any) => {
      if (!v) return null
      if (typeof v === 'string') {
        try {
          return JSON.parse(v)
        } catch {
          return null
        }
      }
      return v
    },
  })
  declare payload: Record<string, any> | null

  @column()
  declare url: string | null

  @column()
  declare leida: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: false, autoUpdate: true })
  declare updatedAt: DateTime | null
}

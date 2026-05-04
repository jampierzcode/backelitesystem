import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'persons'

  async up() {
    this.defer(async (db) => {
      await db.rawQuery(
        `ALTER TABLE persons MODIFY COLUMN tipo ENUM('estudiante','profesor','secretaria') NOT NULL`
      )
    })
  }

  async down() {
    this.defer(async (db) => {
      await db.rawQuery(
        `ALTER TABLE persons MODIFY COLUMN tipo ENUM('estudiante','profesor','secretaria','admin') NOT NULL`
      )
    })
  }
}

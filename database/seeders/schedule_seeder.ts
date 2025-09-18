import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Schedule from '#models/schedule'

export default class ScheduleSeeder extends BaseSeeder {
  public async run() {
    const days: string[] = [
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
      'Domingo',
    ]

    await Schedule.createMany(
      days.map((day) => {
        return {
          dia: day,
          hora_inicio: '09:00:00',
          hora_fin: '18:00:00',
          activo: true,
        }
      })
    )
  }
}

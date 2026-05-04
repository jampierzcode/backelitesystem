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
          horaInicio: '09:00:00',
          horaFin: '18:00:00',
          activo: true,
        }
      })
    )
  }
}

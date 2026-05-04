import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#models/role'
import User from '#models/user'

export default class AdminSeeder extends BaseSeeder {
  public async run() {
    const role = await Role.firstOrCreate({ name: 'superadmin' }, { name: 'superadmin' })

    await User.updateOrCreate(
      { email: 'admin@elite.com' },
      {
        email: 'admin@elite.com',
        password: 'Admin123!',
        personId: null,
        rolId: role.id,
        status: 'activo',
      }
    )
  }
}

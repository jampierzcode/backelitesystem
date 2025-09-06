/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import AuthController from '#controllers/auth_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

import MatriculasController from '#controllers/matriculas_controller'
import PagosController from '#controllers/pagos_controller'
import PersonsController from '#controllers/persons_controller'
import UsersController from '#controllers/users_controller'
import ConversacionesController from '#controllers/conversaciones_controller'
import CostoPagosController from '#controllers/costos_pagos_controller'
import EstudiantesController from '#controllers/estudiantes_controller'
import CiclosController from '#controllers/ciclos_controller'
import RolesController from '#controllers/roles_controller'
import AsistenciasController from '#controllers/asistencias_controller'
import NotasSimulacroController from '#controllers/notas_simulacros_controller'
import ExamenesSimulacroController from '#controllers/examenes_simulacros_controller'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})
router.post('/api/register', [AuthController, 'register']).as('auth.register')
router.post('/api/newuser', [AuthController, 'createUser']).as('auth.createUser')

router.post('/api/login', [AuthController, 'login']).as('auth.login')

// Grupo protegido
router
  .group(() => {
    router.delete('/logout', [AuthController, 'logout']).as('auth.logout').use(middleware.auth())
    router.post('/updatePassword', [AuthController, 'updatePassword']).as('auth.updatePassword')
    router.get('/me', [AuthController, 'me']).as('auth.me')

    router.get('/users', [UsersController, 'index']).as('users.index')
    router.get('/users/:id', [UsersController, 'show']).as('users.show')
    router.post('/users', [UsersController, 'store']).as('users.store')
    router.put('/users/:id', [UsersController, 'update']).as('users.update')
    router.delete('/users/:id', [UsersController, 'destroy']).as('users.destroy')

    router.get('/roles', [RolesController, 'index']).as('roles.index')
    router.get('/roles/:id', [RolesController, 'show']).as('roles.show')
    router.post('/roles', [RolesController, 'store']).as('roles.store')
    router.put('/roles/:id', [RolesController, 'update']).as('roles.update')
    router.delete('/roles/:id', [RolesController, 'destroy']).as('roles.destroy')

    router.get('/persons', [PersonsController, 'index']).as('persons.index')
    router.get('/persons/:id', [PersonsController, 'show']).as('persons.show')
    router.post('/persons', [PersonsController, 'store']).as('persons.store')
    router.put('/persons/:id', [PersonsController, 'update']).as('persons.update')
    router.delete('/persons/:id', [PersonsController, 'destroy']).as('persons.destroy')

    router.get('/pagos', [PagosController, 'index']).as('pagos.index')
    router.get('/pagos/:id', [PagosController, 'show']).as('pagos.show')
    router.post('/pagos', [PagosController, 'store']).as('pagos.store')
    router.put('/pagos/:id', [PagosController, 'update']).as('pagos.update')
    router.delete('/pagos/:id', [PagosController, 'destroy']).as('pagos.destroy')

    router.get('/matriculas', [MatriculasController, 'index']).as('matriculas.index')
    router.get('/matriculas/:id', [MatriculasController, 'show']).as('matriculas.show')
    router.post('/matriculas', [MatriculasController, 'store']).as('matriculas.store')
    router.put('/matriculas/:id', [MatriculasController, 'update']).as('matriculas.update')
    router.delete('/matriculas/:id', [MatriculasController, 'destroy']).as('matriculas.destroy')

    router.get('/asistencias', [AsistenciasController, 'index']).as('asistencias.index')
    router.get('/asistencias:id', [AsistenciasController, 'show']).as('asistencias.show')
    router.post('/asistencias', [AsistenciasController, 'store']).as('asistencias.store')
    router.put('/asistencias/:id', [AsistenciasController, 'update']).as('asistencias.update')
    router.delete('/asistencias/:id', [AsistenciasController, 'destroy']).as('asistencias.destroy')

    router.get('/notasSimulacro', [NotasSimulacroController, 'index']).as('notasSimulacro.index')
    // router.get('/notasSimulacro:id', [NotasSimulacroController, 'show']).as('notasSimulacro.show')
    router.post('/notasSimulacro', [NotasSimulacroController, 'store']).as('notasSimulacro.store')
    router
      .put('/notasSimulacro/:id', [NotasSimulacroController, 'update'])
      .as('notasSimulacro.update')
    router
      .delete('/notasSimulacro/:id', [NotasSimulacroController, 'destroy'])
      .as('notasSimulacro.destroy')

    router
      .get('/examenesSimulacro', [ExamenesSimulacroController, 'index'])
      .as('examenesSimulacro.index')
    router
      .get('/examenesSimulacro:id', [ExamenesSimulacroController, 'show'])
      .as('examenesSimulacro.show')
    router
      .post('/examenesSimulacro', [ExamenesSimulacroController, 'store'])
      .as('examenesSimulacro.store')
    router
      .put('/examenesSimulacro/:id', [ExamenesSimulacroController, 'update'])
      .as('examenesSimulacro.update')
    router
      .delete('/examenesSimulacro/:id', [ExamenesSimulacroController, 'destroy'])
      .as('examenesSimulacro.destroy')

    router.get('/estudiantes', [EstudiantesController, 'index']).as('estudiantes.index')
    router.get('/estudiantes/:id', [EstudiantesController, 'show']).as('estudiantes.show')
    router.post('/estudiantes', [EstudiantesController, 'store']).as('estudiantes.store')
    router.put('/estudiantes/:id', [EstudiantesController, 'update']).as('estudiantes.update')
    router.delete('/estudiantes/:id', [EstudiantesController, 'destroy']).as('estudiantes.destroy')

    router.get('/costos-pagos', [CostoPagosController, 'index']).as('costospagos.index')
    router.get('/costos-pagos/:id', [CostoPagosController, 'show']).as('costospagos.show')
    router.post('/costos-pagos', [CostoPagosController, 'store']).as('costospagos.store')
    router.put('/costos-pagos/:id', [CostoPagosController, 'update']).as('costospagos.update')
    router.delete('/costos-pagos/:id', [CostoPagosController, 'destroy']).as('costospagos.destroy')

    router.get('/conversaciones', [ConversacionesController, 'index']).as('conversaciones.index')
    router.get('/conversaciones/:id', [ConversacionesController, 'show']).as('conversaciones.show')
    router.post('/conversaciones', [ConversacionesController, 'store']).as('conversaciones.store')
    router
      .put('/conversaciones/:id', [ConversacionesController, 'update'])
      .as('conversaciones.update')
    router
      .delete('/conversaciones/:id', [ConversacionesController, 'destroy'])
      .as('conversaciones.destroy')

    router.get('/ciclos', [CiclosController, 'index']).as('ciclos.index')
    router.get('/ciclos/:id', [CiclosController, 'show']).as('ciclos.show')
    router.post('/ciclos', [CiclosController, 'store']).as('ciclos.store')
    router.put('/ciclos/:id', [CiclosController, 'update']).as('ciclos.update')
    router.delete('/ciclos/:id', [CiclosController, 'destroy']).as('ciclos.destroy')
  })
  .prefix('/api')
  .use(middleware.auth({ guards: ['api'] }))

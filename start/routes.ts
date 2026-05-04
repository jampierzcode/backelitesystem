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
import SedesController from '#controllers/sedes_controller'
import SchedulesController from '#controllers/schedules_controller'
import CursosController from '#controllers/cursos_controller'
import ProfesoresController from '#controllers/profesores_controller'
import ClasesProfesorController from '#controllers/clases_profesor_controller'
import ContratosController from '#controllers/contratos_controller'
import CuotasController from '#controllers/cuotas_controller'
import ApoderadosController from '#controllers/apoderados_controller'
import ExcepcionesHorarioController from '#controllers/excepciones_horario_controller'
import HorariosController from '#controllers/horarios_controller'
import PoliticasAsistenciaController from '#controllers/politicas_asistencia_controller'
import SolicitudesMatriculaController from '#controllers/solicitudes_matricula_controller'
import SolicitudesMatriculaPublicasController from '#controllers/solicitudes_matricula_publicas_controller'
import NotificacionesController from '#controllers/notificaciones_controller'
import UploadsController from '#controllers/uploads_controller'
import ConfiguracionController from '#controllers/configuracion_controller'
import MetodosPagoImagenesController from '#controllers/metodos_pago_imagenes_controller'
import TurnosController from '#controllers/turnos_controller'
import transmit from '@adonisjs/transmit/services/main'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})
router.post('/api/register', [AuthController, 'register']).as('auth.register')
router.post('/api/newuser', [AuthController, 'createUser']).as('auth.createUser')

router.post('/api/login', [AuthController, 'login']).as('auth.login')

// === Endpoints públicos (sin auth) para el sitio de matrícula ===
router
  .group(() => {
    router.get('/ciclos', [SolicitudesMatriculaPublicasController, 'ciclos'])
    router.get('/sedes', [SolicitudesMatriculaPublicasController, 'sedes'])
    router.post('/solicitudes-matricula', [
      SolicitudesMatriculaPublicasController,
      'store',
    ])
    router.post('/uploads/comprobante', [UploadsController, 'comprobantePublico'])
    router.get('/configuracion', [ConfiguracionController, 'showPublico'])
    router.get('/metodos-pago-imagenes', [MetodosPagoImagenesController, 'indexPublico'])
    router.get('/turnos', [TurnosController, 'indexPublico'])
  })
  .prefix('/api/public')

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
    router
      .get('/asistencias/sin-marcar-hoy', [AsistenciasController, 'sinMarcarHoy'])
      .as('asistencias.sinMarcarHoy')
    router
      .post('/asistencias/marcar-qr', [AsistenciasController, 'marcarQr'])
      .as('asistencias.marcarQr')
    router
      .post('/asistencias/marcar-falta-masiva', [AsistenciasController, 'marcarFaltaMasiva'])
      .as('asistencias.marcarFaltaMasiva')
    router.get('/asistencias/:id', [AsistenciasController, 'show']).as('asistencias.show')
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
      .get('/examenesSimulacro/:id', [ExamenesSimulacroController, 'show'])
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

    router.get('/schedules', [SchedulesController, 'index']).as('schedules.index')
    router.get('/schedules/:id', [SchedulesController, 'show']).as('schedules.show')
    router.post('/schedules', [SchedulesController, 'store']).as('schedules.store')
    router.put('/schedules/:id', [SchedulesController, 'update']).as('schedules.update')
    router.delete('/schedules/:id', [SchedulesController, 'destroy']).as('schedules.destroy')

    router.get('/sedes', [SedesController, 'index']).as('sedes.index')
    router.get('/sedes/:id', [SedesController, 'show']).as('sedes.show')
    router.post('/sedes', [SedesController, 'store']).as('sedes.store')
    router.put('/sedes/:id', [SedesController, 'update']).as('sedes.update')
    router.delete('/sedes/:id', [SedesController, 'destroy']).as('sedes.destroy')

    router.get('/cursos', [CursosController, 'index']).as('cursos.index')
    router.get('/cursos/:id', [CursosController, 'show']).as('cursos.show')
    router.post('/cursos', [CursosController, 'store']).as('cursos.store')
    router.put('/cursos/:id', [CursosController, 'update']).as('cursos.update')
    router.delete('/cursos/:id', [CursosController, 'destroy']).as('cursos.destroy')

    router.get('/profesores', [ProfesoresController, 'index']).as('profesores.index')
    router.get('/profesores/:id', [ProfesoresController, 'show']).as('profesores.show')
    router.post('/profesores', [ProfesoresController, 'store']).as('profesores.store')
    router.put('/profesores/:id', [ProfesoresController, 'update']).as('profesores.update')
    router.delete('/profesores/:id', [ProfesoresController, 'destroy']).as('profesores.destroy')

    router.get('/clases-profesor', [ClasesProfesorController, 'index']).as('clasesProfesor.index')
    router.get('/clases-profesor/:id', [ClasesProfesorController, 'show']).as('clasesProfesor.show')
    router.post('/clases-profesor', [ClasesProfesorController, 'store']).as('clasesProfesor.store')
    router
      .put('/clases-profesor/:id', [ClasesProfesorController, 'update'])
      .as('clasesProfesor.update')
    router
      .delete('/clases-profesor/:id', [ClasesProfesorController, 'destroy'])
      .as('clasesProfesor.destroy')

    router.get('/contratos', [ContratosController, 'index']).as('contratos.index')
    router.get('/contratos/:id', [ContratosController, 'show']).as('contratos.show')
    router.post('/contratos', [ContratosController, 'store']).as('contratos.store')
    router.put('/contratos/:id', [ContratosController, 'update']).as('contratos.update')
    router.delete('/contratos/:id', [ContratosController, 'destroy']).as('contratos.destroy')
    router
      .get('/contratos/:id/archivo', [ContratosController, 'download'])
      .as('contratos.download')

    router.get('/cuotas', [CuotasController, 'index']).as('cuotas.index')
    router.get('/cuotas/:id', [CuotasController, 'show']).as('cuotas.show')

    router.get('/apoderados', [ApoderadosController, 'index']).as('apoderados.index')
    router.get('/apoderados/:id', [ApoderadosController, 'show']).as('apoderados.show')
    router.post('/apoderados', [ApoderadosController, 'store']).as('apoderados.store')
    router.put('/apoderados/:id', [ApoderadosController, 'update']).as('apoderados.update')
    router.delete('/apoderados/:id', [ApoderadosController, 'destroy']).as('apoderados.destroy')

    router
      .get('/excepciones-horario', [ExcepcionesHorarioController, 'index'])
      .as('excepcionesHorario.index')
    router
      .get('/excepciones-horario/:id', [ExcepcionesHorarioController, 'show'])
      .as('excepcionesHorario.show')
    router
      .post('/excepciones-horario', [ExcepcionesHorarioController, 'store'])
      .as('excepcionesHorario.store')
    router
      .put('/excepciones-horario/:id', [ExcepcionesHorarioController, 'update'])
      .as('excepcionesHorario.update')
    router
      .delete('/excepciones-horario/:id', [ExcepcionesHorarioController, 'destroy'])
      .as('excepcionesHorario.destroy')

    router
      .get('/horarios/operativo-actual', [HorariosController, 'operativoActual'])
      .as('horarios.operativoActual')

    router
      .get('/politicas-asistencia', [PoliticasAsistenciaController, 'index'])
      .as('politicasAsistencia.index')
    router
      .get('/politicas-asistencia/:id', [PoliticasAsistenciaController, 'show'])
      .as('politicasAsistencia.show')
    router
      .post('/politicas-asistencia', [PoliticasAsistenciaController, 'store'])
      .as('politicasAsistencia.store')
    router
      .put('/politicas-asistencia/:id', [PoliticasAsistenciaController, 'update'])
      .as('politicasAsistencia.update')
    router
      .delete('/politicas-asistencia/:id', [PoliticasAsistenciaController, 'destroy'])
      .as('politicasAsistencia.destroy')

    router
      .get('/solicitudes-matricula', [SolicitudesMatriculaController, 'index'])
      .as('solicitudesMatricula.index')
    router
      .get('/solicitudes-matricula/:id', [SolicitudesMatriculaController, 'show'])
      .as('solicitudesMatricula.show')
    router
      .post('/solicitudes-matricula/:id/aprobar', [SolicitudesMatriculaController, 'aprobar'])
      .as('solicitudesMatricula.aprobar')
    router
      .post('/solicitudes-matricula/:id/rechazar', [SolicitudesMatriculaController, 'rechazar'])
      .as('solicitudesMatricula.rechazar')

    router
      .get('/notificaciones', [NotificacionesController, 'index'])
      .as('notificaciones.index')
    router
      .post('/notificaciones/:id/leer', [NotificacionesController, 'marcarLeida'])
      .as('notificaciones.leer')
    router
      .post('/notificaciones/leer-todas', [NotificacionesController, 'marcarTodasLeidas'])
      .as('notificaciones.leerTodas')

    router.post('/uploads/voucher', [UploadsController, 'voucher']).as('uploads.voucher')
    router
      .get('/uploads/url-firmada', [UploadsController, 'urlFirmada'])
      .as('uploads.urlFirmada')

    router.get('/configuracion', [ConfiguracionController, 'show']).as('configuracion.show')
    router.put('/configuracion', [ConfiguracionController, 'update']).as('configuracion.update')

    router
      .get('/metodos-pago-imagenes', [MetodosPagoImagenesController, 'index'])
      .as('metodosPagoImagenes.index')
    router
      .post('/metodos-pago-imagenes', [MetodosPagoImagenesController, 'store'])
      .as('metodosPagoImagenes.store')
    router
      .put('/metodos-pago-imagenes/:id', [MetodosPagoImagenesController, 'update'])
      .as('metodosPagoImagenes.update')
    router
      .delete('/metodos-pago-imagenes/:id', [MetodosPagoImagenesController, 'destroy'])
      .as('metodosPagoImagenes.destroy')

    router.get('/turnos', [TurnosController, 'index']).as('turnos.index')
    router.post('/turnos', [TurnosController, 'store']).as('turnos.store')
    router.put('/turnos/:id', [TurnosController, 'update']).as('turnos.update')
    router.delete('/turnos/:id', [TurnosController, 'destroy']).as('turnos.destroy')
  })
  .prefix('/api')
  .use(middleware.auth({ guards: ['api'] }))

// Endpoints SSE de Transmit (notificaciones realtime)
transmit.registerRoutes()

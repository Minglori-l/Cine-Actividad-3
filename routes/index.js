var express = require('express');
var router = express.Router();

const peliculaController = require('../controllers/peliculaController');
const funcionController = require('../controllers/funcionController');
const salaController = require('../controllers/salaController');
const ticketController = require('../controllers/ticketController');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Mi Proyecto de Cine' });
});

// --- RUTAS DE PELÍCULAS ---
router.get('/cartelera', (req, res) => peliculaController.vistaPeliculas(req, res));
router.get('/nueva-pelicula', (req, res) => peliculaController.vistaNuevaPelicula(req, res));
router.post('/agregar-pelicula', (req, res) => peliculaController.agregarDesdeWeb(req, res));
router.get('/pelicula/:id', (req, res) => peliculaController.vistaDetalle(req, res));
router.delete('/pelicula/eliminar/:id', (req, res) => peliculaController.eliminar(req, res)); // OK 

//Añadidas las rutas web para renderizar y procesar la edición por PUT
router.get('/pelicula/editar/:id', (req, res) => peliculaController.vistaEditarPelicula(req, res));
router.put('/pelicula/editar/:id', (req, res) => peliculaController.editar(req, res));

// --- RUTAS DE FUNCIONES ---
router.get('/ver-funciones', (req, res) => funcionController.vistaFunciones(req, res));
router.delete('/funciones/eliminar/:id', (req, res) => funcionController.eliminarFuncion(req, res));

// --- RUTAS DE SALAS ---
router.get('/salas', (req, res) => salaController.vistaSalas(req, res));
router.get('/salas/nueva', (req, res) => salaController.vistaNuevaSala(req, res));
router.post('/salas/nueva', (req, res) => salaController.procesarNuevaSala(req, res));
router.get('/salas/editar/:id', (req, res) => salaController.vistaEditarSala(req, res));
router.post('/salas/editar/:id', (req, res) => salaController.procesarEditarSala(req, res));
router.delete('/salas/eliminar/:id', (req, res) => salaController.procesarEliminarSala(req, res));

// --- RUTAS DE TICKETS ---
router.get('/tickets', (req, res) => ticketController.vistaTickets(req, res));
router.get('/tickets/nuevo', (req, res) => ticketController.vistaNuevoTicket(req, res));
router.post('/tickets/nuevo', (req, res) => ticketController.procesarNuevoTicket(req, res));
router.get('/tickets/editar/:id', (req, res) => ticketController.vistaEditarTicket(req, res));
router.post('/tickets/editar/:id', (req, res) => ticketController.procesarEditarTicket(req, res));
router.delete('/tickets/eliminar/:id', (req, res) => ticketController.procesarEliminarTicket(req, res));

module.exports = router;
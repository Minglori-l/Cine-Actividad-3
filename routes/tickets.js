const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

// RUTAS API
router.get('/api', (req, res) => ticketController.listarTodo(req, res));
router.get('/api/:id', (req, res) => ticketController.buscarPorId(req, res));
router.post('/api', (req, res) => ticketController.crear(req, res));
router.put('/api/:id', (req, res) => ticketController.editar(req, res));
router.delete('/api/:id', (req, res) => ticketController.eliminar(req, res));

// RUTAS WEB
router.get('/', (req, res) => ticketController.vistaTickets(req, res));
router.get('/nuevo', (req, res) => ticketController.vistaNuevoTicket(req, res));
router.post('/nuevo', (req, res) => ticketController.procesarNuevoTicket(req, res));
router.get('/editar/:id', (req, res) => ticketController.vistaEditarTicket(req, res));
router.post('/editar/:id', (req, res) => ticketController.procesarEditarTicket(req, res));
router.delete('/eliminar/:id', (req, res) => ticketController.procesarEliminarTicket(req, res));

module.exports = router;
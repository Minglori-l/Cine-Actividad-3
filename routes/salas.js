const express = require('express');
const router = express.Router();
const salaController = require('../controllers/salaController');

// Rutas para la API de Salas
router.get('/', (req, res) => salaController.listarTodo(req, res));
router.get('/:id', (req, res) => salaController.buscarPorId(req, res));
router.post('/', (req, res) => salaController.crear(req, res));
router.put('/:id', (req, res) => salaController.editar(req, res));
router.delete('/eliminar/:id', (req, res) => salaController.eliminar(req, res));
//correciones
module.exports = router;
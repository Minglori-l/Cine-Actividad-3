const express = require('express');
const router = express.Router();
const peliculaController = require('../controllers/peliculaController');

// --- RUTAS API (Estilo RESTful puro) ---
router.get('/', (req, res) => peliculaController.listarTodo(req, res));
router.get('/:id', (req, res) => peliculaController.buscarPorId(req, res));
router.post('/', (req, res) => peliculaController.agregar(req, res));
router.put('/:id', (req, res) => peliculaController.editar(req, res));
router.delete('/:id', (req, res) => peliculaController.eliminar(req, res));

// --- RUTAS WEB DE EDICIÓN ---
//Añadidas las rutas específicas para renderizar y procesar la edición por PUT
router.get('/editar/:id', (req, res) => peliculaController.vistaEditarPelicula(req, res));
router.put('/editar/:id', (req, res) => peliculaController.editar(req, res));

module.exports = router;
const express = require('express');
const router = express.Router();
const peliculaController = require('../controllers/peliculaController');

// --- 🌐 VISTA WEB HTML (EJS) ---
// La URL completa será: http://localhost:3000/api/peliculas/cartelera
router.get('/cartelera', (req, res) => peliculaController.vistaPeliculas(req, res));
router.get('/editar/:id', (req, res) => peliculaController.vistaEditarPelicula(req, res));

// --- RUTAS API (Estilo RESTful puro) ---
router.get('/', (req, res) => peliculaController.listarTodo(req, res));
router.get('/:id', (req, res) => peliculaController.buscarPorId(req, res));
router.post('/', (req, res) => peliculaController.agregar(req, res));
router.put('/:id', (req, res) => peliculaController.editar(req, res));
router.delete('/:id', (req, res) => peliculaController.eliminar(req, res));

// --- RUTAS WEB DE EDICIÓN ---
router.get('/editar/:id', (req, res) => peliculaController.vistaEditarPelicula(req, res));

// ✅ CAMBIO REALIZADO: 'put' cambiado a 'post' para recibir el envío del formulario HTML
router.post('/editar/:id', (req, res) => peliculaController.editar(req, res));

module.exports = router;
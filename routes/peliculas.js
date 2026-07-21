const express = require('express');
const router = express.Router();
const peliculaController = require('../controllers/peliculaController');

// 1. Importación con destructuración {} y la ruta exacta a tu middleware
const { verificarAcceso } = require('../middlewares/auth'); // O '../middleware/auth' según el nombre de tu carpeta

// 2. VISTAS EJS (Pasamos los roles permitidos o un array con todos si ambos pueden verla)
router.get('/cartelera', verificarAcceso(['Administrador', 'admin', 'Empleado', 'empleado']), (req, res) => peliculaController.vistaPeliculas(req, res));
router.get('/editar/:id', verificarAcceso(['Administrador', 'admin']), (req, res) => peliculaController.vistaEditarPelicula(req, res));

// --- RUTAS API ---
router.get('/', (req, res) => peliculaController.listarTodo(req, res));
router.get('/:id', (req, res) => peliculaController.buscarPorId(req, res));
router.post('/', verificarAcceso(['Administrador', 'admin']), (req, res) => peliculaController.agregar(req, res));
router.put('/:id', verificarAcceso(['Administrador', 'admin']), (req, res) => peliculaController.editar(req, res));
router.delete('/:id', verificarAcceso(['Administrador', 'admin']), (req, res) => peliculaController.eliminar(req, res));

// --- RUTA POST DE EDICIÓN (FORMULARIO HTML) ---
router.post('/editar/:id', verificarAcceso(['Administrador', 'admin']), (req, res) => peliculaController.editar(req, res));

module.exports = router;
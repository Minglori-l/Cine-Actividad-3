const express = require('express');
const router = express.Router();
const dulceController = require('../controllers/dulceController');

//IMPORTANTE: Importamos el middleware de autenticación
const { verificarAcceso } = require('../middlewares/auth');

// Vista Web (EJS)
router.get('/catalogo', (req, res) => dulceController.vistaDulces(req, res));

// Rutas API / Formulario
router.get('/', (req, res) => dulceController.listarTodo(req, res));
router.post('/', (req, res) => dulceController.agregar(req, res));
router.post('/editar/:id', (req, res) => dulceController.editar(req, res));
router.put('/:id', (req, res) => dulceController.editar(req, res));

// Solo Administrador puede eliminar productos de la dulcería
router.delete('/:id', verificarAcceso(['Administrador']), (req, res) => dulceController.eliminar(req, res));

module.exports = router;
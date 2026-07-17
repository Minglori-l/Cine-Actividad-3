const express = require('express');
const router = express.Router();
const funcionController = require('../controllers/funcionController');

// Rutas Web
router.get('/', (req, res) => funcionController.vistaFunciones(req, res));

// Rutas API
router.get('/api/ultimas', (req, res) => funcionController.ultimasCinco(req, res));
router.get('/api/fechas', (req, res) => funcionController.filtrarPorFecha(req, res));
router.put('/api/:id/desvincular', (req, res) => funcionController.desvincularPelicula(req, res));
router.get('/nueva', (req, res) => funcionController.vistaNuevaFuncion(req, res));
router.post('/nueva', (req, res) => funcionController.procesarNuevaFuncion(req, res));
router.get('/editar/:id', (req, res) => funcionController.vistaEditarFuncion(req, res));
router.post('/editar/:id', (req, res) => funcionController.procesarEditarFuncion(req, res));

module.exports = router;

router.get('/prueba', (req, res) => {
    res.send("¡El router de funciones está funcionando!");
});
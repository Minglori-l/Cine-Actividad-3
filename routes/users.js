const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 🔒 Middleware de protección exclusivo para el backend (Optimizado con req.user)
function esAdmin(req, res, next) {
    // 1. Si el middleware global de app.js no encontró un usuario válido
    if (!req.user) {
        if (req.xhr || req.headers['accept']?.includes('json') || req.headers['content-type'] === 'application/json') {
            return res.status(401).json({ error: 'No autorizado: Sesión no encontrada.' });
        }
        return res.redirect('/users/login');
    }

    // 2. Si el usuario existe pero NO es Administrador
    if (req.user.rol !== 'Administrador') {
        if (req.xhr || req.headers['accept']?.includes('json') || req.headers['content-type'] === 'application/json') {
            return res.status(403).json({ error: 'No autorizado: Privilegios insuficientes.' });
        }
        return res.redirect('/');
    }

    // 3. Si todo está en orden, pasamos al controlador
    return next();
}

// 🔑 Rutas para el login
router.get('/login', userController.getLogin);
router.post('/login', userController.login);

// 📝 Rutas para el Registro
router.get('/registro', userController.getRegistro);
router.post('/registro', userController.registro);

// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
    // Borra la cookie donde guardas el token JWT
    res.clearCookie('token'); 
    // Redirige al inicio público
    res.redirect('/'); 
});

// 👥 Gestión de Usuarios (Protegidas con el candado 'esAdmin' optimizado)
router.get('/', esAdmin, userController.listarUsuarios);
router.post('/actualizar-rol', esAdmin, userController.actualizarRol);

module.exports = router;
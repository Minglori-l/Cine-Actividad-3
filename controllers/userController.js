// 📦 Importamos la conexión a la base de datos (Ajusta la ruta según tu carpeta, ej: '../config/db')
const db = require('../config/db'); 
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userController = {
    // 🚪 Mostrar la pantalla de Login
    getLogin(req, res) {
        res.render('login', { error: null });
    },

    // 🔑 Procesar el formulario de Login
    async login(req, res) {
        const { username, password } = req.body;

        // 🔥 NUEVO: Validación de datos obligatorios requerida por la rúbrica
        if (!username || !password || username.trim() === '' || password.trim() === '') {
            return res.render('login', { error: 'Por favor, ingrese tanto el usuario como la contraseña.' });
        }

        try {
            // 1. Buscar si el usuario existe
            const user = await Usuario.findByUsername(username);
            if (!user) {
                return res.render('login', { error: 'Usuario o contraseña incorrectos.' });
            }

            // 2. Verificar si la contraseña coincide usando bcrypt
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.render('login', { error: 'Usuario o contraseña incorrectos.' });
            }

            // 3. Si todo está bien, creamos el Token de sesión (JWT)
            const token = jwt.sign(
                { id: user.id, username: user.username, rol: user.rol },
                process.env.JWT_SECRET,
                { expiresIn: '2h' }
            );

            // 4. Guardamos el Token en una cookie segura del navegador
            res.cookie('token', token, {
                httpOnly: true,
                secure: false, // Cambiar a true en producción con HTTPS
                maxAge: 2 * 60 * 60 * 1000
            });

            // 5. Redireccionamos a la página de inicio
            res.redirect('/');

        } catch (error) {
            console.error('Error en el login:', error);
            res.render('login', { error: 'Ocurrió un error inesperado en el servidor.' });
        }
    },

    // 📝 Mostrar la pantalla de Registro
    getRegistro(req, res) {
        res.render('registro', { error: null, success: null });
    },

    // 💾 Procesar el formulario de Registro
    async registro(req, res) {
        const { username, password, rol } = req.body;

        // 🔥 NUEVO: Validación de datos obligatorios requerida por la rúbrica
        if (!username || !password || !rol || username.trim() === '' || password.trim() === '') {
            return res.render('registro', { error: 'Todos los campos son obligatorios (Usuario, Contraseña y Rol).', success: null });
        }

        try {
            // 1. Verificar si el usuario ya está registrado
            const existingUser = await Usuario.findByUsername(username);
            if (existingUser) {
                return res.render('registro', { error: 'El nombre de usuario ya está en uso.', success: null });
            }

            // 2. Encriptar la contraseña del nuevo usuario
            const hashedPassword = await bcrypt.hash(password, 10);

            // 3. Guardar en la Base de Datos
            await Usuario.create(username, hashedPassword, rol);

            res.render('registro', { error: null, success: '¡Usuario registrado con éxito! Ya puedes iniciar sesión.' });

        } catch (error) {
            console.error('Error en el registro:', error);
            res.render('registro', { error: 'No se pudo registrar el usuario.', success: null });
        }
    },

    // 🔒 Cerrar sesión (borrar la cookie)
    logout(req, res) {
        res.clearCookie('token');
        res.redirect('/users/login');
    },

    // 👥 Muestra la tabla de gestión de usuarios (Solo Admin)
    async listarUsuarios(req, res) {
        try {
            const query = 'SELECT id, username, rol FROM usuarios ORDER BY id ASC';
            
            // 🛠️ Usamos await y destructuramos [resultados] para obtener las filas de la promesa
            const [resultados] = await db.query(query);
            
            res.render('usuarios', { 
                usuarios: resultados, 
                user: req.user 
            });
        } catch (error) {
            console.error('Error al traer usuarios:', error);
            return res.status(500).send('Error interno del servidor');
        }
    },

    // 🔄 Procesa el cambio de rol vía AJAX/Fetch (Solo Admin)
    async actualizarRol(req, res) {
        const { id, rol } = req.body;
        const adminId = req.user.id; 

        // Regla de seguridad extra: El administrador no puede degradarse a sí mismo
        if (parseInt(id) === parseInt(adminId)) {
            return res.status(400).json({ error: 'Operación denegada: No puedes modificar tu propio rango de Administrador.' });
        }

        // Validamos que el rol enviado sea válido
        const rolesValidos = ['Cliente', 'Empleado', 'Administrador'];
        if (!rolesValidos.includes(rol)) {
            return res.status(400).json({ error: 'El rol especificado no es válido.' });
        }

        try {
            const query = 'UPDATE usuarios SET rol = ? WHERE id = ?';
            
            // 🛠️ Ejecución asíncrona basada en Promesas sin callbacks
            await db.query(query, [rol, id]);

            res.json({ success: true, message: 'Rol escalado correctamente.' });
        } catch (error) {
            console.error('Error al actualizar rol:', error);
            return res.status(500).json({ error: 'Error al actualizar en la base de datos.' });
        }
    }
};

module.exports = userController;
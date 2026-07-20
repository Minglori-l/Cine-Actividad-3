const Sala = require('../models/Sala');

class SalaController {
    // ==========================================
    // RUTAS API (Devuelven JSON para el Fetch)
    // ==========================================

    async listarTodo(req, res) {
        try {
            const salas = await Sala.obtenerTodas();
            res.json(salas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async buscarPorId(req, res) {
        try {
            const sala = await Sala.obtenerPorId(req.params.id);
            if (sala.length === 0) return res.status(404).json({ mensaje: 'Sala no encontrada' });
            res.json(sala[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async crear(req, res) {
        try {
            const { nombre, capacidad, tipo_pantalla } = req.body;

            // 🚨 VALIDACIÓN: Campos obligatorios y tipo de dato
            if (!nombre || !capacidad || !tipo_pantalla || nombre.trim() === '' || tipo_pantalla.trim() === '') {
                return res.status(400).json({ error: "Todos los campos (nombre, capacidad, tipo_pantalla) son obligatorios." });
            }

            if (isNaN(capacidad)) {
                return res.status(400).json({ error: "La capacidad de la sala debe ser un valor numérico válido." });
            }

            const result = await Sala.crear(nombre, capacidad, tipo_pantalla);
            res.status(201).json({ id: result.insertId, nombre, capacidad, tipo_pantalla });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async editar(req, res) {
        try {
            const { nombre, capacidad, tipo_pantalla } = req.body;

            // 🚨 VALIDACIÓN: Campos obligatorios en edición
            if (!nombre || !capacidad || !tipo_pantalla || nombre.trim() === '' || tipo_pantalla.trim() === '') {
                return res.status(400).json({ error: "No se puede editar: Todos los campos son obligatorios y no pueden estar vacíos." });
            }

            if (isNaN(capacidad)) {
                return res.status(400).json({ error: "La capacidad editada debe ser un número válido." });
            }

            const result = await Sala.actualizar(req.params.id, nombre, capacidad, tipo_pantalla);
            if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Sala no encontrada' });
            res.json({ mensaje: 'Sala actualizada exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async eliminar(req, res) {
        try {
            const result = await Sala.eliminarForzado(req.params.id);
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Sala no encontrada' });
            }
            res.json({ success: true, mensaje: 'Sala eliminada a la fuerza' });
        } catch (error) {
            console.error("Error al forzar eliminación:", error);
            res.status(500).json({ error: 'Error interno del servidor al intentar forzar el borrado.' });
        }
    }

    // ==========================================
    // RUTAS DE VISTAS (Para el navegador y EJS)
    // ==========================================

    async vistaSalas(req, res) {
        try {
            const salas = await Sala.obtenerTodas();
            res.render('salas', { salas });
        } catch (error) {
            res.send("Error al cargar las salas.");
        }
    }

    vistaNuevaSala(req, res) {
        res.render('nueva-sala');
    }

    async procesarNuevaSala(req, res) {
        try {
            const { nombre, capacidad, tipo_pantalla } = req.body;

            // 🚨 VALIDACIÓN: Formulario Web
            if (!nombre || !capacidad || !tipo_pantalla || nombre.trim() === '' || tipo_pantalla.trim() === '') {
                return res.send("Error: Todos los campos son obligatorios para crear la sala. Por favor regresa.");
            }

            if (isNaN(capacidad)) {
                return res.send("Error: La capacidad debe ser obligatoriamente un número.");
            }

            await Sala.crear(nombre, capacidad, tipo_pantalla);
            res.redirect('/salas');
        } catch (error) {
            res.send("Error al crear la sala.");
        }
    }

    async vistaEditarSala(req, res) {
        try {
            const sala = await Sala.obtenerPorId(req.params.id);
            if (sala.length === 0) return res.send("Sala no encontrada.");
            res.render('editar-sala', { sala: sala[0] });
        } catch (error) {
            res.send("Error al cargar la sala.");
        }
    }

    async procesarEditarSala(req, res) {
        try {
            const { nombre, capacidad, tipo_pantalla } = req.body;

            // 🚨 VALIDACIÓN: Formulario de edición Web
            if (!nombre || !capacidad || !tipo_pantalla || nombre.trim() === '' || tipo_pantalla.trim() === '') {
                return res.send("Error: No se pueden guardar cambios vacíos. Todos los campos son obligatorios.");
            }

            if (isNaN(capacidad)) {
                return res.send("Error: La capacidad modificada debe ser numérica.");
            }

            await Sala.actualizar(req.params.id, nombre, capacidad, tipo_pantalla);
            res.redirect('/salas');
        } catch (error) {
            res.redirect('/salas');
        }
    }

    async procesarEliminarSala(req, res) {
        try {
            await Sala.eliminarNormal(req.params.id);
            res.redirect('/salas');
        } catch (error) {
            res.send("Error al eliminar la sala.");
        }
    }
}

module.exports = new SalaController();
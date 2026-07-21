const Pelicula = require('../models/Pelicula');

class PeliculaController {
    
    // ==========================================
    // RUTAS API (Devuelven JSON o Redirigen según origen)
    // ==========================================

    async listarTodo(req, res) {
        try {
            const peliculas = await Pelicula.obtenerTodas();
            res.json(peliculas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async buscarPorId(req, res) {
        try {
            const rows = await Pelicula.obtenerPorId(req.params.id);
            if (rows.length === 0) return res.status(404).json({ mensaje: "Película no encontrada" });
            res.json(rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async agregar(req, res) {
        try {
            const { titulo, director, anio } = req.body;

            // 🚨 VALIDACIÓN: Verificar campos obligatorios y formato básico
            if (!titulo || !director || !anio || titulo.trim() === '' || director.trim() === '') {
                return res.status(400).json({ error: "Todos los campos (titulo, director, anio) son obligatorios y no pueden estar vacíos." });
            }

            if (isNaN(anio)) {
                return res.status(400).json({ error: "El año debe ser un número válido." });
            }

            const result = await Pelicula.crear(titulo, director, anio);

            // 🌟 DETECTAR ORIGEN: Si viene del formulario HTML del navegador
            if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
                return res.redirect('/api/peliculas/cartelera');
            }

            // Si viene de Postman, un cliente externo o fetch de JS, responde JSON
            res.status(201).json({ mensaje: "Película agregada", id: result.insertId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async editar(req, res) {
        try {
            const { titulo, director, anio } = req.body;

            // 🚨 VALIDACIÓN: Verificar campos obligatorios en la edición
            if (!titulo || !director || !anio || titulo.trim() === '' || director.trim() === '') {
                return res.status(400).json({ error: "No se puede actualizar: Todos los campos son obligatorios." });
            }

            if (isNaN(anio)) {
                return res.status(400).json({ error: "El año de edición debe ser un número válido." });
            }

            const result = await Pelicula.actualizar(req.params.id, titulo, director, anio);
            if (result.affectedRows === 0) return res.status(404).json({ mensaje: "No encontrada" });

            // 🌟 DETECTAR ORIGEN: Si viene del formulario HTML del navegador, redirige a la vista gráfica
            if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
                return res.redirect('/api/peliculas/cartelera');
            }

            // Si viene de Postman o un fetch de JS, responde JSON
            res.json({ mensaje: "Actualizada con éxito" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async eliminar(req, res) {
        try {
            const result = await Pelicula.eliminar(req.params.id);
            if (result.affectedRows === 0) return res.status(404).json({ mensaje: "No encontrada" });
            res.json({ mensaje: "Eliminada correctamente" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // ==========================================
    // RUTAS DE VISTAS (Para el navegador con EJS)
    // ==========================================

    async vistaPeliculas(req, res) {
        try {
            const peliculas = await Pelicula.obtenerTodas();
            
            // 🔑 Extraemos el usuario desde req.user (proporcionado por JWT) o res.locals.user
            const user = req.user || res.locals.user || null;

            res.render('peliculas', { titulo: 'Cartelera de Cine', peliculas, user });
        } catch (error) {
            res.send("Error al cargar la cartelera");
        }
    }

    async agregarDesdeWeb(req, res) {
        try {
            const { titulo, director, anio } = req.body;

            // 🚨 VALIDACIÓN: Para el formulario Web
            if (!titulo || !director || !anio || titulo.trim() === '' || director.trim() === '') {
                return res.send("Error: Todos los campos son obligatorios para registrar la película. Por favor regresa e intenta de nuevo.");
            }

            if (isNaN(anio)) {
                return res.send("Error: El año debe ser un valor numérico.");
            }

            await Pelicula.crear(titulo, director, anio);
            res.redirect('/api/peliculas/cartelera');
        } catch (error) {
            res.send("Error al guardar");
        }
    }

    async vistaDetalle(req, res) {
        try {
            const rows = await Pelicula.obtenerPorId(req.params.id);
            if (rows.length === 0) return res.send("No encontrada");

            // 🔑 Extraemos el usuario desde req.user / res.locals.user
            const user = req.user || res.locals.user || null;

            res.render('detalle-pelicula', { pelicula: rows[0], user });
        } catch (error) {
            res.send("Error");
        }
    }

    vistaNuevaPelicula(req, res) {
        const user = req.user || res.locals.user || null;
        res.render('nueva-pelicula', { user });
    }

    async vistaEditarPelicula(req, res) {
        try {
            const rows = await Pelicula.obtenerPorId(req.params.id);
            if (rows.length === 0) return res.send("Película no encontrada");

            const user = req.user || res.locals.user || null;

            res.render('editar-pelicula', { pelicula: rows[0], user });
        } catch (error) {
            res.send("Error al cargar el formulario de edición");
        }
    }
}

module.exports = new PeliculaController();
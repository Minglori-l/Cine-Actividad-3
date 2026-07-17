const Pelicula = require('../models/Pelicula');

class PeliculaController {
    
    // ==========================================
    // RUTAS API (Devuelven JSON)
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
            const result = await Pelicula.crear(titulo, director, anio);
            res.status(201).json({ mensaje: "Película agregada", id: result.insertId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async editar(req, res) {
        try {
            const { titulo, director, anio } = req.body;
            const result = await Pelicula.actualizar(req.params.id, titulo, director, anio);
            if (result.affectedRows === 0) return res.status(404).json({ mensaje: "No encontrada" });
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
    // RUTAS DE VISTAS (Para el navegador)
    // ==========================================

    async vistaPeliculas(req, res) {
        try {
            const peliculas = await Pelicula.obtenerTodas();
            res.render('peliculas', { titulo: 'Cartelera de Cine', peliculas });
        } catch (error) {
            res.send("Error al cargar la cartelera");
        }
    }

    async agregarDesdeWeb(req, res) {
        try {
            const { titulo, director, anio } = req.body;
            await Pelicula.crear(titulo, director, anio);
            res.redirect('/cartelera');
        } catch (error) {
            res.send("Error al guardar");
        }
    }

    async vistaDetalle(req, res) {
        try {
            const rows = await Pelicula.obtenerPorId(req.params.id);
            if (rows.length === 0) return res.send("No encontrada");
            res.render('detalle-pelicula', { pelicula: rows[0] });
        } catch (error) {
            res.send("Error");
        }
    }

    vistaNuevaPelicula(req, res) {
        res.render('nueva-pelicula');
    }

    async vistaEditarPelicula(req, res) {
        try {
            const rows = await Pelicula.obtenerPorId(req.params.id);
            if (rows.length === 0) return res.send("Película no encontrada");
            res.render('editar-pelicula', { pelicula: rows[0] });
        } catch (error) {
            res.send("Error al cargar el formulario de edición");
        }
    }
}

module.exports = new PeliculaController();
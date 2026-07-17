const Funcion = require('../models/Funcion');
const Pelicula = require('../models/Pelicula');
const Sala = require('../models/Sala');

class FuncionController {

    // ==========================================
    // RUTAS DE VISTAS (Para el navegador)
    // ==========================================

    async vistaFunciones(req, res) {
        try {
            const funciones = await Funcion.obtenerConNombres();
            res.render('funciones', { funciones });
        } catch (error) {
            res.status(500).send("Error al cargar funciones.");
        }
    }

    async vistaNuevaFuncion(req, res) {
        try {
            const peliculas = await Pelicula.obtenerTodas();
            const salas = await Sala.obtenerTodas();
            res.render('nueva-funcion', { peliculas, salas });
        } catch (error) {
            res.send("Error al cargar formulario");
        }
    }

    async procesarNuevaFuncion(req, res) {
        try {
            const { pelicula_id, sala_id, fecha } = req.body;
            await Funcion.crear(pelicula_id, sala_id, fecha);
            res.redirect('/funciones');
        } catch (error) {
            res.send("Error al crear función");
        }
    }

    async vistaEditarFuncion(req, res) {
        try {
            const funcionRows = await Funcion.obtenerPorId(req.params.id);
            const peliculas = await Pelicula.obtenerTodas();
            const salas = await Sala.obtenerTodas();
            res.render('editar-funcion', { funcion: funcionRows[0], peliculas, salas });
        } catch (error) {
            res.send("Error al cargar edición");
        }
    }

    async procesarEditarFuncion(req, res) {
        try {
            const { pelicula_id, sala_id, fecha } = req.body;
            await Funcion.actualizar(req.params.id, pelicula_id, sala_id, fecha);
            res.redirect('/funciones');
        } catch (error) {
            res.send("Error al actualizar");
        }
    }

    // ==========================================
    // RUTAS API (Devuelven JSON)
    // ==========================================

    async ultimasCinco(req, res) {
        try {
            const funciones = await Funcion.obtenerUltimasCinco();
            res.json(funciones);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async filtrarPorFecha(req, res) {
        try {
            const { inicio, fin } = req.query;
            const funciones = await Funcion.filtrarPorFecha(inicio, fin);
            res.json(funciones);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    
    async desvincularPelicula(req, res) {
        try {
            const result = await Funcion.desvincularPelicula(req.params.id);
            if (result.affectedRows === 0) return res.status(404).json({ mensaje: "Función no encontrada" });
            res.json({ mensaje: "Relación eliminada exitosamente." });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async eliminarFuncion(req, res) {
        try {
            await Funcion.eliminar(req.params.id);
            return res.status(200).json({ 
                success: true, 
                message: 'Función eliminada correctamente' 
            });
        } catch (error) {
            console.error('Error al eliminar la función:', error);
            return res.status(500).json({ 
                success: false, 
                message: 'Error interno del servidor al eliminar la función' 
            });
        }
    }
}

module.exports = new FuncionController();
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

            // 🚨 VALIDACIÓN: Datos obligatorios y formatos numéricos
            if (!pelicula_id || !sala_id || !fecha || fecha.trim() === '') {
                return res.send("Error: Todos los campos (Película, Sala y Fecha/Hora) son totalmente obligatorios.");
            }

            if (isNaN(pelicula_id) || isNaN(sala_id)) {
                return res.send("Error: Los identificadores de Película y Sala deben ser valores numéricos válidos.");
            }

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

            // 🚨 VALIDACIÓN: Datos obligatorios en la edición
            if (!pelicula_id || !sala_id || !fecha || fecha.trim() === '') {
                return res.send("Error: No se puede actualizar. Todos los campos son obligatorios.");
            }

            if (isNaN(pelicula_id) || isNaN(sala_id)) {
                return res.send("Error: Los IDs de película y sala deben ser numéricos.");
            }

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

            // 🚨 VALIDACIÓN: Verificar parámetros de consulta (Query Params) obligatorios
            if (!inicio || !fin || inicio.trim() === '' || fin.trim() === '') {
                return res.status(400).json({ error: "Faltan parámetros obligatorios. Debe especificar la fecha de 'inicio' y de 'fin' en la URL." });
            }

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
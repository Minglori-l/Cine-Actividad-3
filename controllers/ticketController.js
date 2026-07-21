const Ticket = require('../models/Ticket');

class TicketController {
    // ==========================================
    // RUTAS API (Devuelven JSON)
    // ==========================================

    async listarTodo(req, res) {
        try {
            const tickets = await Ticket.obtenerTodosAPI();
            res.json(tickets);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async buscarPorId(req, res) {
        try {
            const ticket = await Ticket.obtenerPorId(req.params.id);
            if (ticket.length === 0) return res.status(404).json({ mensaje: 'Ticket no encontrado' });
            res.json(ticket[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async crear(req, res) {
        try {
            const { funcion_id, asiento, precio } = req.body;

            // 🚨 VALIDACIÓN: Campos obligatorios y tipos de datos correctos
            if (!funcion_id || !asiento || !precio || asiento.trim() === '') {
                return res.status(400).json({ error: "Todos los campos (funcion_id, asiento, precio) son obligatorios." });
            }

            if (isNaN(funcion_id) || isNaN(precio)) {
                return res.status(400).json({ error: "El ID de la función y el precio deben ser valores numéricos válidos." });
            }

            const result = await Ticket.crear(funcion_id, asiento, precio);
            res.status(201).json({ id: result.insertId, funcion_id, asiento, precio });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async editar(req, res) {
        try {
            const { funcion_id, asiento, precio } = req.body;

            // 🚨 VALIDACIÓN: Campos obligatorios en edición
            if (!funcion_id || !asiento || !precio || asiento.trim() === '') {
                return res.status(400).json({ error: "No se puede editar: Todos los campos son requeridos y no pueden estar vacíos." });
            }

            if (isNaN(funcion_id) || isNaN(precio)) {
                return res.status(400).json({ error: "El ID de la función y el precio modificado deben ser números." });
            }

            const result = await Ticket.actualizar(req.params.id, funcion_id, asiento, precio);
            if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Ticket no encontrado' });
            res.json({ mensaje: 'Ticket actualizado exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async eliminar(req, res) {
        try {
            const result = await Ticket.eliminar(req.params.id);
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Ticket no encontrado' });
            }
            res.json({ success: true, mensaje: 'Ticket eliminado exitosamente' });
        } catch (error) {
            console.error("Error al eliminar ticket:", error);
            res.status(500).json({ error: 'Error interno del servidor al intentar borrar el ticket.' });
        }
    }
    
    // ==========================================
    // RUTAS DE VISTAS (Para el navegador)
    // ==========================================

    async vistaTickets(req, res) {
        try {
            const tickets = await Ticket.obtenerTodosConDetalles();
            res.render('tickets', { tickets });
        } catch (error) {
            console.error("❌ Error en vistaTickets:", error);
            res.send("Error al cargar los tickets: " + error.message);
        }
    }

    async vistaNuevoTicket(req, res) {
        try {
            const funciones = await Ticket.obtenerFuncionesParaFormulario();
            res.render('nuevo-ticket', { funciones });
        } catch (error) {
            console.error("❌ Error en vistaNuevoTicket:", error);
            res.send("Error al cargar el formulario: " + error.message);
        }
    }

    async procesarNuevoTicket(req, res) {
        try {
            const { funcion_id, asiento, precio } = req.body;

            // 🚨 VALIDACIÓN: Formulario Web
            if (!funcion_id || !asiento || !precio || asiento.trim() === '') {
                return res.send("Error: Todos los campos del ticket son obligatorios. Por favor regresa.");
            }

            if (isNaN(funcion_id) || isNaN(precio)) {
                return res.send("Error: Datos corruptos. La función y el precio deben ser numéricos.");
            }

            await Ticket.crear(funcion_id, asiento, precio);
            res.redirect('/tickets');
        } catch (error) {
            console.error("❌ Error detallado en la Base de Datos (Crear Ticket):", error);
            res.send("Error al crear el ticket: " + error.message); // 🌟 Ahora te dirá el motivo exacto en pantalla
        }
    }

    async vistaEditarTicket(req, res) {
        try {
            const ticket = await Ticket.obtenerPorId(req.params.id);
            const funciones = await Ticket.obtenerFuncionesParaFormulario();
            
            if (ticket.length === 0) return res.send("Ticket no encontrado.");
            res.render('editar-ticket', { ticket: ticket[0], funciones });
        } catch (error) {
            console.error("❌ Error en vistaEditarTicket:", error);
            res.send("Error al cargar el ticket para editar: " + error.message);
        }
    }

    async procesarEditarTicket(req, res) {
        try {
            const { funcion_id, asiento, precio } = req.body;

            // 🚨 VALIDACIÓN: Formulario Web de edición
            if (!funcion_id || !asiento || !precio || asiento.trim() === '') {
                return res.send("Error: No puedes dejar campos vacíos al modificar el boleto.");
            }

            if (isNaN(funcion_id) || isNaN(precio)) {
                return res.send("Error: El precio y el ID de función deben ser estrictamente numéricos.");
            }

            await Ticket.actualizar(req.params.id, funcion_id, asiento, precio);
            res.redirect('/tickets');
        } catch (error) {
            console.error("❌ Error detallado en la Base de Datos (Editar Ticket):", error);
            res.send("Error al actualizar el ticket: " + error.message);
        }
    }

    async procesarEliminarTicket(req, res) {
        try {
            await Ticket.eliminar(req.params.id);
            return res.json({ success: true, message: 'Ticket eliminado correctamente' });
        } catch (error) {
            console.error("❌ Error en procesarEliminarTicket:", error);
            res.send("Error al eliminar el ticket: " + error.message);
        }
    }
}

module.exports = new TicketController();
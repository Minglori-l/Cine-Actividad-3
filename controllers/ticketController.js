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
            const result = await Ticket.crear(funcion_id, asiento, precio);
            res.status(201).json({ id: result.insertId, funcion_id, asiento, precio });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async editar(req, res) {
        try {
            const { funcion_id, asiento, precio } = req.body;
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
            res.send("Error al cargar los tickets.");
        }
    }

    async vistaNuevoTicket(req, res) {
        try {
            const funciones = await Ticket.obtenerFuncionesParaFormulario();
            res.render('nuevo-ticket', { funciones });
        } catch (error) {
            res.send("Error al cargar el formulario.");
        }
    }

    async procesarNuevoTicket(req, res) {
        try {
            const { funcion_id, asiento, precio } = req.body;
            await Ticket.crear(funcion_id, asiento, precio);
            res.redirect('/tickets');
        } catch (error) {
            res.send("Error al crear el ticket.");
        }
    }

    async vistaEditarTicket(req, res) {
        try {
            const ticket = await Ticket.obtenerPorId(req.params.id);
            const funciones = await Ticket.obtenerFuncionesParaFormulario();
            
            if (ticket.length === 0) return res.send("Ticket no encontrado.");
            res.render('editar-ticket', { ticket: ticket[0], funciones });
        } catch (error) {
            res.send("Error al cargar el ticket para editar.");
        }
    }

    async procesarEditarTicket(req, res) {
        try {
            const { funcion_id, asiento, precio } = req.body;
            await Ticket.actualizar(req.params.id, funcion_id, asiento, precio);
            res.redirect('/tickets');
        } catch (error) {
            res.send("Error al actualizar el ticket.");
        }
    }

    async procesarEliminarTicket(req, res) {
        try {
            await Ticket.eliminar(req.params.id);
            res.redirect('/tickets');
        } catch (error) {
            res.send("Error al eliminar el ticket.");
        }
    }
}

module.exports = new TicketController();
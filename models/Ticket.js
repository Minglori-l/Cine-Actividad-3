const pool = require('../config/db');

class Ticket {
    // Obtener todos los tickets para las respuestas JSON de la API
    static async obtenerTodosAPI() {
        const query = `
            SELECT t.id, t.asiento, t.precio, f.fecha, f.sala_id, f.pelicula_id 
            FROM tickets t
            JOIN funciones f ON t.funcion_id = f.id
        `;
        const [tickets] = await pool.query(query);
        return tickets;
    }

    // Obtener todos los tickets con los nombres de las salas para la vista EJS
    static async obtenerTodosConDetalles() {
        const query = `
            SELECT t.id, t.asiento, t.precio, f.fecha, s.nombre AS sala_nombre
            FROM tickets t
            JOIN funciones f ON t.funcion_id = f.id
            JOIN salas s ON f.sala_id = s.id
        `;
        const [tickets] = await pool.query(query);
        return tickets;
    }

    // Buscar un ticket específico por su ID
    static async obtenerPorId(id) {
        const [ticket] = await pool.query('SELECT * FROM tickets WHERE id = ?', [id]);
        return ticket;
    }

    // Registrar un nuevo ticket
    static async crear(funcion_id, asiento, precio) {
        const [result] = await pool.query(
            'INSERT INTO tickets (funcion_id, asiento, precio) VALUES (?, ?, ?)',
            [funcion_id, asiento, precio]
        );
        return result;
    }

    // Modificar un ticket existente
    static async actualizar(id, funcion_id, asiento, precio) {
        const [result] = await pool.query(
            'UPDATE tickets SET funcion_id = ?, asiento = ?, precio = ? WHERE id = ?',
            [funcion_id, asiento, precio, id]
        );
        return result;
    }

    // Eliminar un ticket de la base de datos
    static async eliminar(id) {
        const [result] = await pool.query('DELETE FROM tickets WHERE id = ?', [id]);
        return result;
    }

    // Auxiliar: Obtener el listado de funciones para los desplegables (<select>) de los formularios
    static async obtenerFuncionesParaFormulario() {
        const [funciones] = await pool.query(
            'SELECT f.id, f.fecha, s.nombre AS sala_nombre FROM funciones f JOIN salas s ON f.sala_id = s.id'
        );
        return funciones;
    }
}

module.exports = Ticket;
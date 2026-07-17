const pool = require('../config/db');

class Funcion {
    
    // Obtener funciones con JOIN para mostrar los nombres en la tabla
    static async obtenerConNombres() {
        const query = `
            SELECT f.id, p.titulo, s.nombre AS sala_nombre, f.fecha 
            FROM funciones f 
            LEFT JOIN peliculas p ON f.pelicula_id = p.id
            JOIN salas s ON f.sala_id = s.id
        `;
        const [funciones] = await pool.query(query);
        return funciones;
    }

    // Obtener las últimas 5 funciones
    static async obtenerUltimasCinco() {
        const [funciones] = await pool.query('SELECT * FROM funciones ORDER BY fecha DESC LIMIT 5');
        return funciones;
    }

    // Filtrar funciones por un rango de fechas
    static async filtrarPorFecha(inicio, fin) {
        const [funciones] = await pool.query(
            'SELECT * FROM funciones WHERE fecha BETWEEN ? AND ?', 
            [inicio, fin]
        );
        return funciones;
    }

    // Obtener una función específica por su ID
    static async obtenerPorId(id) {
        const [funcion] = await pool.query('SELECT * FROM funciones WHERE id = ?', [id]);
        return funcion;
    }

    // Crear una nueva función
    static async crear(pelicula_id, sala_id, fecha) {
        const [result] = await pool.query(
            'INSERT INTO funciones (pelicula_id, sala_id, fecha) VALUES (?, ?, ?)', 
            [pelicula_id, sala_id, fecha]
        );
        return result;
    }

    // Editar una función existente
    static async actualizar(id, pelicula_id, sala_id, fecha) {
        const [result] = await pool.query(
            'UPDATE funciones SET pelicula_id = ?, sala_id = ?, fecha = ? WHERE id = ?', 
            [pelicula_id, sala_id, fecha, id]
        );
        return result;
    }

    // Eliminar una función
    static async eliminar(id) {
        const [result] = await pool.query('DELETE FROM funciones WHERE id = ?', [id]);
        return result;
    }

    // Desvincular película (poner en NULL)
    static async desvincularPelicula(id) {
        const [result] = await pool.query('UPDATE funciones SET pelicula_id = NULL WHERE id = ?', [id]);
        return result;
    }
}

module.exports = Funcion;
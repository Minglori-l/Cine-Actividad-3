const pool = require('../config/db');

class Pelicula {
    // Obtener todas las películas
    static async obtenerTodas() {
        const [peliculas] = await pool.query('SELECT * FROM peliculas');
        return peliculas;
    }

    // Obtener una película por su ID
    static async obtenerPorId(id) {
        const [rows] = await pool.query('SELECT * FROM peliculas WHERE id = ?', [id]);
        return rows;
    }

    // Crear nueva película
    static async crear(titulo, director, anio) {
        const [result] = await pool.query(
            'INSERT INTO peliculas (titulo, director, anio) VALUES (?, ?, ?)', 
            [titulo, director, anio]
        );
        return result;
    }

    // Editar película existente
    static async actualizar(id, titulo, director, anio) {
        const [result] = await pool.query(
            'UPDATE peliculas SET titulo = ?, director = ?, anio = ? WHERE id = ?', 
            [titulo, director, anio, id]
        );
        return result;
    }

    // Eliminar película
    static async eliminar(id) {
        const [result] = await pool.query('DELETE FROM peliculas WHERE id = ?', [id]);
        return result;
    }
}

module.exports = Pelicula;
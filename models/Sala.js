const pool = require('../config/db');

class Sala {
    //Buscar todas las salas 
    static async obtenerTodas() {
        const [salas] = await pool.query('SELECT * FROM salas');
        return salas;
    }

    //Una salas por tu ID 
    static async obtenerPorId(id){
        const[sala] = await pool.query('SELECT * FROM salas WHERE id = ?', [id]);
        return sala;

    }
    
    //Crear una sala nueva
    static async crear(nombre, capacidad, tipo_pantalla) {
        const [result] = await pool.query('INSERT INTO salas (nombre, capacidad, tipo_pantalla) VALUES (?,?,?)',
            [nombre, capacidad, tipo_pantalla]);
        return result;
    }

    //Editar una sala
    static async actualizar(id,nombre, capacidad, tipo_pantalla){
        const [result] = await pool.query('UPDATE salas SET nombre = ?, capacidad = ?, tipo_pantalla = ? WHERE id = ?',
            [nombre, capacidad, tipo_pantalla,id]);
             return result;
        }
    
    //Eliminar 
    static async eliminarForzado (id) {
        //1. Borrar los tickeks
        await pool.query('DELETE FROM tickest WHERE funcion_id IN (SELEC id FROM funcines WHERE salas_id = ?)',  [id]);
        //2. Borrar funciones
        await pool.query('DELETE FROM funciones WHERE sala_id = ?', [id]);
        //3. Borrar la sala 
        const [result] = await pool.query('DELETE FROM salas WHERE id = ?', [id]);
        return result;
    }

    //Eliminar normal
    static async eliminarNormal(id) {
        const [result] = await pool.query('DELETE FROM salas WHERE id = ?', [id]);
        return result;
    }

}


module.exports = Sala;


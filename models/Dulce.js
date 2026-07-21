const db = require('../config/db');   //importacion a la base de datos 

class Dulce {
    static async obtenerTodos() {
        const [rows] = await db.query('SELECT * FROM dulces');
        return rows;
    }
static async obtenerPorId(id){
    const [rows] = await db.query('SELECT * FROM dulces WHERE ID= ?', [id]);
    return rows[0];
}

static async crear(nombre, categoria, precio, stock) {
    const [result] = await db.query(
        'INSERT INTO dulces (nombre, categoria, precio, stock) VALUES (?, ?, ?, ?)',
        [nombre, categoria, precio, stock]
    );
    return result;
}

static async actualizar(id, nombre, categoria, precio, stock) {
    const [result] = await db.query(
        'UPDATE dulces SET nombre = ?, categoria = ?, precio = ?, stock = ?, WHERE = ?', 
        [nombre, categoria, precio, stock, id]
    );
    return result;
}

static async eliminar(id) {
    const [result] = await db.query('DELETE FROM dulces WHERE id = ?', [id]);
    return result;
}


}

module.exports = Dulce;
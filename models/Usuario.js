const db = require('../config/db');

const Usuario = {
    //Buscar un usuario por su nombre de usuario(Para el login)
    async findByUsername(username) {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE username = ?', [username]);
        return rows[0]; //Retorna el usuario si existe, o undefined si no 
    },

    //Crear un nuevo usuario en la base de datos (para el registro)
    async create(username, hashedPassword, rol = 'Cliente') {
        const [result] = await db.query(
            'INSERT INTO usuarios (username, password, rol) VALUES (?, ?, ?)',
            [username, hashedPassword, rol]

        );
        return result.insertId;
    }
};

module.exports = Usuario;
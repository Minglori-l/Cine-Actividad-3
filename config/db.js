const mysql = require('mysql2');
require('dotenv').config(); //permite leer el archivo .evn

//Creando la conexion usando las variables seguras
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

module.exports = pool.promise();

// Revisión de la pool de conexiones a la base de datos



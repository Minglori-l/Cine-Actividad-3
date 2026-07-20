const db = require('./config/db'); 
const bcrypt = require('bcrypt');

async function migrate() {
    console.log('🔄 Iniciando migración completa de la base de datos...');

    try {
        // 1. Crear la tabla de usuarios con los roles requeridos
        await db.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                rol ENUM('Administrador', 'Empleado', 'Cliente') DEFAULT 'Cliente',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Tabla "usuarios" verificada/creada con éxito.');

        // ====================================================================
        // 🍿 AQUÍ PEGAS LAS TABLAS DE TU CINE DE LA ACTIVIDAD ANTERIOR
        // ====================================================================
        
        // 2. Crear la tabla de películas
        await db.query(`
            CREATE TABLE IF NOT EXISTS peliculas (
                id INT AUTO_INCREMENT PRIMARY KEY,
                titulo VARCHAR(255) NOT NULL,
                duracion INT NOT NULL,
                genero VARCHAR(100) NOT NULL
            );
        `);
        console.log('✅ Tabla "peliculas" verificada/creada con éxito.');

        // 3. Tabla de salas (Actualizada con tipo_pantalla)
        await db.query(`
            CREATE TABLE IF NOT EXISTS salas (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(50) NOT NULL,
                capacidad INT NOT NULL,
                tipo_pantalla VARCHAR(100) NOT NULL
             );
        `);
        console.log('✅ Tabla "salas" verificada/creada con éxito.');

        // 4. Tabla de funciones (Asegurar que se llame 'fecha' si tu modelo lo usa así)
        await db.query(`
            CREATE TABLE IF NOT EXISTS funciones (
                id INT AUTO_INCREMENT PRIMARY KEY,
                pelicula_id INT,
                sala_id INT,
                fecha DATETIME NOT NULL,
                FOREIGN KEY (pelicula_id) REFERENCES peliculas(id) ON DELETE CASCADE,
                FOREIGN KEY (sala_id) REFERENCES salas(id) ON DELETE CASCADE
            );
        `);
        console.log('✅ Tabla "funciones" verificada/creada con éxito.');

        // 5. Tabla de tickets (Último bloque estructural)
        await db.query(`
            CREATE TABLE IF NOT EXISTS tickets (
                id INT AUTO_INCREMENT PRIMARY KEY,
                funcion_id INT,
                asiento VARCHAR(20) NOT NULL,
                precio DECIMAL(10, 2) NOT NULL,
                FOREIGN KEY (funcion_id) REFERENCES funciones(id) ON DELETE CASCADE
            );
        `);
        console.log('✅ Tabla "tickets" verificada/creada con éxito.');
        
        // ====================================================================
        // TERMINAN TABLAS ANTERIORES - INICIA INSERCIÓN DE USUARIOS SEMILLA
        // ====================================================================

        // 6. Insertar usuarios de prueba
        const [rows] = await db.query('SELECT COUNT(*) as count FROM usuarios');
        
        if (rows[0].count === 0) {
            console.log('📌 Insertando usuarios de prueba...');

            const adminPass = await bcrypt.hash('admin123', 10);
            const empleadoPass = await bcrypt.hash('empleado123', 10);

            await db.query(`
                INSERT INTO usuarios (username, password, rol) VALUES 
                ('admin', ?, 'Administrador'),
                ('empleado', ?, 'Empleado');
            `, [adminPass, empleadoPass]);

            console.log('✅ Cuentas creadas: "admin" (clave: admin123) y "empleado" (clave: empleado123).');
        } else {
            console.log('ℹ️ La tabla ya tiene usuarios registrados.');
        }

    } catch (error) {
        console.error('❌ Error durante la migración:', error);
    } finally {
        console.log('🏁 Proceso de migración terminado.');
        process.exit(0); 
    }
}

migrate();
# 🎬 Sistema de Gestión - Cine 

¡Bienvenido al repositorio de **Cine**! 🍿
Este es un sistema moderno e intuitivo para la administración completa de un cine, inspirado en la estética limpia de Studio Ghibli. Está construido bajo la arquitectura **MVC (Modelo-Vista-Controlador)**, reforzado con seguridad basada en tokens dinámicos y validación estricta de datos.

---

## 📺 Video Demostrativo y Defensa del Proyecto
[![Defensa del Proyecto - Sistema de Cine](https://img.youtube.com/vi/TU_ID_DE_YOUTUBE/0.jpg)](https://www.youtube.com/watch?v=TU_ID_DE_YOUTUBE)

> 💡 **Nota:** Haz clic en la imagen de arriba para redirigirte a YouTube y ver la explicación en video sobre el funcionamiento del sistema, la arquitectura aplicada y el cumplimiento de la rúbrica de seguridad. *(Recuerda cambiar "TU_ID_DE_YOUTUBE" por el código real de tu video)*.

---

## 🏗️ Reestructuración y Buenas Prácticas Aplicadas
Para esta entrega, el proyecto fue migrado y optimizado bajo exigentes estándares profesionales y requisitos de la cátedra:

* **Separación de Capas (MVC):** La lógica de rutas se dividió de forma estricta en carpetas `models/` (consultas SQL con patrones async/await), `controllers/` (lógica de negocio y control de errores) y `views/` (plantillas dinámicas).
* **Seguridad Avanzada (JWT + Cookies HttpOnly):** Se eliminó el uso de sesiones en memoria tradicional en favor de una **autenticación apátrida (stateless)** mediante tokens JWT. Los tokens se almacenan en cookies con la bandera `httpOnly` activa, blindando la aplicación contra ataques XSS.
* **Cifrado de Contraseñas:** Seguridad impenetrable en la base de datos mediante el hashing adaptativo de contraseñas con **bcrypt**.
* **Validación de Entradas Estricta:** Todos los controladores analizan los objetos `req.body` y `req.query` antes de interactuar con la base de datos, rechazando campos vacíos (`trim() === ''`) o tipos de datos corruptos (`isNaN`).
* **Dualidad de Renderizado:** Se implementaron de forma explícita los dos métodos requeridos por la cátedra:
  1. **Renderizado por Vista (Server-Side):** Utilizando el motor de plantillas **EJS** para estructurar el HTML en el servidor antes del envío.
  2. **Peticiones de API Renderizadas en Cliente (Client-Side):** Utilizando **Fetch API** en JavaScript para consultar endpoints JSON dinámicos sin recargar el navegador.

---

## 🔐 Control de Acceso por Roles (RBAC)
El sistema gestiona de forma nativa la seguridad del ecosistema a través de tres roles definidos mediante middlewares globales de verificación:

| Rol | Permisos |
| :--- | :--- |
| **Administrador** | Acceso total a la plataforma (Gestión de usuarios, películas, salas y funciones). |
| **Empleado** | Gestión intermedia enfocada en la logística de cartelera (Películas, salas y funciones). |
| **Cliente** | Acceso de solo lectura a carteleras y permisos exclusivos para la compra de tickets. |

---

## 🛠️ Tecnologías Utilizadas
* **Backend:** Node.js, Express.js
* **Seguridad:** JSON Web Tokens (`jsonwebtoken`), `bcrypt`, `cookie-parser`
* **Base de Datos:** MySQL / MariaDB (Manejo asíncrono puro con `mysql2/promise`)
* **Frontend:** HTML5, CSS3, JavaScript Asíncrono (Fetch API), Motor de plantillas EJS

---

## 📖 Módulos del Sistema

El sistema está dividido en 4 módulos principales entrelazados mediante reglas de integridad relacional:

### 1. 🎞️ Módulo de Películas
* **Uso:** Navega a la sección "Películas" para ver la cartelera. Permite registrar nuevas películas (título, director, año), así como editarlas o eliminarlas de la base de datos.

### 2. 💺 Módulo de Salas
* **Uso:** Permite crear y modular los espacios físicos definiendo su nombre (ej. Sala 1), capacidad de asientos (validación numérica obligatoria) y tipo de pantalla (2D, 3D, IMAX).

### 3. 🗓️ Módulo de Funciones (Cartelera)
* **Uso:** Une una película con una sala en una fecha y hora específica. Permite ver el ejemplo de **Server-Side Rendering** (en la tabla principal) y **Client-Side Rendering** (sección inferior de últimas funciones del API).

### 4. 🎟️ Módulo de Tickets
* **Uso:** Registra la venta de boletos enlazando la función programada, el asiento asignado (ej. "B2") y el precio final (validado como tipo decimal en el controlador).

---

## 🚀 Guía de Instalación y Arranque 

Siga cuidadosamente estos pasos para ejecutar el sistema en un entorno de desarrollo local:

### Paso 1: Obtención del Código
Clona este repositorio en tu equipo local o extrae los archivos en la carpeta de destino deseada.
```bash
git clone [https://github.com/Minglori-l/Cine-Actividad-3.git](https://github.com/Minglori-l/Cine-Actividad-3.git)
```

### Paso 2: Instalación de Dependencias
Abre una terminal en el directorio raíz del proyecto y ejecuta:
```bash
npm install
```

### Paso 3: Configuración Automática de Base de Datos
1. Inicia tu entorno MySQL local (ej. a través de XAMPP, Laragon o MySQL Workbench).
2. Crea manualmente una base de datos vacía llamada `cine_db`:
   ```sql
   CREATE DATABASE cine_db;
   ```
3. Ejecuta el script automatizado de migración incluido en el proyecto. Este script creará de forma inteligente todas las tablas con sus llaves foráneas correspondientes y sembrará los usuarios por defecto (`admin` y `empleado`) con sus claves ya encriptadas para pruebas inmediatas:
   ```bash
   node migration.js
   ```

### Paso 4: Credenciales de Entorno
Crea un archivo llamado `.env` en la raíz del proyecto y asigna los valores correspondientes a tu entorno de base de datos junto con una clave secreta para los tokens:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=TU_CONTRASENA_AQUI
DB_NAME=cine_db
DB_PORT=3306

# Clave secreta para firmar los JWT
JWT_SECRET=clave_secreta_para_desarrollo_local_123
```

### Paso 5: Arranque del Servidor
Inicia la aplicación ejecutando el siguiente comando en la terminal:
```bash
npm start
```
Accede a través de tu navegador web en: `http://localhost:3000`.

---

## 🔌 Endpoints Destacados de la API REST

El sistema expone endpoints RESTful protegidos que devuelven datos puros en formato JSON:

* **GET `/api/tickets`**: Devuelve la lista completa de tickets vendidos (Requiere rol Administrador/Empleado).
* **GET `/api/tickets/:id`**: Retorna un ticket específico mediante su identificador numérico.
* **POST `/api/tickets`**: Registra una venta desde el cliente. Requiere un objeto JSON en el cuerpo (`funcion_id`, `asiento`, `precio`).
* **GET `/funciones/filtrar?inicio=YYYY-MM-DD&fin=YYYY-MM-DD`**: Filtra funciones dinámicamente por rango de fechas válidas pasadas por URL.
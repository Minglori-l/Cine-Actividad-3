# 🎬 Sistema de Gestión - Cine 

¡Bienvenido al repositorio de **Cine**! 🍿
Este es un sistema moderno e intuitivo para la administración completa de un cine, inspirado en la estética limpia de Studio Ghibli. Está construido bajo la arquitectura **MVC (Modelo-Vista-Controlador)** y cuenta con recargas asíncronas para una experiencia de usuario fluida.

---

## 🏗️ Reestructuración y Buenas Prácticas Aplicadas
Para esta entrega, el proyecto fue migrado y optimizado bajo los siguientes estándares profesionales:

* **Separación de Capas (MVC):** La lógica de rutas se dividió de forma estricta en carpetas `models/` (consultas SQL), `controllers/` (lógica de negocio) y `views/` (plantillas dinámicas).

* **Ciberseguridad (`.env`):** Se centralizó la conexión en `config/db.js` y se eliminaron las contraseñas explícitas del código, encapsulándolas en variables de entorno independientes.

* **Dualidad de Renderizado:** Se implementaron de forma explícita los dos métodos requeridos por la cátedra:
  
  1. **Renderizado por Vista (Server-Side):** Utilizando el motor de plantillas **EJS** para procesar bucles y estructurar el HTML en el servidor antes del envío.
  
  2. **Peticiones de API Renderizadas en Cliente (Client-Side):** Utilizando **Fetch API** en JavaScript para consultar endpoints JSON (`/funciones/ultimas`) y dibujar componentes dinámicos en vivo sin recargar el navegador.

---

## 🛠️ Tecnologías Utilizadas
* **Backend:** Node.js, Express.js
* **Base de Datos:** MySQL / MariaDB (Manejo asíncrono con `pool.promise()`)
* **Frontend:** HTML5, CSS3, JavaScript Asíncrono (Fetch API), Motor de plantillas EJS

---

## 📖 Manual de Usuario (Módulos del Sistema)

El sistema está dividido en 4 módulos principales, diseñados para seguir un flujo lógico de trabajo dentro de un cine:

### 1. 🎞️ Módulo de Películas
* **Función:** Gestionar el catálogo del cine.
* **Uso:** Navega a la sección "Películas" para ver la cartelera. Permite registrar nuevas películas (título, director, año), así como editarlas o eliminarlas de la base de datos.

### 2. 💺 Módulo de Salas
* **Función:** Administrar los espacios físicos del cine.
* **Uso:** Permite crear salas definiendo su nombre (ej. Sala 1), capacidad de asientos y tipo de pantalla (2D, 3D, IMAX).

### 3. 🗓️ Módulo de Funciones (Cartelera)
* **Función:** Programar los horarios.
* **Uso:** Une una película con una sala en una fecha y hora específica. Permite ver el ejemplo de **Server-Side Rendering** (en la tabla principal) y **Client-Side Rendering** (en la sección inferior de últimas funciones del API).

### 4. 🎟️ Módulo de Tickets
* **Función:** Punto de venta (Taquilla).
* **Uso:** Registra la venta de boletos enlazando la función programada, el asiento asignado (ej. "B2") y el precio final.

---

## 🚀 Guía de Instalación y Arranque 

Siga cuidadosamente estos pasos para ejecutar el sistema en un entorno de desarrollo local:

### Paso 1: Obtención del Código
Clona este repositorio en tu equipo local o extrae los archivos en la carpeta de destino deseada.

```bash
git clone [https://github.com/Minglori-l/Cine-Actividad-2](https://github.com/Minglori-l/Cine-Actividad-2)
```


## Paso 2: Instalación de Dependencias

Abre una terminal en el directorio raíz del proyecto y ejecuta el gestor de paquetes de Node para instalar las librerías requeridas (Express, MySQL2, etc.).

```bash
npm install
```

### Paso 3: Configuración de la Base de Datos
Inicia tu servidor MySQL (ej. a través de XAMPP o MySQL Workbench).

* **Crea una base de datos** llamada cine_db.

* **Importa** el archivo cine_db.sql incluido en la raíz o ejecuta el siguiente script estructural con restricciones de integridad relacional:

```bash
CREATE TABLE `peliculas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(150) NOT NULL,
  `director` varchar(100) NOT NULL,
  `anio` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `salas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `capacidad` int(11) NOT NULL,
  `tipo_pantalla` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `funciones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pelicula_id` int(11) DEFAULT NULL,
  `sala_id` int(11) DEFAULT NULL,
  `fecha` datetime NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`pelicula_id`) REFERENCES `peliculas` (`id`) ON DELETE SET NULL,
  FOREIGN KEY (`sala_id`) REFERENCES `salas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `tickets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `funcion_id` int(11) NOT NULL,
  `asiento` varchar(10) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`funcion_id`) REFERENCES `funciones` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```
 Paso 4: Credenciales de Entorno
Crea o edita el archivo .env en la raíz del proyecto y asigna los valores correspondientes a tu configuración local de MySQL:

```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=TU_CONTRASENA_AQUI
DB_NAME=cine_db
DB_PORT=3306
```

 Paso 5: Arranque del Servidor
Inicia la aplicación ejecutando el siguiente comando en la terminal:

```bash
npm start

Accede a través de tu navegador web en: http://localhost:3000.
```
---

* **🔌 Documentación de la API REST**

El sistema expone endpoints RESTful que devuelven datos puros en formato JSON, ideales para el consumo del lado del cliente o aplicaciones externas:

* **GET /api/tickets:** Devuelve la lista completa de tickets con relaciones cruzadas.

* **GET /api/tickets/:id:** Retorna un ticket específico mediante su identificador.

* **POST /api/tickets:** Registra una venta. Requiere un objeto JSON en el cuerpo (funcion_id, asiento, precio).

* **DELETE /api/tickets/:id:** Remueve un ticket del sistema de forma asíncrona.

----

---

### 📤 Comandos finales para actualizar tu GitHub

Una vez que guardes el archivo (`Ctrl + S`), dirígete a la pestaña de la **TERMINAL** abajo en Visual Studio Code y escribe estas tres líneas clásicas para subir todo a internet:

```bash
git add .
git commit -m "Docs: Estructuracion completa y profesional del archivo README"
git push origin main


```

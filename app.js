// Carga segura de dotenv (si no está instalado, no rompe la app)
try {
  require('dotenv').config();
} catch (e) {
  console.log('⚠️ dotenv no está instalado o no se encontró archivo .env');
}

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var jwt = require('jsonwebtoken');

// Importamos tus rutas
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var peliculasRouter = require('./routes/peliculas');
const funcionesRouter = require('./routes/funciones');
const salasRouter = require('./routes/salas');
const ticketsRouter = require('./routes/tickets');
const dulcesRouter = require('./routes/dulces');

// 🔐 IMPORTAMOS EL MIDDLEWARE DE PROTECCIÓN
const { verificarAcceso } = require('./middlewares/auth');

var app = express();

// Configuración del motor de plantillas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 🔐 Middleware global para pasar el usuario a todas las vistas EJS
app.use((req, res, next) => {
  const token = req.cookies ? req.cookies.token : null;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto_por_defecto');
      res.locals.user = decoded; // Disponible en EJS
      req.user = decoded;        // Disponible en controladores
    } catch (error) {
      console.error('❌ Error al verificar token JWT:', error.message);
      res.clearCookie('token');
      res.locals.user = null;
      req.user = null;
    }
  } else {
    res.locals.user = null;
    req.user = null;
  }
  next();
});

// 🔓 RUTAS PÚBLICAS
app.use('/', indexRouter);
app.use('/users', usersRouter);

// 🔐 RUTAS PROTEGIDAS POR ROLES
app.use('/api/peliculas', verificarAcceso(['Administrador', 'Empleado']), peliculasRouter);
app.use('/funciones', verificarAcceso(['Administrador', 'Empleado']), funcionesRouter);
app.use('/api/salas', verificarAcceso(['Administrador', 'Empleado']), salasRouter);

app.use('/api/tickets', verificarAcceso(['Administrador', 'Empleado', 'Cliente']), ticketsRouter);
app.use('/api/dulces', verificarAcceso(['Administrador', 'Empleado', 'Cliente']), dulcesRouter);

// Manejo de error 404
app.use(function(req, res, next) {
  next(createError(404));
});

// Manejo de errores generales
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
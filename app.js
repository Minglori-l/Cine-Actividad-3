var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Importamos tus rutas
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var peliculasRouter = require('./routes/peliculas');
const funcionesRouter = require('./routes/funciones');
const salasRouter = require('./routes/salas');
const ticketsRouter = require('./routes/tickets');

// 🔐 IMPORTAMOS EL MIDDLEWARE DE PROTECCIÓN
const { verificarAcceso } = require('./middlewares/auth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware global para pasar los datos del usuario logueado a todas las vistas EJS y rutas
app.use((req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.locals.user = decoded; // Disponible en cualquier archivo .ejs
      req.user = decoded;        // 🔥 NUEVO: Ahora estará disponible en tus controladores y middlewares (req.user)
    } catch (error) {
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

// 🔓 RUTAS PÚBLICAS (Cualquiera puede entrar a ver el inicio o loguearse)
app.use('/', indexRouter);
app.use('/users', usersRouter);

// 🔐 RUTAS PROTEGIDAS POR ROLES
// Solo Administradores y Empleados pueden gestionar Películas, Funciones y Salas
app.use('/api/peliculas', verificarAcceso(['Administrador', 'Empleado']), peliculasRouter);
app.use('/funciones', verificarAcceso(['Administrador', 'Empleado']), funcionesRouter);
app.use('/api/salas', verificarAcceso(['Administrador', 'Empleado']), salasRouter);

// Los Tickets los pueden gestionar todos los usuarios autenticados (Admin, Empleado y Clientes)
app.use('/api/tickets', verificarAcceso(['Administrador', 'Empleado', 'Cliente']), ticketsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
var createError = require('http-errors');
const express = require("express");
var path = require('path');

var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejsLayouts = require("express-ejs-layouts");
const session = require("express-session");

const usersRouter = require("./routes/users");
const loginRouter = require("./routes/login");
const registerRouter = require("./routes/register");
const forgotPasswordRouter = require("./routes/forgot-password");
const dashboardRouter = require("./routes/dashboard");

const app = express();

// view engine setup
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
app.use(ejsLayouts);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de sesiones
app.use(session({
  secret: 'QSw123+-kYH', // Cambia esto por una clave secreta segura
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // En producción, usa `secure: true` con HTTPS
}));

// Crea un middleware para verificar si el usuario está autenticado.
function ensureAuthenticated(req, res, next) {
  if (req.session.user) {
    next(); // Usuario autenticado, continuar
  } else {
    res.redirect("/login"); // Redirigir al login si no está autenticado
  }
}

// Ruta de logout para cerrar sessión
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error al cerrar sesión:", err);
    }
    res.redirect("/login");
  });
});

app.use("/", dashboardRouter);
app.use('/users', usersRouter);
app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/forgot-password", forgotPasswordRouter);
app.use("/dashboard", ensureAuthenticated, dashboardRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render('404');
  res.render("404", { title: "Error 404", layout: false });
});

module.exports = app;

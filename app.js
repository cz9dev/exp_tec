const createError = require('http-errors');
const express = require("express");
const ejsLayouts = require("express-ejs-layouts");

const path = require('path');

const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require("express-session");
const flash = require("express-flash");

const app = express();

// Configuración de sesiones
app.use(session({
  secret: 'QSw123+-kYH', // Cambia esto por una clave secreta segura
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // En producción, usa `secure: true` con HTTPS
}));

// view engine setup
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
app.use(ejsLayouts);
app.set("layout", "layouts/layout");

app.use(flash());

// Middleware
app.use((req, res, next) => {
  // Asignar usuario de la sesión
  res.locals.user = req.session.user ? { id: req.session.user } : null;

  // Asignar mensajes flash de éxito y error
  res.locals.success_msg = req.flash("success_msg") || null;
  res.locals.error_msg = req.flash("error_msg") || null;
  
  // Registro de depuración
  console.log(`Ruta solicitada: ${req.method} ${req.path}`);
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
const loginRouter = require("./routes/login");
const registerRouter = require("./routes/register");
const forgotPasswordRouter = require("./routes/forgot-password");
const dashboardRouter = require("./routes/dashboard");

// Ruta de logout para cerrar sessión
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error al cerrar sesión:", err);
    }
    res.redirect("/login");
  });
});

// Modificar la ruta raíz
app.get("/", (req, res) => {
  if (req.session.user) {
    res.redirect("/dashboard");
  } else {
    res.redirect("/login");
  }
});

app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/forgot-password", forgotPasswordRouter);
app.use("/dashboard", dashboardRouter);

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

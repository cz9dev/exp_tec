const createError = require("http-errors");
const express = require("express");
const ejsLayouts = require("express-ejs-layouts");

const path = require("path");

const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const flash = require("express-flash");

const app = express();

// Configuración de sesiones
app.use(
  session({
    secret: "QSw123+-kYH", // Cambia esto por una clave secreta segura
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production", // true en producción, false en desarrollo
      //secure: false, // cuando este en producción dejar la parte de arriba
      httpOnly: true, // Recomendado para seguridad
      maxAge: 24 * 60 * 60 * 1000, // Ejemplo: 1 día de duración
    },
  })
);

// view engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(ejsLayouts);
app.set("layout", "layouts/layout");

app.use(flash());

// Middleware
app.use(async (req, res, next) => {
  if (req.session.user) {
    try {
      // Actualizar permisos en cada request (opcional, puedes cachearlos)
      const { getUserPermissions } = require("./middleware/auth");
      const permissions = await getUserPermissions(req.session.user.id);

      res.locals.user = {
        id: req.session.user.id,
        username: req.session.user.username,
        permissions: permissions,
      };

      // Función helper para verificar permisos en las vistas
      res.locals.hasPermission = (permission) => {
        return (
          res.locals.user && res.locals.user.permissions.includes(permission)
        );
      };
    } catch (error) {
      console.error("Error al cargar permisos:", error);
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }

  // Asignar mensajes flash
  res.locals.success_msg = req.flash("success_msg") || null;
  res.locals.error_msg = req.flash("error_msg") || null;

  next();
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Rutas
const loginRouter = require("./routes/login");
const registerRouter = require("./routes/register");
const forgotPasswordRouter = require("./routes/forgot-password");
const adminRouter = require("./routes/adminRoutes");

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
app.use("/dashboard", adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render('404');
  res.render("404", { title: "Error 404", layout: false });
});

module.exports = app;

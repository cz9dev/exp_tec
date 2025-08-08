const createError = require("http-errors");
const express = require("express");
const ejsLayouts = require("express-ejs-layouts");
const path = require("path");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const flash = require("express-flash");
const db = require("./lib/database");
const config = require("./config/config");

const app = express();

// Configuración de sesiones
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// Configuración de vistas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(ejsLayouts);
app.set("layout", "layouts/layout");
app.use(flash());

// Middleware
app.use(async (req, res, next) => {
  if (req.session.user) {
    try {
      const { getUserPermissions } = require("./middleware/auth");
      const permissions = await getUserPermissions(req.session.user.id);
      res.locals.user = {
        id: req.session.user.id,
        username: req.session.user.username,
        permissions: permissions,
      };
      res.locals.hasPermission = (permission) => {
        return res.locals.user?.permissions.includes(permission);
      };
    } catch (error) {
      console.error("Error al cargar permisos:", error);
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Middleware de instalación
app.use((req, res, next) => {
  const envPath = path.join(__dirname, ".env");
  const isInstallMode = !fs.existsSync(envPath);

  // Si estamos en modo instalación y no es la ruta /install
  if (isInstallMode && !req.path.startsWith("/install")) {
    return res.redirect("/install");
  }

  // Si NO estamos en modo instalación y es la ruta /install
  if (!isInstallMode && req.path.startsWith("/install")) {
    return res.redirect("/login");
  }

  next();
});

// Configuración asíncrona de la DB
const initializeDatabase = async () => {
  const envPath = path.join(__dirname, ".env");
  if (fs.existsSync(envPath)) {
    try {
      // Asegúrate de que la configuración esté cargada
      config.reload();

      // Inicializa la conexión a la DB
      app.locals.db = db;
      await db.connect(config.database);
    } catch (error) {
      console.error("Error al conectar a la DB:", error.message);
    }
  }
};

// Rutas
app.use("/login", require("./routes/login"));
app.use("/register", require("./routes/register"));
app.use("/forgot-password", require("./routes/forgot-password"));
app.use("/dashboard", require("./routes/adminRoutes"));
app.use("/install", require("./routes/install"));

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error("Error al cerrar sesión:", err);
    res.redirect("/login");
  });
});

app.get("/", (req, res) => {
  res.redirect(req.session.user ? "/dashboard" : "/login");
});

// Manejo de errores
app.use((req, res, next) => next(createError(404)));
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500).render("404", {
    title: "Error 404",
    layout: false,
  });
});

// Iniciar servidor después de inicializar la DB
initializeDatabase()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error al inicializar la aplicación:", err);
    process.exit(1);
  });

module.exports = app;

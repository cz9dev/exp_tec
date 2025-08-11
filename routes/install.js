const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const config = require("../config/config");
const db = require("../lib/database");
const seed = require("../config/seed");
const { promisify } = require("util");
const { generateToken } = require("csrf-csrf");

// Convertimos fs.writeFile a versión con promesas
const writeFileAsync = promisify(fs.writeFile);

/* GET login page */
router.get("/", function (req, res, next) {
  // Verifica si ya existe el .env
  const envPath = path.join(__dirname, "../.env");
  if (fs.existsSync(envPath)) {
    return res.redirect("/login");
  }

  res.render("install", {
    title: "Instalación de la Aplicación",
    layout: false,
    success: false,
    error: null,
  });
  console.log("Entro a instalación de la aplicación");
});

/* POST install page */
router.post("/", async function (req, res, next) {
  try {
    // Verifica si ya existe el .env
    const envPath = path.join(__dirname, "../.env");
    if (fs.existsSync(envPath)) {
      return res.redirect("/login");
    }

    const { dbHost, dbUser, dbPass, dbName, sessionSecret } = req.body;

    // Validación básica
    if (!dbHost || !dbUser || !dbPass || !dbName || !sessionSecret) {
      return res.render("install", {
        title: "Instalación de la Aplicación",
        error: "Por favor, completa todos los campos.",
      });
    }

    // Validación mejorada
    if (
      !dbHost.match(
        /^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])(\.([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]{0,61}[a-zA-Z0-9]))*$/
      )
    ) {
      return res.render("install", {
        title: "Instalación de la Aplicación",
        error: "Por favor, introduce un host válido.",
      });
    }

    // Función para escapar valores (PROTECCIÓN CONTRA INYECCIÓN)
    const escapeEnvValue = (value) => {
      return value
        .replace(/\\/g, "\\\\") // Escapar backslashes primero
        .replace(/"/g, '\\"') // Escapar comillas dobles
        .replace(/\n/g, "\\n") // Escapar saltos de línea
        .replace(/\r/g, "\\r") // Escapar retornos de carro
        .replace(/\t/g, "\\t"); // Escapar tabs
    };

    // Crear contenido del .env
    let envContent = `# Configuración de sesión
NODE_ENV=development
SESSION_SECRET=${sessionSecret}
# Base de datos MariaDB
DB_DIALECT=mysql
DB_HOST=${dbHost}
DB_USER=${dbUser}
DB_PASS=${dbPass}
DB_NAME=${dbName}
# Puerto de despliegue
PORT=3000`;

    try {
      const freshConfig = {
        host: dbHost,
        user: dbUser,
        password: dbPass,
        name: dbName,
        dialect: "mysql",
      };

      await db.connect(freshConfig);
      await writeFileAsync(envPath, envContent, { mode: 0o600 });

      config.reload(); // Forzar recarga de configuración

      // Esperar un momento para asegurar la recarga
      await new Promise((resolve) => setTimeout(resolve, 100));

      await seed();

      // Mostrar vista de éxito en lugar de redirigir
      res.render("install", {
        title: "Instalación Completa",
        success: true,
        layout: false,
      });
    } catch (dbError) {
      console.error("Error conectando a DB:", dbError);
      res.render("install", {
        title: "Instalación",
        error: `No se pudo conectar a la DB: ${dbError.message}, verifique sus datos`,
        formData: req.body,
        layout: false,
      });
    }
  } catch (error) {
    console.error("Error durante la instalación:", error);
    res.render("install", {
      title: "Instalación de la Aplicación",
      error: "Ocurrió un error durante la instalación.  Verifica los logs.",
      layout: false,
    });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

// Credenciales válidas (en un entorno real, esto debería estar en una base de datos)
const validEmail = "ramon@nauta.cu";
const validPasswordHash =
  "$2b$10$ZmWLaxvlxxDBVo61NkmYEuhJD6/lNbPsymGFGTSijmFAy3EG4Bhcm"; // Hash de "QSw123+-"

/* GET login page. */
router.get("/", function (req, res, next) {
  res.render("login", { title: "Login", layout: false, error: null });
});

/* POST login page */
router.post("/", async function (req, res, next) {
  const { email, password } = req.body;

  if (email === validEmail) {
    // Comparar la contraseña ingresada con el hash almacenado
    const passwordMatch = await bcrypt.compare(password, validPasswordHash);

    if (passwordMatch) {
      // Guardar el usuario en la sesión
      req.session.user = { email };
      // Credenciales correctas: Redirigir al dashboard
      res.redirect("/dashboard");
    } else {
      // Contraseña incorrecta: Mostrar alerta
      const error = "Contraseña incorrecta.";
      res.render('login', { title: 'Login', layout: false, error });
    }
  } else {
    // Correo incorrecto: Mostrar alerta
    const error = "Correo electrónico incorrecto.";
    res.render('login', { title: 'Login', layout: false, error });
  }
});

module.exports = router;

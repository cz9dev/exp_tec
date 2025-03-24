var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
const pool = require("../config/db"); // Asegúrate de tener esta ruta correcta

/* GET register page */
router.get("/", function (req, res, next) {

  res.render("register", {
    title: "Registro",
    layout: false,
    errors: null, // Para manejar errores en la vista
    formData: null, // Para mantener los datos del formulario
  });
});

/* POST register page */
router.post("/", async function (req, res, next) {
  const { name, username, email, password, confirm_password } = req.body;
  const errors = [];

  // Validaciones básicas
  if (password !== confirm_password) {
    errors.push("Las contraseñas no coinciden");
  }

  if (password.length < 8) {
    errors.push("La contraseña debe tener al menos 8 caracteres");
  }

  if (errors.length > 0) {
    return res.render("register", {
      title: "Registro",
      layout: false,
      errors,
      formData: req.body // Para mantener los datos del formulario
    });
  }

  try {
    // Verificar si el email ya existe
    const [existingUser] = await pool.query(
      "SELECT id FROM usuarios WHERE email = ?", 
      [email]
    );

    if (existingUser.length > 0) {
      return res.render("register", {
        title: "Registro",
        layout: false,
        errors: ["El correo electrónico ya está registrado"],
        formData: req.body
      });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);

    // Crear usuario en la base de datos
    const [result] = await pool.query(
      "INSERT INTO usuarios (username, email, password_hash, nombre) VALUES (?, ?, ?, ?)",
      [username, email, hash, name]
    );

    // Redirigir al login con mensaje de éxito
    req.flash("success_msg", "Registro exitoso. Por favor inicia sesión.");
    res.redirect("/login");

  } catch (error) {
    console.error("Error en registro:", error);
    res.render("register", {
      title: "Registro",
      layout: false,
      errors: ["Ocurrió un error al registrar. Intenta nuevamente."],
      formData: req.body
    });
  }
});

module.exports = router;
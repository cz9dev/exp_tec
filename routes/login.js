const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const { use } = require("./users");

/* GET login page */
router.get("/", function (req, res, next) {
  res.render("login", {
    title: "Login",
    layout: false,
    error: null,
    formData: {}, // Añadido para consistencia
  });
});

/* POST login page */
router.post("/", async function (req, res, next) {
  const { email, password } = req.body;

  try {
    // 1. Buscar usuario por email
    const user = await User.findByEmail(email);

    // 2. Verificar si el usuario existe y la contraseña coincide
    if (!user) {
      return res.status(401).render("login", {
        title: "Login",
        layout: false,
        error: "Credenciales inválidas",
        formData: req.body, // Mantener los datos del formulario
      });
    }

    const isPasswordValid = await User.verifyPassword(user, password);
    if (!isPasswordValid) {
      return res.status(401).render("login", {
        title: "Login",
        layout: false,
        error: "Credenciales inválidas",
        formData: req.body,
      });
    }

    // 3. Si todo es correcto, crear sesión
    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    req.session.save(() => {
      res.redirect("/dashboard");
    });
  } catch (error) {
    console.error("Error en autenticación:", error);
    res.status(500).render("login", {
      title: "Login",
      layout: false,
      error: "Ocurrió un error durante la autenticación",
      formData: req.body,
    });
  }
});

module.exports = router;

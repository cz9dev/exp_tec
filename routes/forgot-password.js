var express = require("express");
var router = express.Router();

/* GET forgot-password page. */
router.get("/", function (req, res, next) {
  res.render("forgot-password", {
    title: "Recuperar Contraseña",
    layout: false,
  }); // Sin layout
});

/* POST forgot-password page. */
router.post("/", function (req, res, next) {
  // Aquí iría la lógica de recuperación de contraseña
  res.redirect("/login"); // Redirige al login después de enviar las instrucciones
});

module.exports = router;
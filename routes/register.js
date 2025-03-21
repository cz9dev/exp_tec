var express = require("express");
var router = express.Router();

/* GET register page. */
router.get("/", function (req, res, next) {
  res.render("register", { title: "Registro", layout: false }); // Sin layout
});

/* POST register page. */
router.post("/", function (req, res, next) {
  const { email, password } = req.body;

  const bcrypt = require("bcrypt");
  const saltRounds = 10;

  bcrypt.hash(password, saltRounds, function (err, hash) {
    if (err) throw err;
    console.log("Hash de la contraseña:", hash);
  });

  //Almacenar en la base de datos el email y el hash que se obtubo al encriptar la contraseña
  
  // Aquí iría la lógica de registro
  res.redirect("/login"); // Redirige al login después del registro
});

module.exports = router;
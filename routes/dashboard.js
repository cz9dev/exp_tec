var express = require("express");
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log("Renderizando dashboard..."); // Depuración
  res.render("dashboard", { title: "Exp-Tec" });
});

module.exports = router;

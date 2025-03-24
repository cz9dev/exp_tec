var express = require('express');
var router = express.Router();
const { checkAuth } = require("../middleware/auth");

// Ruta protegida con permiso específico
//router.get('/', checkAuth(['VIEW_DASHBOARD']), (req, res) => {
  //res.render('dashboard');  
//});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
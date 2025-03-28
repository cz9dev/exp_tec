const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { checkAuth } = require("../middleware/auth");

// Middleware para verificar rol de administrador
//const isAdmin = checkAuth(["ADMIN"]);
const isAdmin = checkAuth(["VIEW_DASHBOARD"]);

/* GET home page. */
router.get("/", checkAuth(["VIEW_DASHBOARD"]), (req, res) => {
  try {
    res.render("dashboard", {
      title: "Exp - Tec",
      user: req.session.user,
    });
  } catch (error) {
    console.error(error);
    res.redirect("/login");
  }
});

// Gestión de usuarios
router.get("/users", isAdmin, adminController.listUsers);

// Gestión de roles
router.get("/roles", isAdmin, adminController.listRoles);

// Gestión de roles
router.get("/permissions", isAdmin, adminController.listPermissions);

module.exports = router;

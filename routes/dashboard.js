const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const rolesController = require("../controllers/rolesController");
const permissionsController = require("../controllers/permissionsController");
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
router.get("/users", isAdmin, userController.listUsers);
router.get("/users/new", isAdmin, userController.showCreateForm);
router.post("/users", isAdmin, userController.createUser);
router.get("/users/:id/edit", isAdmin, userController.showEditForm);
router.post("/users/:id/update", isAdmin, userController.updateUser);
router.post("/users/:id/delete", isAdmin, userController.deleteUser);

// Gestión de roles
router.get("/roles", isAdmin, rolesController.listRoles);
// Ruta para ver permisos de un rol
router.get("/roles/:id", rolesController.roleDetails);

// Gestión de roles
//router.get("/permissions", isAdmin, permissionsController.listPermissions);

module.exports = router;

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const rolesController = require("../controllers/rolesController");
const permissionsController = require("../controllers/permissionsController");
const { checkAuth } = require("../middleware/auth");
const multer = require('multer');

/* GET home page. */
router.get("/", checkAuth(["VIEW_DASHBOARD"]), (req, res) => {
  try {
    res.render("dashboard", {
      title: "Dashboard",
      user: req.session.user,
    });
  } catch (error) {
    console.error(error);
    res.redirect("/login");
  }
});

// Gestión de usuarios
router.get("/users", checkAuth(["MANAGE_USERS"]), userController.listUsers);
router.get("/users/new", checkAuth(["MANAGE_USERS"]), userController.showCreateForm);
router.post("/users", checkAuth(["MANAGE_USERS"]), userController.createUser);
router.get("/users/:id/edit", checkAuth(["MANAGE_USERS"]), userController.showEditForm);
router.post("/users/:id/update", checkAuth(["MANAGE_USERS"]), userController.updateUser);
router.post("/users/:id/delete", checkAuth(["MANAGE_USERS"]), userController.deleteUser);

// Ruta para el perfil del usuario
router.get("/profile", checkAuth(["VIEW_DASHBOARD"]), userController.profile);
router.post("/profile/update", checkAuth(["VIEW_DASHBOARD"]), userController.updateProfile);

// Gestión de roles
router.get("/roles", checkAuth(["MANAGE_ROLES"]), rolesController.listRoles);
// Ruta para ver permisos de un rol
router.get("/roles/:id", checkAuth(["MANAGE_ROLES"]), rolesController.roleDetails);

// Gestión de permisos
//router.get("/permissions", checkAuth(["VIEW_PERMISSIONS"]), permissionsController.listPermissions);

module.exports = router;

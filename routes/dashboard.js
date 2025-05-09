const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const rolesController = require("../controllers/rolesController");
const permissionsController = require("../controllers/permissionsController");
const brandController = require("../controllers/brandController");
const modelsController = require("../controllers/modelsController");
const { checkAuth } = require("../middleware/auth");

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
router.get("/users", checkAuth(["VIEW_USERS"]), userController.listUsers);
router.get("/users/new", checkAuth(["MANAGE_USERS"]), userController.showCreateForm);
router.post("/users", checkAuth(["MANAGE_USERS"]), userController.createUser);
router.get("/users/:id/edit", checkAuth(["MANAGE_USERS"]), userController.showEditForm);
router.post("/users/:id/update", checkAuth(["MANAGE_USERS"]), userController.updateUser);
router.post("/users/:id/delete", checkAuth(["MANAGE_USERS"]), userController.deleteUser);

// Ruta para el perfil del usuario
router.get("/profile", checkAuth(["VIEW_DASHBOARD"]), userController.profile);
router.post("/profile/update", checkAuth(["VIEW_DASHBOARD"]), userController.updateProfile);

// Gestión de roles
router.get("/roles", checkAuth(["VIEW_ROLES"]), rolesController.listRoles);
// Ruta para ver permisos de un rol
router.get("/roles/:id", checkAuth(["VIEW_ROLES"]), rolesController.roleDetails);

// Gestión de permisos
router.get("/permissions", checkAuth(["VIEW_PERMISSIONS"]), permissionsController.listPermissions);
router.get("/permissions/new", checkAuth(["MANAGE_PERMISSIONS"]), permissionsController.showCreateForm); // Nueva ruta para crear
router.post("/permissions", checkAuth(["MANAGE_PERMISSIONS"]), permissionsController.createPermission); // Nueva ruta para crear
router.get("/permissions/:id/edit", checkAuth(["MANAGE_PERMISSIONS"]), permissionsController.showEditForm);
router.post("/permissions/:id/update", checkAuth(["MANAGE_PERMISSIONS"]), permissionsController.updatePermission);
router.post("/permissions/:id/delete", checkAuth(["MANAGE_PERMISSIONS"]), permissionsController.deletePermission);

// Gestionar marcas
router.get("/brands", checkAuth(["VIEW_BRANDS"]), brandController.listBrands);
router.get("/brands/new", checkAuth(["MANAGE_BRANDS"]), brandController.showCreateForm);
router.post("/brands", checkAuth(["MANAGE_BRANDS"]), brandController.createBrand);
router.get("/brands/:id/edit", checkAuth(["MANAGE_BRANDS"]), brandController.showEditForm);
router.post("/brands/:id/update", checkAuth(["MANAGE_BRANDS"]), brandController.updateBrand);
router.post("/brands/:id/delete", checkAuth(["MANAGE_BRANDS"]), brandController.deleteBrand);

//Gestionar Modelos
router.get("/models", checkAuth(["VIEW_MODELS"]), modelsController.list);
router.get("/models/new", checkAuth(["MANAGE_MODELS"]), async (req, res) => {
  const marcas = await modelsController.getMarcas();
  res.render("models/create", { marcas, title: "Nuevo Modelo" });
});
router.post("/models", checkAuth(["MANAGE_MODELS"]), modelsController.create);
router.get("/models/:id/edit", checkAuth(["MANAGE_MODELS"]), modelsController.edit);
router.post("/models/:id/update", checkAuth(["MANAGE_MODELS"]), modelsController.update);
router.post("/models/:id/delete", checkAuth(["MANAGE_MODELS"]), modelsController.delete);

module.exports = router;

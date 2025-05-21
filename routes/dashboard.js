const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const rolesController = require("../controllers/rolesController");
const permissionsController = require("../controllers/permissionsController");
const brandController = require("../controllers/brandController");
const modelsController = require("../controllers/modelsController");
const areaController = require("../controllers/areaController");
const trabajadoresController = require("../controllers/trabajadoresController");
const componentTypeController = require("../controllers/componentTypeController");
const componentController = require("../controllers/componentController");
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
router.get("/roles/:id", checkAuth(["VIEW_ROLES"]), rolesController.roleDetails); // Ruta para ver permisos de un rol
router.get("/roles/:id/permisos/nuevo", checkAuth(["MANAGE_ROLES"]), rolesController.showAddPermissionForm);
router.post("/roles/:id/permisos/agregar", checkAuth(["MANAGE_ROLES"]), rolesController.addPermission);
router.post("/roles/:roleId/permisos/:permissionId/eliminar", checkAuth(["MANAGE_ROLES"]), rolesController.deletePermission);

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

// Gestionar areas
router.get("/areas", checkAuth(["VIEW_AREAS"]), areaController.listAreas);
router.get("/areas/new", checkAuth(["MANAGE_AREAS"]), areaController.showCreateForm);
router.post("/areas", checkAuth(["MANAGE_AREAS"]), areaController.createArea);
router.get("/areas/:id/edit", checkAuth(["MANAGE_AREAS"]), areaController.showEditForm);
router.post("/areas/:id/update", checkAuth(["MANAGE_AREAS"]), areaController.updateArea);
router.post("/areas/:id/delete", checkAuth(["MANAGE_AREAS"]), areaController.deleteArea);

//Gestionar Trabajadores
router.get("/trabajadores", checkAuth(["VIEW_TRABAJADORES"]), trabajadoresController.list);
router.get("/trabajadores/new", checkAuth(["MANAGE_TRABAJADORES"]), async (req, res) => {
  const areas = await trabajadoresController.getAreas();
  res.render("trabajadores/create", { areas, title: "Nuevo Trabajador" });
});
router.post("/trabajadores", checkAuth(["MANAGE_TRABAJADORES"]), trabajadoresController.create);
router.get("/trabajadores/:id/edit", checkAuth(["MANAGE_TRABAJADORES"]), trabajadoresController.edit);
router.post("/trabajadores/:id/update", checkAuth(["MANAGE_TRABAJADORES"]), trabajadoresController.update);
router.post("/trabajadores/:id/delete", checkAuth(["MANAGE_TRABAJADORES"]), trabajadoresController.delete);

// Gestionar Tipos de Componentes
router.get("/componentTypes", checkAuth(["VIEW_COMPONENT_TYPES"]), componentTypeController.list);
router.get("/componentTypes/new", checkAuth(["MANAGE_COMPONENT_TYPES"]), componentTypeController.showCreateForm);
router.post("/componentTypes", checkAuth(["MANAGE_COMPONENT_TYPES"]), componentTypeController.create);
router.get("/componentTypes/:id/edit", checkAuth(["MANAGE_COMPONENT_TYPES"]), componentTypeController.showEditForm);
router.post("/componentTypes/:id/update", checkAuth(["MANAGE_COMPONENT_TYPES"]), componentTypeController.update);
router.post("/componentTypes/:id/delete", checkAuth(["MANAGE_COMPONENT_TYPES"]), componentTypeController.delete);

//Gestionar Componentes
router.get('/component/modelos/:id', componentController.getModelosByMarca);
router.get("/component", checkAuth(["VIEW_COMPONENT"]), componentController.list);
router.get("/component/new", checkAuth(["MANAGE_COMPONENTS"]),componentController.showCreateForm);
router.post("/component", checkAuth(["MANAGE_COMPONENTS"]), componentController.create);
router.get("/component/:id/edit", checkAuth(["MANAGE_COMPONENTS"]), componentController.edit);
router.post("/component/:id/update", checkAuth(["MANAGE_COMPONENTS"]), componentController.update);
router.post("/component/:id/delete", checkAuth(["MANAGE_COMPONENTS"]), componentController.delete);

module.exports = router;

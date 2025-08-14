const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboardController");
const userController = require("../controllers/userController");
const rolesController = require("../controllers/rolesController");
const permissionsController = require("../controllers/permissionsController");
const brandController = require("../controllers/brandController");
const areaController = require("../controllers/areaController");
const trabajadoresController = require("../controllers/trabajadoresController");
const componentTypeController = require("../controllers/componentTypeController");
const componentController = require("../controllers/componentController");
const peripheralsTypesController = require("../controllers/peripheralsTypesController");
const peripheralsController = require("../controllers/peripheralsController");
const deviceController = require("../controllers/deviceController");
const incidenciasController = require("../controllers/incidenciasController");
const sellosController = require("../controllers/sellosController");
const partespiezasController = require("../controllers/partespiezasController");
const auditoriaController = require("../controllers/auditoriaController");
const aboutController = require("../controllers/aboutController");

const { checkAuth } = require("../middleware/auth");

// Dashboard
router.get("/", 
  checkAuth(["VIEW_DASHBOARD"]),
  dashboardController.loadWidgetPreferences,
  dashboardController.showDashboard
);
router.post("/save-widgets", checkAuth(["VIEW_DASHBOARD"]), dashboardController.saveWidgetPreferences);

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
router.get("/component", checkAuth(["VIEW_COMPONENT"]), componentController.list);
router.get("/component/new", checkAuth(["MANAGE_COMPONENTS"]),componentController.showCreateForm);
router.post("/component", checkAuth(["MANAGE_COMPONENTS"]), componentController.create);
router.get("/component/:id/edit", checkAuth(["MANAGE_COMPONENTS"]), componentController.edit);
router.post("/component/:id/update", checkAuth(["MANAGE_COMPONENTS"]), componentController.update);
router.post("/component/:id/delete", checkAuth(["MANAGE_COMPONENTS"]), componentController.delete);

// Gestionar Tipos de Perifericos
router.get("/peripheralsTypes", checkAuth(["VIEW_PERIPHERALS_TYPES"]), peripheralsTypesController.list);
router.get("/peripheralsTypes/new", checkAuth(["MANAGE_PERIPHERALS_TYPES"]), peripheralsTypesController.showCreateForm);
router.post("/peripheralsTypes", checkAuth(["MANAGE_PERIPHERALS_TYPES"]), peripheralsTypesController.create);
router.get("/peripheralsTypes/:id/edit", checkAuth(["MANAGE_PERIPHERALS_TYPES"]), peripheralsTypesController.showEditForm);
router.post("/peripheralsTypes/:id/update", checkAuth(["MANAGE_PERIPHERALS_TYPES"]), peripheralsTypesController.update);
router.post("/peripheralsTypes/:id/delete", checkAuth(["MANAGE_PERIPHERALS_TYPES"]), peripheralsTypesController.delete);

// Gestionar Perifericos
router.get("/peripherals", checkAuth(["VIEW_PERIPHERALS"]), peripheralsController.list);
router.get("/peripherals/new", checkAuth(["MANAGE_PERIPHERALS"]), peripheralsController.showCreateForm);
router.post("/peripherals", checkAuth(["MANAGE_PERIPHERALS"]), peripheralsController.create);
router.get("/peripherals/:id/edit", checkAuth(["MANAGE_PERIPHERALS"]), peripheralsController.edit);
router.post("/peripherals/:id/update", checkAuth(["MANAGE_PERIPHERALS"]), peripheralsController.update);
router.post("/peripherals/:id/delete", checkAuth(["MANAGE_PERIPHERALS"]), peripheralsController.delete);

// Gestionar dispositivos
router.get("/device", checkAuth(["VIEW_DEVICES"]), deviceController.list);
router.get("/device/new", checkAuth(["MANAGE_DEVICES"]), deviceController.showCreateForm);
router.post("/device", checkAuth(["MANAGE_DEVICES"]), deviceController.create);
router.get("/device/:id/edit", checkAuth(["MANAGE_DEVICES"]), deviceController.edit);
router.post("/device/:id/update", checkAuth(["MANAGE_DEVICES"]), deviceController.update);
router.post("/device/:id/delete", checkAuth(["MANAGE_DEVICES"]), deviceController.delete);
router.get("/device/:id", checkAuth(["VIEW_DEVICES"]), deviceController.showDetails);
router.get("/device/:id/incidencia", checkAuth(["MANAGE_DEVICES"]), deviceController.showIncidenciaForm);
router.post("/device/:id/incidencia", checkAuth(["MANAGE_DEVICES"]), deviceController.createIncidencia);
router.get("/device/:id/exp_tecnico_pdf", checkAuth(["MANAGE_DEVICES"]), deviceController.generateExpTecnicoPdf);
// Asignación
router.post("/device/:id/assign/component", checkAuth(["MANAGE_DEVICES"]), deviceController.assignComponent);
router.post("/device/:id/assign/peripheral", checkAuth(["MANAGE_DEVICES"]), deviceController.assignPeripheral);
// Desasignación
router.post("/device/:id/unassign/component/:componentId", checkAuth(["MANAGE_DEVICES"]), deviceController.unassignComponent);
router.post("/device/:id/unassign/peripheral/:peripheralId", checkAuth(["MANAGE_DEVICES"]), deviceController.unassignPeripheral);

// Gestión de incidencias
router.get("/incidencias", checkAuth(["VIEW_INCIDENCES"]), incidenciasController.list);
router.post("/incidencias/:id/delete", checkAuth(["MANAGE_INCIDENCES"]), incidenciasController.delete);
router.get("/incidencias/registro_incidencia_pdf", checkAuth(["VIEW_INCIDENCES"]), incidenciasController.generateRegistroIncidenciaPdf);

// Gestión de sellos
router.get("/sellos", checkAuth(["VIEW_SELLOS"]), sellosController.list);
router.post("/sellos/:id/delete", checkAuth(["MANAGE_SELLOS"]), sellosController.delete);

// Ver registro de partes y piezas
router.get("/partespiezas", checkAuth(["VIEW_PARTESPIEZAS"]), partespiezasController.list);
router.get("/partespiezas/registro_partes_piezas_pdf", checkAuth(["VIEW_PARTESPIEZAS"]), partespiezasController.generatePartesPiezasPdf);

// Ver registro de auditoria
router.get("/auditoria", checkAuth(["VIEW_AUDITORIA"]), auditoriaController.list);
router.get("/auditoria/pdf", checkAuth(["VIEW_AUDITORIA"]), auditoriaController.pdf);

// Ver Acerca de
router.get("/about", aboutController.aboutPage);

module.exports = router;

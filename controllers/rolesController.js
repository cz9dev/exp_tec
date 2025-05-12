const User = require("../models/userModel").default;
const Role = require("../models/roleModel");
const Permission = require("../models/permissionModel"); // Asegúrate de que tengas este modelo

module.exports = {
  // Roles
  listRoles: async (req, res) => {
    try {
      const roles = await Role.findAll();
      res.render("roles/list", {
        title: "Roles",
        user: req.session.user,
        roles,
      });
    } catch (error) {
      console.log("Error en listUsers:", error);
      res.status(500).send("Error interno");
    }
  },

  // Nueva función para ver permisos de un rol
  roleDetails: async (req, res) => {
    try {
      const roleId = req.params.id;
      const role = await Role.findWithPermissions(roleId);

      if (!role) {
        res.status(404).send("Rol no encontrado");
        return;
      }

      res.render("roles/details", {
        title: `Permisos de ${role.nombre}`,
        user: req.session.user,
        role,
      });
    } catch (error) {
      console.log("Error en roleDetails:", error);
      res.status(500).send("Error interno");
    }
  },

  showAddPermissionForm: async (req, res) => {
    try {
      const roleId = req.params.id;
      const role = await Role.findByPk(roleId); // Usa findByPk para buscar por ID
      const permissions = await Permission.findAll();

      if (!role) {
        return res.status(404).send("Rol no encontrado");
      }

      res.render("roles/addPermission", {
        title: `Agregar Permiso a ${role.nombre}`,
        role,
        permissions,
        user: req.session.user,
      });
    } catch (error) {
      console.error("Error en showAddPermissionForm:", error);
      res.status(500).send("Error interno");
    }
  },

  addPermission: async (req, res) => {
    var roleId;
    try {
      roleId = req.params.id;
      const permissionId = req.body.permissionId;

      const result = await Role.addRolePermission(roleId, permissionId);

      if (result.success) {
        req.flash("success_msg", "Permiso agregado correctamente.");
      } else if (result.error) {
        req.flash("error_msg", "El permiso ya se encuentra asignado");
      } else {
        req.flash("error_msg", "Error desconocido");
      }

      res.redirect(`/dashboard/roles/${roleId}`); // Redirect to role details
    } catch (error) {
      console.error("Error en addPermission:", error);
      req.flash("error_msg", "Error al agregar el permiso.");
      res.redirect(`/dashboard/roles/${roleId}/permisos/nuevo`);
    }
  },

  deletePermission: async (req, res) => {
    try {
      const roleId = req.params.roleId;
      const permissionId = req.params.permissionId;

      const result = await Role.deleteRolePermission(roleId, permissionId);

      if (result.success) {
        req.flash("success_msg", "Permiso eliminado correctamente.");
      } else {
        req.flash("error_msg", "Error al eliminar el permiso.");
      }

      res.redirect(`/dashboard/roles/${roleId}`);
    } catch (error) {
      console.error("Error in deletePermission:", error);
      req.flash("error_msg", "Error al eliminar el permiso.");
      res.redirect(`/dashboard/roles/${roleId}`);
    }
  },
};

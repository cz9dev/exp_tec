// permissionsController.js

const Permissions = require("../models/permissionModel");

module.exports = {
  // Listar permisos
  listPermissions: async (req, res) => {
    try {
      const permissions = await Permissions.findAll();
      res.render("permissions/list", {
        permissions,
        title: "Permisos",
        user: req.session.user,
      });
    } catch (error) {
      console.error("Error en listPermissions:", error);
      res.status(500).send("Error interno del servidor");
    }
  },
  showCreateForm: (req, res) => {
    res.render("permissions/create", {
      title: "Permisos",
      user: req.session.user,
    });
  },
  createPermission: async (req, res) => {
    try {
      const { nombre, descripcion, ruta } = req.body;
      await Permissions.create({ nombre, descripcion, ruta });
      req.flash("success_msg", "Permiso creado exitosamente.");
      res.redirect("/dashboard/permissions");
    } catch (error) {
      console.error("Error al crear permiso:", error);
      req.flash("error_msg", "Error al crear el permiso.");
      res.redirect("/dashboard/permissions");
    }
  },
  showEditForm: async (req, res) => {
    try {
      const permission = await Permissions.findById(req.params.id);
      if (!permission) {
        req.flash("error_msg", "Permiso no encontrado.");
        return res.redirect("/dashboard/permissions");
      }
      res.render("permissions/edit", {
        permission,
        title: "Permisos",
        user: req.session.user,
      });
    } catch (error) {
      console.error("Error al obtener permiso:", error);
      req.flash("error_msg", "Error al obtener el permiso.");
      res.redirect("/dashboard/permissions");
    }
  },
  updatePermission: async (req, res) => {
    try {
      const { nombre, descripcion, ruta } = req.body;
      await Permissions.update(req.params.id, { nombre, descripcion, ruta });
      req.flash("success_msg", "Permiso actualizado exitosamente.");
      res.redirect("/dashboard/permissions");
    } catch (error) {
      console.error("Error al actualizar permiso:", error);
      req.flash("error_msg", "Error al actualizar el permiso.");
      res.redirect("/dashboard/permissions");
    }
  },
  deletePermission: async (req, res) => {
    try {
      await Permissions.delete(req.params.id);
      req.flash("success_msg", "Permiso eliminado exitosamente.");
      res.redirect("/dashboard/permissions");
    } catch (error) {
      console.error("Error al eliminar permiso:", error);
      req.flash("error_msg", "Error al eliminar el permiso.");
      res.redirect("/dashboard/permissions");
    }
  },
};

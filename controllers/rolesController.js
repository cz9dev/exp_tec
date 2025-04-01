const User = require("../models/userModel");
const Role = require("../models/roleModel");

module.exports = {
  // Usuarios
  listUsers: async (req, res) => {
    try {
      const users = await User.findAll();
      res.render("users/list", {
        title: "Exp - Tec Usuarios",
        user: req.session.user,
        users,
      });
    } catch (error) {
      console.log("Error en listUsers:", error);
      res.status(500).send("Error interno");
    }
  },

  showCreateForm: async (req, res) => {
    try {
      const roles = await Role.findAll();
      res.render("users/create", {
        title: "Exp - Tec Crear Usuarios",
        roles,
        user: req.session.user,
      });
    } catch (error) {
      console.error(error);      
    }
  },

  createUser: async (req, res) => {
    try {
      const { username, email, password, roles } = req.body;

      const userId = await User.create({
        username,
        email,
        password,
      });

      if (roles && roles.length) {
        await User.setUserRoles(userId, Array.isArray(roles) ? roles : [roles]);
      }

      req.flash("success_msg", "Usuario creado exitosamente");
      res.redirect("users");
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Error al crear usuario");      
    }
  },

  deleteUser: async (req, res) => {
    try {      
      await User.deleteUserRoles(req.params.id)
      await User.delete(req.params.id);
      
      req.flash("success_msg", "Usuario eliminado exitosamente");
      return res.redirect("../");
      
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Error al eliminar el usuario");      
    }
  },

  showEditForm: async (req, res) => {
    try {
      const uedit = await User.findById(req.params.id);
      const roles = await Role.findAll();
      const userRoles = await User.getUserRoles(req.params.id);

      if (!uedit) {
        return res.redirect("users");
      }

      res.render("users/edit", {
        title: "Exp-Tec Editar Usuario",
        uedit,
        roles,
        userRoles: userRoles.map((r) => r.rol_id),
        user: req.session.user,
      });
    } catch (error) {
      console.error(error);
    }
  },

  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { username, email, password, nombre, apellido, roles } = req.body;

      await User.update(id, {
        username,
        email,
        ...(password && { password }), // Solo actualiza password si se proporciona
        nombre,
        apellido,
      });

      await User.setUserRoles(id, Array.isArray(roles) ? roles : [roles]);

      req.flash("success_msg", "Usuario actualizado exitosamente");
      return res.redirect("../");

    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Error al actualizar usuario");      
    }
  },

  // Usuarios
  listPermissions: async (req, res) => {
    try {
      const permmisions = await User.findAll();
      res.render("permissions/list", {
        permmisions,
        title: "Exp-Tec Permisos",
        user: req.session.user,
      });
    } catch (error) {
      console.log(error);
      res.status(500).render("error", { message: "Error al listar permisos" });
    }
  },

  // Roles y permisos
  listRoles: async (req, res) => {
    try {
      const roles = await Role.findAll();
      res.render("roles/list", {
        title: "Exp-Tec Roles",
        user: req.session.user,
        roles,
      });
    } catch (error) {
      console.log("Error en listUsers:", error);
      res.status(500).send("Error interno");
    }
  },
};

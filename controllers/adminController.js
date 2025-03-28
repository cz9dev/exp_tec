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
      const roles = await User.getRoles();
      res.render("users/create", {
        roles,
        user: req.session.user,
      });
    } catch (error) {
      console.error(error);
      res.redirect("users/list");
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
      res.redirect("users/list");
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Error al crear usuario");
      res.redirect("users/new");
    }
  },

  showEditForm: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const roles = await User.getRoles();
      const userRoles = await User.getUserRoles(req.params.id);

      if (!user) {
        return res.redirect("users/lists");
      }

      res.render("users/edit", {
        user,
        roles,
        userRoles: userRoles.map((r) => r.rol_id),
        user: req.session.user,
      });
    } catch (error) {
      console.error(error);
      res.redirect("users/lists");
    }
  },

  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { username, email, password, roles } = req.body;

      await User.update(id, {
        username,
        email,
        ...(password && { password }), // Solo actualiza password si se proporciona
      });

      await User.setUserRoles(id, Array.isArray(roles) ? roles : [roles]);

      req.flash("success_msg", "Usuario actualizado exitosamente");
      res.redirect("users/list");
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Error al actualizar usuario");
      res.redirect(`users/list/${req.params.id}/edit`);
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

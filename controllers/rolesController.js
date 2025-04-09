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
        user: req.session.user,
      });
    } catch (error) {
      console.log("Error en roleDetails:", error);
      res.status(500).send("Error interno");
    }
  },
};

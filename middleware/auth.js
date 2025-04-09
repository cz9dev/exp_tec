const pool = require("../config/db");
const User = require("../models/userModel");
//const { checkAuth } = require("../middleware/auth");

function checkAuth(
  requiredPermissions = [],
  flashMessage = "No tienes permisos para acceder a esta sección."
) {
  return async (req, res, next) => {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    try {
      // Verificar si el usuario existe
      const user = await User.findById(req.session.user.id);
      if (!user) {
        req.flash(
          "error",
          "Usuario no encontrado. Por favor, inicia sesión de nuevo."
        );
        return res.redirect("/login");
      }

      // Obtener permisos del usuario desde la base de datos
      const [permissions] = await pool.execute(
        `
        SELECT p.nombre FROM permisos p
        JOIN roles_permisos rp ON p.id = rp.permiso_id
        JOIN usuarios_roles ur ON rp.rol_id = ur.rol_id
        WHERE ur.usuario_id = ?
      `,
        [req.session.user.id]
      );

      const userPermissions = permissions.map((p) => p.nombre) || []; // Manejo de caso donde no hay permisos

      // Verificar permisos necesarios
      const hasPermission = requiredPermissions.every((p) =>
        userPermissions.includes(p)
      );

      if (!hasPermission) {
        req.flash("error_msg", flashMessage);
        return res.redirect("/dashboard"); // Redirigir a una página segura
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Error en checkAuth:", error);
      req.flash(
        "error",
        "Error al verificar permisos. Por favor, contacta al administrador."
      );
      return res.redirect("/dashboard"); // Redirigir a una página segura
    }
  };
}

module.exports = { checkAuth };

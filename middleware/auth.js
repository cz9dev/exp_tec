const pool = require("../config/db");
const User = require("../models/userModel");

async function getUserPermissions(userId) {
  try {
    const [permissions] = await pool.execute(
      `SELECT p.nombre FROM permisos p
       JOIN roles_permisos rp ON p.id = rp.permiso_id
       JOIN usuarios_roles ur ON rp.rol_id = ur.rol_id
       WHERE ur.usuario_id = ?`,
      [userId]
    );
    return permissions.map((p) => p.nombre);
  } catch (error) {
    console.error("Error al obtener permisos:", error);
    return [];
  }
}

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

      // Obtener permisos del usuario
      const userPermissions = await getUserPermissions(req.session.user.id);

      // Almacenar permisos en la sesión para usar en las vistas
      req.session.user.permissions = userPermissions;
      res.locals.user = {
        ...req.session.user,
        permissions: userPermissions,
      };

      // Verificar permisos necesarios
      const hasPermission = requiredPermissions.every((p) =>
        userPermissions.includes(p)
      );

      if (!hasPermission) {
        req.flash("error_msg", flashMessage);
        return res.redirect("/dashboard");
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Error en checkAuth:", error);
      req.flash(
        "error",
        "Error al verificar permisos. Por favor, contacta al administrador."
      );
      return res.redirect("/dashboard");
    }
  };
}

module.exports = {
  checkAuth,
  getUserPermissions, // Exportamos también para usarlo en el login
};

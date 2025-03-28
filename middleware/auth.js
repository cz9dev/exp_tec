const pool = require("../config/db");
const User = require("../models/userModel"); // Importación añadida

function checkAuth(requiredPermissions = []) {
  return async (req, res, next) => {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    try {
      // Verificar si el usuario existe
      const user = await User.findById(req.session.user.id);
      if (!user) {
        return res.redirect("/login");
      }

      // Verificar permisos del usuario
      const [permissions] = await pool.execute(
        `
        SELECT p.nombre FROM permisos p
        JOIN roles_permisos rp ON p.id = rp.permiso_id
        JOIN usuarios_roles ur ON rp.rol_id = ur.rol_id
        WHERE ur.usuario_id = ?
      `,
        [req.session.user.id]
      );

      const userPermissions = permissions.map((p) => p.nombre);      

      if (
        requiredPermissions.length > 0 &&
        !requiredPermissions.some((p) => userPermissions.includes(p))
      ) {
        return res.status(403).render("error", {
          message: "Acceso no autorizado",
          layout: false,
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Error en checkAuth:", error);
      next(error);
    }
  };
}

module.exports = { checkAuth }; // Exportación nombrada

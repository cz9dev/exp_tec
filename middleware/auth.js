function checkAuth(requiredPermissions = []) {
  return async (req, res, next) => {
    if (!req.session.userId) {
      return res.redirect("/login");
    }

    try {
      // Verificar permisos del usuario
      const [permissions] = await pool.execute(
        `
        SELECT p.nombre FROM permisos p
        JOIN roles_permisos rp ON p.id = rp.permiso_id
        JOIN usuarios_roles ur ON rp.rol_id = ur.rol_id
        WHERE ur.usuario_id = ?
      `,
        [req.session.userId]
      );

      const userPermissions = permissions.map((p) => p.nombre);
      console.log("este es el valor de userPermissions " + userPermissions);

      if (
        requiredPermissions.length > 0 &&
        !requiredPermissions.some((p) => userPermissions.includes(p))
      ) {
        return res.status(403).render("error", {
          message: "Acceso no autorizado",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = { checkAuth }; // Exportación nombrada

const pool = require("../config/db");

class Role {
  /**
   * Buscar todos los roles
   * @returns
   */
  static async findAll() {
    const [roles] = await pool.query("SELECT * FROM roles");
    return roles;
  }

  /**
   * Buscar permisos de un rol
   * @param {*} roleId
   * @returns
   */
  static async findWithPermissions(roleId) {
    try {
    const [role] = await pool.query("SELECT * FROM roles WHERE id = ?", [
      roleId,
    ]);

    if (role.length === 0) {
      return null;
    }

    const [permissions] = await pool.query(
      `
      SELECT p.* FROM permisos p
      JOIN roles_permisos rp ON p.id = rp.permiso_id
      WHERE rp.rol_id = ?
    `,
      [roleId]
    );

    return {
      ...role[0],
      permissions: permissions || [],
    };
    } catch (error) {
      console.error("Error en findWithPermissions:", error);
      return null;
    }
  }
}

module.exports = Role; // Exportación correcta

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
  async findWithPermissions(roleId) {
    const [role] = await pool.query("SELECT * FROM roles WHERE id = ?", [
      roleId,
    ]);
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
      permissions,
    };
  }
}

module.exports = Role; // Exportación correcta

const pool = require("../config/db");

class Role {
  static async findAllWithPagination(limit, offset, whereClause = "") {
    const [rows] = await pool.execute(
      `
      SELECT * FROM roles
      ${whereClause}
      LIMIT ? OFFSET ?
    `,
      [limit, offset]
    );
    return rows;
  }

  static async count(whereClause = "") {
    const [[{ count }]] = await pool.execute(
      `SELECT COUNT(*) AS count FROM roles ${whereClause}`
    );
    return count;
  }

  /**
   * Buscar todos los roles
   * @returns
   */
  static async findAll() {
    const [roles] = await pool.query("SELECT * FROM roles");
    return roles;
  }

  static async findByPk(id) {
    const [role] = await pool.query("SELECT * FROM roles WHERE id = ?", [id]);
    return role[0]; // return the single role object or null if not found
  }

  static async addRolePermission(id_rol, id_permiso) {
    try {
      const [existingPermission] = await pool.query(
        "SELECT * FROM roles_permisos WHERE rol_id = ? AND permiso_id = ?",
        [id_rol, id_permiso]
      );

      if (existingPermission.length > 0) {
        return { error: true };
      }

      await pool.query(
        "INSERT INTO roles_permisos (rol_id, permiso_id) VALUES (?,?)",
        [id_rol, id_permiso]
      );

      return { success: true };
    } catch (error) {
      console.error("Error al agregar permisos al rol:", error);
      return null;
    }
  }

  static async deleteRolePermission(roleId, permissionId) {
    try {
      const result = await pool.query(
        "DELETE FROM roles_permisos WHERE rol_id = ? AND permiso_id = ?",
        [roleId, permissionId]
      );
      if (result[0].affectedRows > 0) {
        return { success: true };
      } else {
        return { success: false };
      }
    } catch (error) {
      console.error("Error deleting role permission:", error);
      return { success: false };
    }
  }

  static async countPermisos(whereClause = "") {
    const query = `SELECT COUNT(*) AS count FROM permisos p
        JOIN roles_permisos rp ON p.id = rp.permiso_id
        ${whereClause}`;

    const [[{ count }]] = await pool.query(query);

    return count;
  }

  static async findAllWithPaginationPermisos(roleId, limit, offset, whereClause = "") {
    try {
      const [role] = await pool.query("SELECT * FROM roles WHERE id = ?", [
        roleId,
      ]);

      if (role.length === 0) {
        return null;
      }

      const [permissions] = await pool.query(
        `SELECT p.* FROM permisos p
        JOIN roles_permisos rp ON p.id = rp.permiso_id
        ${whereClause}
        LIMIT ? OFFSET ?`,
        [limit, offset]
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

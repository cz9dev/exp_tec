const pool = require("../config/db");

class Permission {
  /**
   * Crear permiso
   * @param {*} param0 
   * @returns 
   */
  static async create({ nombre, descripcion }) {
    const [result] = await pool.execute(
      "INSERT INTO permisos (nombre, descripcion) VALUES (?, ?)",
      [nombre, descripcion]
    );
    return result.insertId;
  }

  /**
   * Encontrar permiso por ID
   * @param {*} id 
   * @returns 
   */
  static async findById(id) {
    const [rows] = await pool.execute(
      "SELECT * FROM permisos WHERE id = ?",
      [id]
    );
    return rows[0];
  }

  /**
   * Encontrar permiso por nombre
   * @param {*} nombre 
   * @returns 
   */
  static async findByNombre(nombre) {
    const [rows] = await pool.execute(
      "SELECT * FROM permisos WHERE nombre = ?",
      [nombre]
    );
    return rows[0];
  }

  /**
   * Listar todos los permisos
   * @returns 
   */
  static async findAll() {
    const [permissions] = await pool.execute(
      "SELECT * FROM permisos"
    );
    return permissions;
  }

  /**
   * Actualizar permiso
   * @param {*} id 
   * @param {*} permission 
   */
  static async update(id, permission) {
    const { nombre, descripcion } = permission;
    await pool.execute(
      "UPDATE permisos SET nombre = ?, descripcion = ? WHERE id = ?",
      [nombre, descripcion, id]
    );
  }

  /**
   * Eliminar permiso
   * @param {*} id 
   */
  static async delete(id) {
    await pool.execute(
      "DELETE FROM permisos WHERE id = ?",
      [id]
    );
  }

  /**
   * Asignar permiso a un rol
   * @param {*} permissionId 
   * @param {*} roleId 
   */
  static async assignToRole(permissionId, roleId) {
    await pool.execute(
      "INSERT INTO role_permission (permission_id, role_id) VALUES (?, ?)",
      [permissionId, roleId]
    );
  }

  /**
   * Quitar permiso de un rol
   * @param {*} permissionId 
   * @param {*} roleId 
   */
  static async removeFromRole(permissionId, roleId) {
    await pool.execute(
      "DELETE FROM role_permission WHERE permission_id = ? AND role_id = ?",
      [permissionId, roleId]
    );
  }

  /**
   * Obtener permisos de un rol
   * @param {*} roleId 
   * @returns 
   */
  static async getRolePermissions(roleId) {
    const [permissions] = await pool.execute(
      "SELECT p.* FROM permisos p JOIN role_permission rp ON p.id = rp.permission_id WHERE rp.role_id = ?",
      [roleId]
    );
    return permissions;
  }
}

module.exports = Permission;

const bcrypt = require("bcryptjs");
const pool = require("../config/db");

class User {
  /**
   * Crear usuarios
   * @param {*} param0
   * @returns
   */
  static async create({ username, email, nombre, apellido, password }) {
    const hash = await bcrypt.hash(password, 12);
    const [result] = await pool.execute(
      "INSERT INTO usuarios (username, email, nombre, apellido, password_hash) VALUES (?, ?, ?, ?, ?)",
      [username, email, nombre, apellido, hash]
    );
    return result.insertId;
  }

  /**
   * Crear usuarios
   * @param {*} param0
   * @returns
   */
  static async createA(user) {
    const { username, email, password } = user;
    const [result] = await pool.query(
      "INSERT INTO usuarios (username, email, password_hash) VALUES (?, ?, ?)",
      [username, email, password]
    );
    return result.insertId;
  }

  /**
   * Buscar usuarios por email
   * @param {*} email
   * @returns
   */
  static async findByEmail(email) {
    const [rows] = await pool.execute(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );
    return rows[0];
  }

  /**
   * verificar Contraseña del usuario
   * @param {*} user
   * @param {*} password
   * @returns
   */
  static async verifyPassword(user, password) {
    if (!user || !user.password_hash) return false;
    return await bcrypt.compare(password, user.password_hash);
  }

  /**
   * Buscar usuario dado un id
   * @param {*} id
   * @returns
   */
  static async findById(id) {
    const [rows] = await pool.execute("SELECT * FROM usuarios WHERE id = ?", [
      id,
    ]);
    return rows[0];
  }

  /**
   * Buscar todos los usuarios
   * @returns
   */
  static async findAll() {
    const [users] = await pool.query(`
      SELECT u.*, GROUP_CONCAT(r.nombre) as roles 
      FROM usuarios u
      LEFT JOIN usuarios_roles ur ON u.id = ur.usuario_id
      LEFT JOIN roles r ON ur.rol_id = r.id
      GROUP BY u.id
    `);
    return users;
  }

  /**
   * Actualizar Usuarios
   * @param {*} id
   * @param {*} user
   */
  static async update(id, user) {
    const { username, email, nombre, apellido, profile_image, password } = user;
    let sql = "UPDATE usuarios SET ";
    let params = [];

    if (username !== undefined) {
      sql += "username = ?, ";
      params.push(username);
    }
    if (email !== undefined) {
      sql += "email = ?, ";
      params.push(email);
    }
    if (nombre !== undefined) {
      sql += "nombre = ?, ";
      params.push(nombre);
    }
    if (apellido !== undefined) {
      sql += "apellido = ?, ";
      params.push(apellido);
    }
    if (profile_image !== undefined) {
      sql += "profile_image = ?, ";
      params.push(profile_image);
    }
    if (password !== undefined) {
      const hash = await bcrypt.hash(password, 12);
      sql += "password_hash = ?, ";
      params.push(hash);
    }

    // Eliminar la coma y el espacio al final de la sentencia SQL
    sql = sql.slice(0, -2);
    sql += " WHERE id = ?";
    params.push(id);

    await pool.query(sql, params);
  }

  /**
   * Borrar usuario
   * @param {*} id
   */
  static async delete(id) {
    await pool.query("DELETE FROM usuarios WHERE id = ?", [id]);
  }

  /**
   * Traer roles del usuario
   * @param {*} userId
   * @returns
   */
  static async getUserRoles(id) {
    const [rows] = await pool.query(
      "SELECT * FROM usuarios_roles WHERE usuario_id = ?",
      [id]
    );
    return rows;
  }

  /**
   * Borrar roles del usuario
   * @param {*} userId
   */
  static async deleteUserRoles(userId) {
    await pool.query("DELETE FROM usuarios_roles WHERE usuario_id = ?", [
      userId,
    ]);
  }

  /**
   * Asignar rol de usuario
   * @param {*} userId
   * @param {*} roles
   */
  static async setUserRoles(userId, roles) {
    await pool.query("DELETE FROM usuarios_roles WHERE usuario_id = ?", [
      userId,
    ]);

    for (const roleId of roles) {
      await pool.query(
        "INSERT INTO usuarios_roles (usuario_id, rol_id) VALUES (?, ?)",
        [userId, roleId]
      );
    }
  }
}

module.exports = User; // Exportación correcta

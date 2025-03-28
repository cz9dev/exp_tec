const bcrypt = require("bcryptjs");
const pool = require("../config/db");

class User {
  /**
   * Crear usuarios
   * @param {*} param0
   * @returns
   */
  static async create({ username, email, password }) {
    const hash = await bcrypt.hash(password, 12);
    const [result] = await pool.execute(
      "INSERT INTO usuarios (username, email, password_hash) VALUES (?, ?, ?)",
      [username, email, hash]
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
    const { username, email } = user;
    await pool.query(
      "UPDATE usuarios SET username = ?, email = ? WHERE id = ?",
      [username, email, id]
    );
  }

  /**
   * Borrar usuario
   * @param {*} id
   */
  static async delete(id) {
    await pool.query("DELETE FROM usuarios WHERE id = ?", [id]);
  }
}

module.exports = User; // Exportación correcta

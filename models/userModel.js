const bcrypt = require("bcryptjs");
const pool = require("../config/db");

class User {
  static async create({ username, email, password }) {
    const hash = await bcrypt.hash(password, 12);
    const [result] = await pool.execute(
      "INSERT INTO usuarios (username, email, password_hash) VALUES (?, ?, ?)",
      [username, email, hash]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await pool.execute(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );
    return rows[0];
  }

  static async verifyPassword(user, password) {
    if (!user || !user.password_hash) return false;
    return await bcrypt.compare(password, user.password_hash);
  }
}

module.exports = User; // Exportación correcta

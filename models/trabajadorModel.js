const pool = require('../config/db');

class TrabajadorModel {
  static async create(ci, nombres, apellidos, id_area) {
    try {
      const [result] = await pool.execute(
        "INSERT INTO trabajadores (ci, nombres, apellidos, id_area) VALUES (?, ?, ?, ?)",
        [ci, nombres, apellidos, id_area]
      );
      return result.insertId;
    } catch (error) {
      console.error("Error creando el trabajador:", error);
      throw error;
    }
  }

  static async findAllWithPagination(limit, offset, whereClause = "") {
    const [rows] = await pool.execute(
      `
      SELECT t.id, t.ci, t.nombres, t.apellidos, a.nombre AS area 
      FROM trabajadores t JOIN area a ON t.id_area = a.id
      ${whereClause}
      LIMIT ? OFFSET ?
    `,
      [limit, offset]
    );
    return rows;
  }

  static async count(whereClause = "") {
    const [[{ count }]] = await pool.execute(
      `SELECT COUNT(*) AS count FROM trabajadores t ${whereClause}`
    );
    return count;
  }

  static async findAll() {
    try {
      const [rows] = await pool.execute(
        "SELECT t.id, t.ci, t.nombres, t.apellidos, a.nombre AS area FROM trabajadores t JOIN area a ON t.id_area = a.id"
      );
      return rows;
    } catch (error) {
      console.error("Error buscando trabajadores:", error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        "SELECT t.id, t.ci, t.nombres, t.apellidos, a.nombre AS area, a.id AS id_area FROM trabajadores t JOIN area a ON t.id_area = a.id WHERE t.id = ?",
        [id]
      );
      return rows[0];
    } catch (error) {
      console.error("Error buscando trabajadores por ID:", error);
      throw error;
    }
  }

  static async update(id, ci, nombres, apellidos, id_area) {
    try {
      const [result] = await pool.execute(
        "UPDATE trabajadores SET ci = ?, nombres = ?, apellidos = ?, id_area = ? WHERE id = ?",
        [ci, nombres, apellidos, id_area, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error actualizando trabajadores:", error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.execute(
        "DELETE FROM trabajadores WHERE id = ?",
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error borrando trabajador:", error);
      throw error;
    }
  }
}

module.exports = TrabajadorModel;

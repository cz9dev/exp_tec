const pool = require("../config/db");

class AreaModel {

  static async findAllWithPagination(limit, offset, whereClause = "") {
    const [rows] = await pool.execute(
      `
      SELECT * FROM area
      ${whereClause}
      LIMIT ? OFFSET ?
    `,
      [limit, offset]
    );
    return rows;
  }

  static async count(whereClause = "") {
    const [[{ count }]] = await pool.execute(
      `SELECT COUNT(*) AS count FROM area ${whereClause}`
    );
    return count;
  }

  static async findAll() {
    const [rows] = await pool.query("SELECT * FROM area");
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query("SELECT * FROM area WHERE id = ?", [id]);
    return rows[0];
  }

  static async findOne(nombre) {
    const [rows] = await pool.query("SELECT * FROM area WHERE nombre = ?", [
      nombre,
    ]);
    return rows[0];
  }

  static async create(area) {
    const { nombre } = area;
    const [result] = await pool.query("INSERT INTO area (nombre) VALUES (?)", [
      nombre,
    ]);
    return result.insertId;
  }

  static async update(id, area) {
    const { nombre } = area;
    await pool.query("UPDATE area SET nombre = ? WHERE id = ?", [nombre, id]);
  }

  static async delete(id) {
    await pool.query("DELETE FROM area WHERE id = ?", [id]);
  }
}

module.exports = AreaModel;
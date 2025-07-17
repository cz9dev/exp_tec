const pool = require("../config/db"); // Ajusta la ruta según tu estructura

class Brand {

  static async findAllWithPagination(limit, offset, whereClause = "") {
    const [rows] = await pool.execute(
      `
      SELECT * FROM marca
      ${whereClause}
      LIMIT ? OFFSET ?
    `,
      [limit, offset]
    );
    return rows;
  }

  static async count(whereClause = "") {
    const [[{ count }]] = await pool.execute(
      `SELECT COUNT(*) AS count FROM marca d ${whereClause}`
    );
    return count;
  }

  static async findAll() {
    const [rows] = await pool.query("SELECT * FROM marca");
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query("SELECT * FROM marca WHERE id = ?", [id]);
    return rows[0];
  }

  static async findOne(marca) {
    const [rows] = await pool.query("SELECT * FROM marca WHERE marca = ?", [
      marca,
    ]);
    return rows[0];
  }

  static async create(brand) {
    const { marca } = brand;
    const [result] = await pool.query("INSERT INTO marca (marca) VALUES (?)", [
      marca,
    ]);
    return result.insertId;
  }

  static async update(id, brand) {
    const { marca } = brand;
    await pool.query("UPDATE marca SET marca = ? WHERE id = ?", [marca, id]);
  }

  static async delete(id) {
    await pool.query("DELETE FROM marca WHERE id = ?", [id]);
  }
}

module.exports = Brand;
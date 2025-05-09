const pool = require("../config/db"); // Ajusta la ruta según tu estructura

class Brand {
  static async findAll() {
    const [rows] = await pool.query("SELECT * FROM marca");
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query("SELECT * FROM marca WHERE id = ?", [id]);
    return rows[0];
  }

  static async findOne(marca) {
    const [rows] = await pool.query("SELECT * FROM marca WHERE marca = ?", [marca]);
    return rows[0];
  }

  static async create(brand) {
    const { marca } = brand;
    const [result] = await pool.query("INSERT INTO marca (marca) VALUES (?)", [marca]);
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
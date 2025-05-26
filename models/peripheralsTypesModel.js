const pool = require("../config/db");

class PeripheralsTypesModel {
  static async findAll() {
    const [rows] = await pool.query("SELECT * FROM tipo_periferico");
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query("SELECT * FROM tipo_periferico WHERE id = ?", [id]);
    return rows[0];
  }

  static async findOne(nombre) {
    const [rows] = await pool.query("SELECT * FROM tipo_periferico WHERE nombre = ?", [nombre]);
    return rows[0];
  }

  static async create(tipo_periferico) {
    const { nombre } = tipo_periferico;
    const [result] = await pool.query("INSERT INTO tipo_periferico (nombre) VALUES (?)", [nombre]);
    return result.insertId;
  }

  static async update(id, nombre) {
    //const { nombre } = nombre;
    await pool.query("UPDATE tipo_periferico SET nombre = ? WHERE id = ?", [nombre, id]);
  }

  static async delete(id) {
    await pool.query("DELETE FROM tipo_periferico WHERE id = ?", [id]);
  }
}

module.exports = PeripheralsTypesModel;
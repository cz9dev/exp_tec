const pool = require("../config/db");

class ComponentTypeModel {
  static async findAll() {
    const [rows] = await pool.query("SELECT * FROM tipo_componente");
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query("SELECT * FROM tipo_componente WHERE id = ?", [id]);
    return rows[0];
  }

  static async findOne(nombre) {
    const [rows] = await pool.query("SELECT * FROM tipo_componente WHERE nombre = ?", [nombre]);
    return rows[0];
  }

  static async create(tipo_componente) {
    const { nombre } = tipo_componente;
    const [result] = await pool.query("INSERT INTO tipo_componente (nombre) VALUES (?)", [nombre]);
    return result.insertId;
  }

  static async update(id, nombre) {
    //const { nombre } = nombre;
    await pool.query("UPDATE tipo_componente SET nombre = ? WHERE id = ?", [nombre, id]);
  }

  static async delete(id) {
    await pool.query("DELETE FROM tipo_componente WHERE id = ?", [id]);
  }
}

module.exports = ComponentTypeModel;
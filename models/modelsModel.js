const pool = require('../config/db');

class ModelModel {
  static async create(id_marca, modelo) {
    try {
      const [result] = await pool.execute(
        "INSERT INTO modelo (id_marca, modelo) VALUES (?, ?)",
        [id_marca, modelo]
      );
      return result.insertId;
    } catch (error) {
      console.error("Error creando modelo:", error);
      throw error;
    }
  }

  static async findAll() {
    try {
      const [rows] = await pool.execute(
        "SELECT m.id, m.modelo, ma.marca AS marca FROM modelo m JOIN marca ma ON m.id_marca = ma.id"
      );
      return rows;
    } catch (error) {
      console.error("Error buscando modelos:", error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        "SELECT m.id, m.modelo, ma.marca AS marca FROM modelo m JOIN marca ma ON m.id_marca = ma.id WHERE m.id = ?",
        [id]
      );
      return rows[0];
    } catch (error) {
      console.error("Error buscando modelo por ID:", error);
      throw error;
    }
  }

  static async findByIdMarca(id) {
    try {
      const [rows] = await pool.execute(
        "SELECT m.id, m.modelo, ma.marca AS marca, ma.id AS id_marca FROM modelo m JOIN marca ma ON m.id_marca = ma.id WHERE m.id_marca = ?",
        [id]
      );
      return rows;
    } catch (error) {
      console.error("Error buscando modelo por ID:", error);
      throw error;
    }
  }

  static async update(id, id_marca, modelo) {
    try {
      const [result] = await pool.execute(
        "UPDATE modelo SET id_marca = ?, modelo = ? WHERE id = ?",
        [id_marca, modelo, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error actualizando modelos:", error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.execute("DELETE FROM modelo WHERE id = ?", [
        id,
      ]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error borrando modelos:", error);
      throw error;
    }
  }
}

module.exports = ModelModel;

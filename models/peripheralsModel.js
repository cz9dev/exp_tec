const pool = require("../config/db");

class PeripheralsModel {
  static async create(id_marca, modelo, id_tipo_periferico, numero_serie) {
    try {
      const [result] = await pool.execute(
        "INSERT INTO periferico (id_marca, modelo, id_tipo_periferico, numero_serie) VALUES (?, ?, ?, ?)",
        [id_marca, modelo, id_tipo_periferico, numero_serie]
      );
      return result.insertId;
    } catch (error) {
      console.error("Error creando el periferico:", error);
      throw error;
    }
  }

  static async findAll() {
    try {
      const [rows] = await pool.execute(
        "SELECT p.id, p.id_marca, p.modelo, p.id_tipo_periferico, p.numero_serie, ma.marca, tp.nombre AS tipo_periferico FROM periferico p JOIN marca ma ON p.id_marca = ma.id JOIN tipo_periferico tp ON p.id_tipo_periferico = tp.id"
      );
      return rows;
    } catch (error) {
      console.error("Error buscando perifericos:", error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        "SELECT p.id, p.id_marca, p.modelo, p.id_tipo_periferico, p.numero_serie, ma.marca, tp.nombre AS tipo_periferico FROM periferico p JOIN marca ma ON p.id_marca = ma.id JOIN tipo_periferico tp ON p.id_tipo_periferico = tp.id WHERE p.id = ?",
        [id]
      );
      return rows[0];
    } catch (error) {
      console.error("Error buscando perifericos por ID:", error);
      throw error;
    }
  }

  static async update(
    id,
    id_marca,
    modelo,
    id_tipo_periferico,
    numero_serie,    
  ) {
    try {
      const [result] = await pool.execute(
        "UPDATE periferico SET id_marca = ?, modelo = ?, id_tipo_periferico = ?, numero_serie = ? WHERE id = ?",
        [id_marca, modelo, id_tipo_periferico, numero_serie, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error actualizando periferico:", error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.execute(
        "DELETE FROM periferico WHERE id = ?",
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error borrando periferico:", error);
      throw error;
    }
  }
}

module.exports = PeripheralsModel;

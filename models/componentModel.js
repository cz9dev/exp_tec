const pool = require("../config/db");

class ComponentModel {
  static async create(id_marca, id_modelo, id_tipo_componente, numero_serie) {
    try {
      const [result] = await pool.execute(
        "INSERT INTO componente (id_marca, id_modelo, id_tipo_componente, numero_serie) VALUES (?, ?, ?, ?)",
        [id_marca, id_modelo, id_tipo_componente, numero_serie]
      );
      return result.insertId;
    } catch (error) {
      console.error("Error creando el componente:", error);
      throw error;
    }
  }

  static async findAll() {
    try {
      const [rows] = await pool.execute(
        "SELECT c.id, c.id_marca, c.id_modelo, c.id_tipo_componente, c.numero_serie, ma.marca, mo.modelo, tc.nombre AS tipo_componente FROM componente c JOIN marca ma ON c.id_marca = ma.id JOIN modelo mo ON c.id_modelo = mo.id JOIN tipo_componente tc ON c.id_tipo_componente = tc.id"
      );
      return rows;
    } catch (error) {
      console.error("Error buscando componentes:", error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        "SELECT c.id, c.id_marca, c.id_modelo, c.id_tipo_componente, c.numero_serie, ma.marca, mo.modelo, tc.nombre AS tipo_componente FROM componente c JOIN marca ma ON c.id_marca = ma.id JOIN modelo mo ON c.id_modelo = mo.id JOIN tipo_componente tc ON c.id_tipo_componente = tc.id WHERE c.id = ?",
        [id]
      );
      return rows[0];
    } catch (error) {
      console.error("Error buscando componentes por ID:", error);
      throw error;
    }
  }

  static async update(
    id,
    id_marca,
    id_modelo,
    id_tipo_componente,
    numero_serie
  ) {
    try {
      const [result] = await pool.execute(
        "UPDATE componente SET id_marca = ?, id_modelo = ?, id_tipo_componente = ?, numero_serie = ? WHERE id = ?",
        [id_marca, id_modelo, id_tipo_componente, numero_serie, id]
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
        "DELETE FROM componente WHERE id = ?",
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error borrando componente:", error);
      throw error;
    }
  }
}

module.exports = ComponentModel;

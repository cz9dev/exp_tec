const pool = require("../config/db");

class ComponentModel {
  static async create(
    id_marca,
    modelo,
    id_tipo_componente,
    numero_serie,
    url_image
  ) {
    try {
      const [result] = await pool.execute(
        "INSERT INTO componente (id_marca, modelo, id_tipo_componente, numero_serie, url_image) VALUES (?, ?, ?, ?, ?)",
        [id_marca, modelo, id_tipo_componente, numero_serie, url_image]
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
        "SELECT c.id, c.id_marca, c.modelo, c.id_tipo_componente, c.numero_serie , c.url_image, ma.marca, tc.nombre AS tipo_componente FROM componente c JOIN marca ma ON c.id_marca = ma.id JOIN tipo_componente tc ON c.id_tipo_componente = tc.id"
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
        "SELECT c.id, c.id_marca, c.modelo, c.id_tipo_componente, c.numero_serie, c.url_image, ma.marca, tc.nombre AS tipo_componente FROM componente c JOIN marca ma ON c.id_marca = ma.id JOIN tipo_componente tc ON c.id_tipo_componente = tc.id WHERE c.id = ?",
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
    modelo,
    id_tipo_componente,
    numero_serie,
    url_image
  ) {
    try {
      // Construir la consulta SQL dinámicamente
      let sql =
        "UPDATE componente SET id_marca = ?, modelo = ?, id_tipo_componente = ?, numero_serie = ?";
      let params = [id_marca, modelo, id_tipo_componente, numero_serie];

      if (url_image !== null) {
        sql += ", url_image = ?";
        params.push(url_image);
      }

      sql += " WHERE id = ?";
      params.push(id);

      const [result] = await pool.execute(sql, params);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error actualizando componente:", error);
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

  static async findByDeviceId(deviceId) {
    try {
      const [rows] = await pool.execute(
        `SELECT c.id, c.modelo, c.numero_serie, tc.nombre AS tipo_componente, m.marca
         FROM componente c
         JOIN tipo_componente tc ON c.id_tipo_componente = tc.id
         JOIN dispositivo_componente dc ON c.id = dc.id_componente
         JOIN marca m ON c.id_marca = m.id
         WHERE dc.id_dispositivo = ?`,
        [deviceId]
      );
      return rows;
    } catch (error) {
      console.error("Error buscando componentes:", error);
      throw error;
    }
  }
}

module.exports = ComponentModel;

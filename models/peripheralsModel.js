const pool = require("../config/db");

class PeripheralsModel {
  static async create(
    id_marca,
    modelo,
    id_tipo_periferico,
    numero_serie,
    numero_inventario,
    url_image,
  ) {
    try {
      const [result] = await pool.execute(
        "INSERT INTO periferico (id_marca, modelo, id_tipo_periferico, numero_serie, numero_inventario, url_image) VALUES (?, ?, ?, ?, ?, ?)",
        [
          id_marca,
          modelo,
          id_tipo_periferico,
          numero_serie,
          numero_inventario,
          url_image,
        ],
      );
      return result.insertId;
    } catch (error) {
      console.error("Error creando el periferico:", error);
      throw error;
    }
  }

  static async findAllWithPagination(limit, offset, whereClause = "") {
    const [rows] = await pool.execute(
      `
      SELECT p.id, p.id_marca, p.modelo, p.id_tipo_periferico, p.numero_serie,
      p.numero_inventario, p.url_image, ma.marca, tp.nombre AS tipo_periferico
      FROM periferico p 
      JOIN marca ma ON p.id_marca = ma.id 
      JOIN tipo_periferico tp ON p.id_tipo_periferico = tp.id
      ${whereClause}
      LIMIT ? OFFSET ? AND WHERE deactivated_at IS NULL;
    `,
      [limit, offset],
    );
    return rows;
  }

  static async count(whereClause = "") {
    const [[{ count }]] = await pool.execute(
      `SELECT COUNT(*) AS count FROM periferico p ${whereClause}`,
    );
    return count;
  }

  static async findAll() {
    try {
      const [rows] = await pool.execute(
        "SELECT p.id, p.id_marca, p.modelo, p.id_tipo_periferico, p.numero_serie, p.numero_inventario, p.url_image, ma.marca, tp.nombre AS tipo_periferico FROM periferico p JOIN marca ma ON p.id_marca = ma.id JOIN tipo_periferico tp ON p.id_tipo_periferico = tp.id WHERE deactivated_at IS NULL;",
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
        "SELECT p.id, p.id_marca, p.modelo, p.id_tipo_periferico, p.numero_serie, p.numero_inventario, p.url_image, ma.marca, tp.nombre AS tipo_periferico FROM periferico p JOIN marca ma ON p.id_marca = ma.id JOIN tipo_periferico tp ON p.id_tipo_periferico = tp.id WHERE p.id = ? WHERE deactivated_at IS NULL;",
        [id],
      );
      return rows[0];
    } catch (error) {
      console.error("Error buscando perifericos por ID:", error);
      throw error;
    }
  }

  static async findOne(numero_serie) {
    const [rows] = await pool.query(
      "SELECT * FROM periferico WHERE numero_serie = ? AND deactivated_at IS NULL;",
      [numero_serie],
    );
    return rows[0];
  }

  static async update(
    id,
    id_marca,
    modelo,
    id_tipo_periferico,
    numero_serie,
    numero_inventario,
    url_image,
  ) {
    try {
      let sql =
        "UPDATE periferico SET id_marca = ?, modelo = ?, id_tipo_periferico = ?, numero_serie = ? , numero_inventario = ?";
      let params = [
        id_marca,
        modelo,
        id_tipo_periferico,
        numero_serie,
        numero_inventario,
      ];

      if (url_image !== null) {
        sql += ", url_image = ?";
        params.push(url_image);
      }

      sql += " WHERE id = ?";
      params.push(id);

      const [result] = await pool.execute(sql, params);
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
        [id],
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error borrando periferico:", error);
      throw error;
    }
  }

  static async deactivateAt(id) {
    const deactivate_at = new Date();
    const [result] = await pool.execute(
      "UPDATE periferico SET deactivated_at = ? WHERE id = ?",
      [deactivate_at, id],
    );
    return result.affectedRows > 0;
  }

  static async deleteAt(id) {
    const deleted_at = new Date();
    const [result] = await pool.execute(
      "UPDATE periferico SET deleted_at = ? WHERE id = ?",
      [deleted_at, id],
    );
    return result.affectedRows > 0;
  }

  static async findByDeviceId(deviceId) {
    try {
      const [rows] = await pool.execute(
        `SELECT p.id, p.modelo, p.numero_serie, tp.nombre AS tipo_periferico, m.marca, p.numero_inventario AS inventario
         FROM periferico p
         JOIN tipo_periferico tp ON p.id_tipo_periferico = tp.id
         JOIN dispositivo_periferico dp ON p.id = dp.id_periferico
         JOIN marca m ON p.id_marca = m.id
         WHERE dp.id_dispositivo = ? AND deactivated_at IS NULL;`,
        [deviceId],
      );
      return rows;
    } catch (error) {
      console.error("Error buscando periféricos:", error);
      throw error;
    }
  }
}

module.exports = PeripheralsModel;

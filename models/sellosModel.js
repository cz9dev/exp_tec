const pool = require("../config/db");
const moment = require("moment");
//const { param } = require("../routes/dashboard");

class SellosModel {
  static async create(
    sello,
    id_dispositivo,
    fecha_cambio,
    id_testigo,
    id_usuario
  ) {
    const [result] = await pool.execute(
      "INSERT INTO dispositivo_sello (sello, id_dispositivo, fecha_cambio, id_testigo, id_usuario) VALUES (?, ?, ?, ?, ?)",
      [sello, id_dispositivo, fecha_cambio, id_testigo, id_usuario]
    );    
    return result.affectedRows > 0;
  }

  static async findAll() {
    const [rows] = await pool.execute(`
      SELECT s.*, 
        d.nombre AS dispositivo_nombre, 
        u.nombre AS usuario_nombre, 
        t.nombres AS trabajador_nombre 
      FROM 
        dispositivo_sello s
      LEFT JOIN 
        dispositivo d ON s.id_dispositivo = d.id
      LEFT JOIN 
        usuarios u ON s.id_usuario = u.id
      LEFT JOIN 
        trabajadores t ON s.id_testigo = t.id
    `);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `
      SELECT s.*, 
        d.nombre AS dispositivo_nombre, 
        u.nombre AS usuario_nombre, 
        t.nombres AS trabajador_nombre 
      FROM 
        dispositivo_sello s
      LEFT JOIN 
        dispositivo d ON s.id_dispositivo = d.id
      LEFT JOIN 
        usuarios u ON s.id_usuario = u.id
      LEFT JOIN 
        trabajadores t ON s.id_testigo = t.id
      WHERE id = ?`,
      [id]
    );
    return rows[0];
  }

  static async countQuery(search) {
    let whereClause = "";
    let params = [];
    if (search) {
      whereClause = `WHERE sello LIKE ?`; // Ajusta los campos según tu tabla
      params = [`%${search}%`];
    }
    const countQuery = `SELECT COUNT(*) AS total FROM dispositivo_sello ${whereClause}`; // Corregido: incidencia (singular)

    const [countResult] = await pool.execute(countQuery, params);
    return countResult;
  }

  static async dataQuery(search, limit, offset) {
    let whereClause = "";
    let params = [];

    if (search) {
      whereClause = `WHERE sello LIKE ?`; // Ajusta los campos según tu tabla
      params = [`%${search}%`];
    }

    const dataQuery = `
      SELECT s.*, 
        d.nombre AS dispositivo_nombre, 
        u.nombre AS usuario_nombre, 
        t.nombres AS trabajador_nombre 
      FROM 
        dispositivo_sello s
      LEFT JOIN 
        dispositivo d ON s.id_dispositivo = d.id
      LEFT JOIN 
        usuarios u ON s.id_usuario = u.id
      LEFT JOIN 
        trabajadores t ON s.id_testigo = t.id
      ${whereClause} 
      LIMIT ${limit} OFFSET ${offset}
      `;

    const [dataResult] = await pool.execute(dataQuery, params);

    // Mapeamos los resultados y formateamos las fechas
    const formattedData = dataResult.map((sello) => ({
      ...sello,
      fecha_cambio: moment(sello.fecha_cambio).format(
        "MM/DD/YYYY hh:mm:ss A"
      ),
    }));

    return formattedData;
  }

  static async delete(id) {
    const [result] = await pool.execute("DELETE FROM dispositivo_sello WHERE id = ?", [
      id,
    ]);
    return result.affectedRows > 0;
  }
}

module.exports = SellosModel;

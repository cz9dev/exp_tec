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

  static async countQuery(search, fecha_inicio, fecha_fin) {
    let whereClause = "";
    let params = [];

    const conditions = [];
    if (search) {
      conditions.push("sello LIKE ?");
      params.push(`%${search}%`);
    }
    if (fecha_inicio) {
      conditions.push("DATE(fecha_cambio) >= ?");
      params.push(fecha_inicio);
    }
    if (fecha_fin) {
      conditions.push("DATE(fecha_cambio) <= ?");
      params.push(fecha_fin);
    }

    if (conditions.length > 0) {
      whereClause = "WHERE " + conditions.join(" AND ");
    }

    const countQuery = `SELECT COUNT(*) AS total FROM dispositivo_sello ${whereClause}`;

    console.log("countParams:", params); // imprimir parametros
    const [countResult] = await pool.execute(countQuery, params);
    return countResult;
  }

  static async dataQuery(search, fecha_inicio, fecha_fin, limit, offset) {
    let whereClause = "";
    let params = [];

    const conditions = [];
    if (search) {
      conditions.push("sello LIKE ?");
      params.push(`%${search}%`);
    }
    if (fecha_inicio) {
      conditions.push("DATE(fecha_cambio) >= ?");
      params.push(fecha_inicio);
    }
    if (fecha_fin) {
      conditions.push("DATE(fecha_cambio) <= ?");
      params.push(fecha_fin);
    }

    if (conditions.length > 0) {
      whereClause = "WHERE " + conditions.join(" AND ");
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
      fecha_cambio: moment(sello.fecha_cambio).format("MM/DD/YYYY hh:mm:ss A"),
    }));

    console.log("countParams:", params); // imprimir parametros

    return formattedData;
  }

  static async delete(id) {
    const [result] = await pool.execute(
      "DELETE FROM dispositivo_sello WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = SellosModel;

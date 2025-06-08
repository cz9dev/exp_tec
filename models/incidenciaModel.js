const pool = require("../config/db");
const moment = require('moment');
//const { param } = require("../routes/dashboard");


class IncidenciaModel {
  static async create(
    id_dispositivo,
    tipo_incidencia,
    fecha_incidencia,
    descripcion,
    id_usuario,
    resuelto,
    id_trabajador,
    conforme
  ) {
    const [result] = await pool.execute(
      "INSERT INTO incidencia (id_dispositivo, tipo_incidencia, fecha_incidencia, descripcion, id_usuario, resuelto, id_trabajador, conforme) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        id_dispositivo,
        tipo_incidencia,
        fecha_incidencia,
        descripcion,
        id_usuario,
        resuelto,
        id_trabajador,
        conforme,
      ]
    );
    //return result.insertId;
    return result.affectedRows > 0;
  }

  static async findAll() {
    const [rows] = await pool.execute(`
      SELECT i.*, 
        d.nombre AS dispositivo_nombre, 
        u.nombre AS usuario_nombre, 
        t.nombres AS trabajador_nombre 
      FROM 
        incidencia i
      LEFT JOIN 
        dispositivo d ON i.id_dispositivo = d.id
      LEFT JOIN 
        usuarios u ON i.id_usuario = u.id
      LEFT JOIN 
        trabajadores t ON i.id_trabajador = t.id
    `);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `
      SELECT 
        i.*, 
        d.nombre AS dispositivo_nombre, 
        u.nombre AS usuario_nombre, 
        t.nombres AS trabajador_nombre 
      FROM 
        incidencia i
      LEFT JOIN 
        dispositivo d ON i.id_dispositivo = d.id
      LEFT JOIN 
        usuarios u ON i.id_usuario = u.id
      LEFT JOIN 
        trabajadores t ON i.id_trabajador = t.id
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
      conditions.push("tipo_incidencia LIKE ? OR descripcion LIKE ?");
      params.push(`%${search}%`, `%${search}%`);
    }
    if (fecha_inicio) {
      conditions.push("DATE(fecha_incidencia) >= ?");
      params.push(fecha_inicio);
    }
    if (fecha_fin) {
      conditions.push("DATE(fecha_incidencia) <= ?");
      params.push(fecha_fin);
    }

    if (conditions.length > 0) {
      whereClause = "WHERE " + conditions.join(" AND ");
    }

    const countQuery = `SELECT COUNT(*) AS total FROM incidencia ${whereClause}`; // Corregido: incidencia (singular)

    const [countResult] = await pool.execute(countQuery, params);
    return countResult;
  }

  static async dataQuery(search, fecha_inicio, fecha_fin, limit, offset) {
    let whereClause = "";
    let params = [];

    const conditions = [];
    if (search) {
      conditions.push("(tipo_incidencia LIKE ? OR descripcion LIKE ?)");
      params.push(`%${search}%`, `%${search}%`);
    }
    if (fecha_inicio) {
      conditions.push("DATE(fecha_incidencia) >= ?");
      params.push(fecha_inicio);
    }
    if (fecha_fin) {
      conditions.push("DATE(fecha_incidencia) <= ?");
      params.push(fecha_fin);
    }

    if (conditions.length > 0) {
      whereClause = "WHERE " + conditions.join(" AND ");
    }

    const dataQuery = `
      SELECT 
        i.*, 
        d.nombre AS dispositivo_nombre, 
        u.nombre AS usuario_nombre, 
        t.nombres AS trabajador_nombre 
      FROM 
        incidencia i
      LEFT JOIN 
        dispositivo d ON i.id_dispositivo = d.id
      LEFT JOIN 
        usuarios u ON i.id_usuario = u.id
      LEFT JOIN 
        trabajadores t ON i.id_trabajador = t.id
      ${whereClause} 
      LIMIT ${limit} OFFSET ${offset}
      `;

    const [dataResult] = await pool.execute(dataQuery, params);

    // Mapeamos los resultados y formateamos las fechas
    const formattedData = dataResult.map((incidencia) => ({
      ...incidencia,
      fecha_incidencia: moment(incidencia.fecha_incidencia).format(
        "DD/MM/YYYY hh:mm:ss A"
      ),
    }));

    return formattedData;
  }

  static async delete(id) {
    const [result] = await pool.execute("DELETE FROM incidencia WHERE id = ?", [
      id,
    ]);
    return result.affectedRows > 0;
  }
}

module.exports = IncidenciaModel;

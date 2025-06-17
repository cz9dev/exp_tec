const pool = require("../config/db");
const moment = require("moment");

class AuditoriasModel {
  static async countQuery(
    search,
    fecha_inicio,
    fecha_fin,
    dispositivo_id,
    usuario_id
  ) {
    let whereClause = "";
    let params = [];

    const conditions = [];
    if (search) {
      conditions.push("tipo_cambio LIKE ?");
      params.push(`%${search}%`);
    }
    if (fecha_inicio) {
      conditions.push("DATE(fecha_hora) >= ?");
      params.push(fecha_inicio);
    }
    if (fecha_fin) {
      conditions.push("DATE(fecha_hora) <= ?");
      params.push(fecha_fin);
    }
    if (dispositivo_id) {
      conditions.push("dispositivo_id = ?");
      params.push(dispositivo_id);
    }
    if (usuario_id) {
      conditions.push("usuario_id = ?");
      params.push(usuario_id);
    }

    if (conditions.length > 0) {
      whereClause = "WHERE " + conditions.join(" AND ");
    }

    const countQuery = `
    SELECT COUNT(*) AS total 
    FROM dispositivo_auditoria da
    LEFT JOIN dispositivo d ON da.dispositivo_id = d.id
    LEFT JOIN usuarios u ON da.usuario_id = u.id ${whereClause}`;

    const [countResult] = await pool.execute(countQuery, params);
    return countResult[0].total;
  }

  static async dataQuery(
    search,
    fecha_inicio,
    fecha_fin,
    limit,
    offset,
    dispositivo_id,
    usuario_id
  ) {
    let whereClause = "";
    let params = [];

    const conditions = [];
    if (search) {
      conditions.push("tipo_cambio LIKE ?");
      params.push(`%${search}%`);
    }
    if (fecha_inicio) {
      conditions.push("DATE(fecha_hora) >= ?");
      params.push(fecha_inicio);
    }
    if (fecha_fin) {
      conditions.push("DATE(fecha_hora) <= ?");
      params.push(fecha_fin);
    }
    if (dispositivo_id) {
      conditions.push("dispositivo_id = ?");
      params.push(dispositivo_id);
    }
    if (usuario_id) {
      conditions.push("usuario_id = ?");
      params.push(usuario_id);
    }

    if (conditions.length > 0) {
      whereClause = "WHERE " + conditions.join(" AND ");
    }

    const dataQuery = `
      SELECT da.*, d.nombre AS dispositivo_nombre, u.nombre AS usuario_nombre
      FROM dispositivo_auditoria da
      LEFT JOIN dispositivo d ON da.dispositivo_id = d.id
      LEFT JOIN usuarios u ON da.usuario_id = u.id
      ${whereClause}
      LIMIT ${limit} OFFSET ${offset}
    `;

    const [dataResult] = await pool.execute(dataQuery, params);

    const formattedData = dataResult.map((auditoria) => ({
      ...auditoria,
      fecha_hora: moment(auditoria.fecha_hora).format("DD/MM/YYYY hh:mm:ss A"),
    }));

    return formattedData;
  }

  static async findAll() {
    const [rows] = await pool.execute(`
        SELECT da.*, d.nombre AS dispositivo_nombre, u.nombre AS usuario_nombre
        FROM dispositivo_auditoria da
        LEFT JOIN dispositivo d ON da.dispositivo_id = d.id
        LEFT JOIN usuarios u ON da.usuario_id = u.id
    `);
    return rows;
  }
}

module.exports = AuditoriasModel;

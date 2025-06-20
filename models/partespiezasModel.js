const pool = require("../config/db");
const moment = require("moment");

class PartespiezasModel {
  static async findAll(search, limit, offset) {    
    let params = [];

    const conditions = [];
    if (search) {
      conditions.push("(c.modelo LIKE ? OR c.numero_serie LIKE ?)");
      params.push(`%${search}%`, `%${search}%`);
    }

    let where =
      conditions.length > 0
        ? "WHERE " + conditions.join(" AND ") + " AND "
        : "WHERE "; // Ajustado aquí
    where += "c.id NOT IN (SELECT id_componente FROM dispositivo_componente)";

    const query = `
        SELECT
            c.*,
            tc.nombre AS tipo_componente_nombre,
            m.marca AS marca_nombre
        FROM
            componente c        
        LEFT JOIN
            tipo_componente tc ON c.id_tipo_componente = tc.id
        LEFT JOIN
            marca m ON c.id_marca = m.id
        ${where}        
        ORDER BY COALESCE(tc.nombre, '') ASC  /* Maneja los NULL en el ordenamiento */
        LIMIT ${limit} OFFSET ${offset}
    `;

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async count(search) {    
    let params = [];

    const conditions = [];
    if (search) {
      conditions.push("(c.modelo LIKE ? OR c.numero_serie LIKE ?)");
      params.push(`%${search}%`, `%${search}%`);
    }

    let where =
      conditions.length > 0
        ? "WHERE " + conditions.join(" AND ") + " AND "
        : "WHERE "; // Ajustado aquí
    where += "c.id NOT IN (SELECT id_componente FROM dispositivo_componente)";

    const query = `
        SELECT COUNT(*) AS total
        FROM componente c
        ${where}
    `;

    const [result] = await pool.execute(query, params);
    return result[0].total;
  }
}

module.exports = PartespiezasModel;

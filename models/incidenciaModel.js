const pool = require("../config/db");

class IncidenciaModel {
  static async create(id_dispositivo, tipo_incidencia, fecha_incidencia, descripcion, id_usuario, resuelto, id_trabajador, conforme) {
    const [result] = await pool.execute(
      "INSERT INTO incidencia (id_dispositivo, tipo_incidencia, fecha_incidencia, descripcion, id_usuario, resuelto, id_trabajador, conforme) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [id_dispositivo, tipo_incidencia, fecha_incidencia, descripcion, id_usuario, resuelto, id_trabajador, conforme]
    );
    //return result.insertId;
    return result.affectedRows > 0;
  }
}

module.exports = IncidenciaModel;
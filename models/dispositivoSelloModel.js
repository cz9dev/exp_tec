const pool = require("../config/db");

class DispositivoSelloModel {
  static async create(sello, id_dispositivo, fecha_cambio, id_testigo, id_usuario) {    
    const [result] = await pool.execute(
      "INSERT INTO dispositivo_sello (sello, id_dispositivo, fecha_cambio, id_testigo, id_usuario) VALUES (?, ?, ?, ?, ?)",
      [sello, id_dispositivo, fecha_cambio, id_testigo, id_usuario]
    );
    //return result.insertId;
    return result.affectedRows > 0;
  }

  static async findByDeviceId(id_dispositivo) {
    const [rows] = await pool.execute(
      "SELECT ds.*, t.nombres AS testigo, u.username AS usuario FROM dispositivo_sello ds JOIN trabajador t ON ds.id_testigo = t.id JOIN usuario u ON ds.id_usuario = u.id WHERE id_dispositivo = ? ORDER BY fecha_cambio DESC",
      [id_dispositivo]
    );
    return rows;
  }

  // Puedes agregar otros métodos de búsqueda según tus necesidades.
}

module.exports = DispositivoSelloModel;
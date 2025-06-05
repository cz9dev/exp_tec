const pool = require("../config/db");

class DispositivoAuditoriaModel {
  static async create(
    id_dispositivo,
    id_usuario,    
    tipo_cambio,
    id_componente,
    id_periferico,
    datos_antes,
    datos_despues
  ) {
    const fecha = new Date();
    const [result] = await pool.execute(
      "INSERT INTO dispositivo_auditoria (dispositivo_id, usuario_id, fecha_hora, tipo_cambio, componente_id, periferico_id, datos_antes, datos_despues) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [id_dispositivo, id_usuario, fecha, tipo_cambio, id_componente, id_periferico, datos_antes, datos_despues]
    );
    return result.insertId;
  }

  static async findByDeviceId(id_dispositivo) {
    const [rows] = await pool.execute(
      "SELECT * FROM dispositivo_auditoria WHERE id_dispositivo = ? ORDER BY fecha DESC",
      [id_dispositivo]
    );
    return rows;
  }

  // Puedes agregar otros métodos según tus necesidades, como buscar por fecha, usuario, etc.
  // Ejemplo: buscar auditorias de un usuario específico
  static async findByUser(usuario) {
    const [rows] = await pool.execute(
      "SELECT * FROM dispositivo_auditoria WHERE usuario = ? ORDER BY fecha DESC",
      [usuario]
    );
    return rows;
  }
}

module.exports = DispositivoAuditoriaModel;

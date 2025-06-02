const pool = require("../config/db");

class DeviceModel {
  static async create(tipo, inventario, nombre, ip, id_area, id_trabajador) {
    const [result] = await pool.execute(
      "INSERT INTO dispositivo (tipo, inventario, nombre, ip, id_area, id_trabajador) VALUES (?, ?, ?, ?, ?, ?)",
      [tipo, inventario, nombre, ip, id_area, id_trabajador]
    );
    return result.insertId;
  }

  static async findAll() {
    const [rows] = await pool.execute(`
      SELECT d.*, a.nombre AS area, t.nombres AS trabajador 
      FROM dispositivo d
      LEFT JOIN area a ON d.id_area = a.id
      LEFT JOIN trabajadores t ON d.id_trabajador = t.id
    `);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      "SELECT * FROM dispositivo WHERE id = ?",
      [id]
    );
    return rows[0];
  }

  static async update(
    id,
    tipo,
    inventario,
    nombre,
    ip,
    id_area,
    id_trabajador
  ) {
    const [result] = await pool.execute(
      "UPDATE dispositivo SET tipo = ?, inventario = ?, nombre = ?, ip = ?, id_area = ?, id_trabajador = ? WHERE id = ?",
      [tipo, inventario, nombre, ip, id_area, id_trabajador, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.execute(
      "DELETE FROM dispositivo WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  }

  static async addComponent(deviceId, componentId) {
    try {
      const [result] = await pool.execute(
        "INSERT INTO dispositivo_componente (inventario_dispositivo, id_componente) VALUES (?, ?)",
        [deviceId, componentId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error asignando componente:", error);
      throw error;
    }
  }

  static async addPeripheral(deviceId, peripheralId) {
    try {
      const [result] = await pool.execute(
        "INSERT INTO dispositivo_periferico (inventario_dispositivo, id_periferico) VALUES (?, ?)",
        [deviceId, peripheralId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error asignando periférico:", error);
      throw error;
    }
  }

  static async getAvailableComponents() {
    const [rows] = await pool.execute(
      "SELECT c.* FROM componente c WHERE c.id NOT IN (SELECT id_componente FROM dispositivo_componente)"
    );
    return rows;
  }

  static async getAvailablePeripherals() {
    const [rows] = await pool.execute(
      "SELECT p.* FROM periferico p WHERE p.id NOT IN (SELECT id_periferico FROM dispositivo_periferico)"
    );
    return rows;
  }

  static async assignPeripheral(deviceInventory, peripheralId) {
    try {
      const [result] = await pool.execute(
        "INSERT INTO dispositivo_periferico (id_dispositivo, id_periferico) VALUES (?, ?)",
        [deviceInventory, peripheralId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error asignando periférico:", error);
      throw error;
    }
  }

  static async unassignPeripheral(deviceInventory, peripheralId) {
    try {
      const [result] = await pool.execute(
        "DELETE FROM dispositivo_periferico WHERE id_dispositivo = ? AND id_periferico = ?",
        [deviceInventory, peripheralId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error desasignando periférico:", error);
      throw error;
    }
  }
}

module.exports = DeviceModel;

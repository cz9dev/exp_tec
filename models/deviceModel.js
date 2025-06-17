const pool = require("../config/db");

class DeviceModel {
  static async create(tipo, inventario, nombre, ip, id_area, id_trabajador) {
    const [result] = await pool.execute(
      "INSERT INTO dispositivo (tipo, inventario, nombre, ip, id_area, id_trabajador) VALUES (?, ?, ?, ?, ?, ?)",
      [tipo, inventario, nombre, ip, id_area, id_trabajador]
    );
    return result.insertId;
  }

  static async findAllWithPagination(limit, offset, whereClause = "") {
    const [rows] = await pool.execute(
      `
      SELECT d.*, a.nombre AS area, t.nombres AS trabajador 
      FROM dispositivo d
      LEFT JOIN area a ON d.id_area = a.id
      LEFT JOIN trabajadores t ON d.id_trabajador = t.id
      ${whereClause}
      LIMIT ? OFFSET ?
    `,
      [limit, offset]
    );
    return rows;
  }

  static async count(whereClause = "") {
    const [[{ count }]] = await pool.execute(
      `SELECT COUNT(*) AS count FROM dispositivo d ${whereClause}`
    );
    return count;
  }

  static async findAll() {
    const [rows] = await pool.execute(`
      SELECT d.*, a.nombre AS area, t.nombres AS trabajador 
      FROM dispositivo d
      LEFT JOIN area a ON d.id_area = a.id
      LEFT JOIN trabajadores t ON d.id_trabajador = t.id
      WHERE d.deleted_at IS NULL
    `);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT d.*, a.nombre AS area, t.nombres AS trabajador 
      FROM dispositivo d
      LEFT JOIN area a ON d.id_area = a.id
      LEFT JOIN trabajadores t ON d.id_trabajador = t.id
      WHERE d.deleted_at IS NULL
      AND d.id = ? AND d.deleted_at IS NULL`,
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
    const updated_at = new Date();
    const [result] = await pool.execute(
      "UPDATE dispositivo SET tipo = ?, inventario = ?, nombre = ?, ip = ?, id_area = ?, id_trabajador = ?, updated_at = ? WHERE id = ?",
      [tipo, inventario, nombre, ip, id_area, id_trabajador, updated_at, id]
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

  static async deleteAt(id) {
    const deleted_at = new Date();
    const [result] = await pool.execute(
      "UPDATE dispositivo SET deleted_at = ? WHERE id = ?",
      [deleted_at, id]
    );
    return result.affectedRows > 0;
  }

  static async hasComponent(id) {
    // Verificar si tiene componentes/periféricos asignados primero
    const [components] = await pool.execute(
      "SELECT COUNT(*) AS count FROM dispositivo_componente WHERE id_dispositivo = ?",
      [id]
    );
    return components;
  }

  static async hasPeripheral(id) {
    const [peripherals] = await pool.execute(
      "SELECT COUNT(*) AS count FROM dispositivo_periferico WHERE id_dispositivo = ?",
      [id]
    );
    return peripherals;
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

  static async assignComponent(deviceId, componentId) {
    try {
      const [result] = await pool.execute(
        "INSERT INTO dispositivo_componente (id_dispositivo, id_componente) VALUES (?, ?)",
        [deviceId, componentId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error asignando componente:", error);
      throw error;
    }
  }

  static async unassignComponent(id, componentId) {
    try {
      const [result] = await pool.execute(
        "DELETE FROM dispositivo_componente WHERE id_dispositivo = ? AND id_componente = ?",
        [id, componentId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error desasignando componente:", error);
      throw error;
    }
  }

  static async assignPeripheral(id, peripheralId) {
    try {
      const [result] = await pool.execute(
        "INSERT INTO dispositivo_periferico (id_dispositivo, id_periferico) VALUES (?, ?)",
        [id, peripheralId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error asignando periférico:", error);
      throw error;
    }
  }

  static async unassignPeripheral(id, peripheralId) {
    try {
      const [result] = await pool.execute(
        "DELETE FROM dispositivo_periferico WHERE id_dispositivo = ? AND id_periferico = ?",
        [id, peripheralId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error desasignando periférico:", error);
      throw error;
    }
  }
}

module.exports = DeviceModel;

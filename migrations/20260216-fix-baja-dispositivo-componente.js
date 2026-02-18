"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Agregar la columna si no existe
    const columns_components = await queryInterface.describeTable("componente");
    const columns_peripherals =
      await queryInterface.describeTable("periferico");
    const columns_dispositivos =
      await queryInterface.describeTable("dispositivo");
    if (!columns_components.deactivated_at) {
      await queryInterface.addColumn("componente", "deactivated_at", {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }
    if (!columns_components.deactivation_reason) {
      await queryInterface.addColumn("componente", "deactivation_reason", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    if (!columns_peripherals.deactivated_at) {
      await queryInterface.addColumn("periferico", "deactivated_at", {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }
    if (!columns_peripherals.deactivation_reason) {
      await queryInterface.addColumn("periferico", "deactivation_reason", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    if (!columns_dispositivos.deactivated_at) {
      await queryInterface.addColumn("dispositivo", "deactivated_at", {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }
    if (!columns_dispositivos.deactivation_reason) {
      await queryInterface.addColumn("dispositivo", "deactivation_reason", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    // Agregar índices para consultas de estado
    await queryInterface.addIndex("componente", ["deactivated_at"]);
    await queryInterface.addIndex("periferico", ["deactivated_at"]);
    await queryInterface.addIndex("dispositivo", ["deactivated_at"]);
  },

  async down(queryInterface, Sequelize) {
    const columns_components = await queryInterface.describeTable("componente");
    const columns_peripherals =
      await queryInterface.describeTable("periferico");
    const columns_dispositivos =
      await queryInterface.describeTable("dispositivo");

    // Verificar que las columnas existen antes de eliminarlas
    // Revertir la migración si es necesario
    if (columns_components.deactivated_at) {
      await queryInterface.removeColumn("componente", "deactivated_at");
    }
    if (columns_components.deactivation_reason) {
      await queryInterface.removeColumn("componente", "deactivation_reason");
    }
    if (columns_peripherals.deactivated_at) {
      await queryInterface.removeColumn("periferico", "deactivated_at");
    }
    if (columns_peripherals.deactivation_reason) {
      await queryInterface.removeColumn("periferico", "deactivation_reason");
    }
    if (columns_dispositivos.deactivated_at) {
      await queryInterface.removeColumn("dispositivo", "deactivated_at");
    }
    if (columns_dispositivos.deactivation_reason) {
      await queryInterface.removeColumn("dispositivo", "deactivation_reason");
    }

    // Remover índices
    await queryInterface.removeIndex("componente", ["deactivated_at"]);
    await queryInterface.removeIndex("periferico", ["deactivated_at"]);
    await queryInterface.removeIndex("dispositivo", ["deactivated_at"]);
  },
};

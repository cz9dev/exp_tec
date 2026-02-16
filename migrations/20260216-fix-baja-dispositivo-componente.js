"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Agregar la columna si no existe
    const columns_components = await queryInterface.describeTable("componente");
    const columns_peripherals =
      await queryInterface.describeTable("periferico");
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
  },
  async down(queryInterface, Sequelize) {
    // Revertir la migración si es necesario
    await queryInterface.removeColumn("componente", "deactivated_at");
    await queryInterface.removeColumn("componente", "deactivation_reason");

    await queryInterface.removeColumn("periferico", "deactivated_at");
    await queryInterface.removeColumn("periferico", "deactivation_reason");
  },
};

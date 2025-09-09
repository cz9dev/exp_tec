"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Agregar la columna si no existe
    const columns = await queryInterface.describeTable("dispositivo");
    if (!columns.id_trabajador) {
      await queryInterface.addColumn("dispositivo", "id_trabajador", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
    // 1. Verificar si la foreign key existe y eliminarla si es necesario
    const constraints = await queryInterface.getForeignKeyReferencesForTable(
      "dispositivo"
    );
    const oldConstraint = constraints.find((c) =>
      c.constraintName.includes("id_trabajador")
    );

    if (oldConstraint) {
      await queryInterface.removeConstraint(
        "dispositivo",
        oldConstraint.constraintName
      );
    }

    // 2. Agregar la nueva foreign key correctamente
    await queryInterface.addConstraint("dispositivo", {
      fields: ["id_trabajador"],
      type: "foreign key",
      name: "fk_dispositivo_trabajador",
      references: {
        table: "trabajadores",
        field: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    // Revertir la migración si es necesario
    await queryInterface.removeConstraint("dispositivo", "dispositivo_ibfk_1");
  },
};

"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("componente", "url_image", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("componente", "url_image", {
      type: Sequelize.STRING(20),
      allowNull: true,
    });
  },
};
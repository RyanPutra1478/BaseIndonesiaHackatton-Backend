"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      name: { type: Sequelize.STRING(120), allowNull: false },

      email: { type: Sequelize.STRING(190), allowNull: false, unique: true },

      passwordHash: { type: Sequelize.STRING(255), allowNull: false },

      role: {
        type: Sequelize.ENUM("worker", "employer", "admin"),
        allowNull: false,
        defaultValue: "worker",
      },

      skills: { type: Sequelize.JSON, allowNull: true },

      kycStatus: {
        type: Sequelize.ENUM("unsubmitted", "pending", "verified", "rejected"),
        allowNull: false,
        defaultValue: "unsubmitted",
      },

      // simpan object key, bukan URL publik
      kycKtpKey: { type: Sequelize.STRING(255), allowNull: true },
      kycFaceKey: { type: Sequelize.STRING(255), allowNull: true },

      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    await queryInterface.addIndex("Users", ["role"]);
    await queryInterface.addIndex("Users", ["kycStatus"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Users");
  },
};

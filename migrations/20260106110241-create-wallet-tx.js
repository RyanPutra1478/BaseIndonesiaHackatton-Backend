"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("WalletTx", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },

      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      amount: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false,
      },

      type: {
        type: Sequelize.ENUM(
          "escrow_lock",
          "escrow_release",
          "escrow_refund",
          "withdrawal_hold",
          "withdrawal_release",
          "admin_adjustment"
        ),
        allowNull: false,
      },

      referenceType: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },

      referenceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      idempotencyKey: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },

      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    await queryInterface.addIndex("WalletTx", ["userId", "createdAt"]);
    await queryInterface.addIndex("WalletTx", ["referenceType", "referenceId"]);
    await queryInterface.addIndex("WalletTx", ["type", "createdAt"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("WalletTx");
  },
};

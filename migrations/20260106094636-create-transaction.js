"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Transactions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      jobId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "Jobs", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      contractId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "Contracts", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      senderId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "Users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      receiverId: {
        type: Sequelize.INTEGER,
        allowNull: true,
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
          "escrow_fund",
          "escrow_release",
          "escrow_refund",
          "withdrawal_request"
        ),
        allowNull: false,
      },

      status: {
        type: Sequelize.ENUM("pending", "success", "failed", "cancelled"),
        allowNull: false,
        defaultValue: "pending",
      },

      externalRef: {
        type: Sequelize.STRING(80),
        allowNull: true,
      },

      idempotencyKey: {
        type: Sequelize.STRING(80),
        allowNull: false,
        unique: true,
      },

      paymentProofKey: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    await queryInterface.addIndex("Transactions", ["contractId", "createdAt"]);
    await queryInterface.addIndex("Transactions", ["senderId", "createdAt"]);
    await queryInterface.addIndex("Transactions", ["receiverId", "createdAt"]);
    await queryInterface.addIndex("Transactions", [
      "type",
      "status",
      "createdAt",
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Transactions");
  },
};

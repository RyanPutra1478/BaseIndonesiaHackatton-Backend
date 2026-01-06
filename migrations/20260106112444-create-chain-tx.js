"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ChainTx", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },

      transactionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Transactions", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
        unique: true, 
      },

      network: {
        type: Sequelize.STRING(30),
        allowNull: false,
        comment: "ethereum | polygon | bsc | etc",
      },

      chainTxHash: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },

      chainBlockNumber: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },

      status: {
        type: Sequelize.ENUM(
          "broadcasted",
          "confirmed",
          "reverted"
        ),
        allowNull: false,
        defaultValue: "broadcasted",
      },

      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    await queryInterface.addIndex("ChainTx", ["network", "status"]);
    await queryInterface.addIndex("ChainTx", ["chainBlockNumber"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ChainTx");
  },
};

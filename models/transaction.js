"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      Transaction.belongsTo(models.Job, { foreignKey: "jobId", as: "job" });
      Transaction.belongsTo(models.Contract, {
        foreignKey: "contractId",
        as: "contract",
      });

      Transaction.belongsTo(models.User, {
        foreignKey: "senderId",
        as: "sender",
      });
      Transaction.belongsTo(models.User, {
        foreignKey: "receiverId",
        as: "receiver",
      });

      Transaction.hasOne(models.ChainTx, {
        foreignKey: "transactionId",
        as: "ChainTx",
      });
    }
  }

  Transaction.init(
    {
      jobId: { type: DataTypes.INTEGER, allowNull: true },
      contractId: { type: DataTypes.INTEGER, allowNull: true },

      senderId: { type: DataTypes.INTEGER, allowNull: true },
      receiverId: { type: DataTypes.INTEGER, allowNull: true },

      amount: { type: DataTypes.DECIMAL(18, 2), allowNull: false },

      type: {
        type: DataTypes.ENUM(
          "escrow_fund",
          "escrow_release",
          "escrow_refund",
          "withdrawal_request"
        ),
        allowNull: false,
      },

      status: {
        type: DataTypes.ENUM("pending", "success", "failed", "cancelled"),
        allowNull: false,
        defaultValue: "pending",
      },

      externalRef: { type: DataTypes.STRING(80), allowNull: true },
      idempotencyKey: {
        type: DataTypes.STRING(80),
        allowNull: false,
        unique: true,
      },

      paymentProofKey: { type: DataTypes.STRING(255), allowNull: true },
    },
    {
      sequelize,
      modelName: "Transaction",
      tableName: "Transactions",
    }
  );

  return Transaction;
};

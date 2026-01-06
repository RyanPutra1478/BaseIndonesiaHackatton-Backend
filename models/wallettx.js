"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class WalletTx extends Model {
    static associate(models) {
      WalletTx.belongsTo(models.User, { foreignKey: "userId", as: "user" });
      // optionally: WalletTx.belongsTo(models.Wallet, { foreignKey: "userId", as: "wallet" });
    }
  }

  WalletTx.init(
    {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      amount: { type: DataTypes.DECIMAL(18, 2), allowNull: false },

      type: {
        type: DataTypes.ENUM(
          "escrow_lock",
          "escrow_release",
          "escrow_refund",
          "withdrawal_hold",
          "withdrawal_release",
          "admin_adjustment"
        ),
        allowNull: false,
      },

      referenceType: { type: DataTypes.STRING(30), allowNull: false },
      referenceId: { type: DataTypes.INTEGER, allowNull: false },

      idempotencyKey: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    },
    {
      sequelize,
      modelName: "WalletTx",
      tableName: "WalletTx",
    }
  );

  return WalletTx;
};

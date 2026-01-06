"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Wallet extends Model {
    static associate(models) {
      Wallet.belongsTo(models.User, { foreignKey: "userId", as: "user" });
      Wallet.hasMany(models.WalletTx, { foreignKey: "userId", as: "txs" });
    }
  }

  Wallet.init(
    {
      userId: { type: DataTypes.INTEGER, primaryKey: true },
      availableBalance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
      },
      lockedBalance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Wallet",
      tableName: "Wallets",
    }
  );

  return Wallet;
};

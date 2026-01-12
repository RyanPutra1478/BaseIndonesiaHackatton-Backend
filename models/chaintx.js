"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ChainTx extends Model {
    static associate(models) {
      ChainTx.belongsTo(models.Transaction, {
        foreignKey: "transactionId",
        as: "transaction",
      });
    }
  }
  ChainTx.init(
    {
      transactionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      network: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      chainTxHash: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      chainBlockNumber: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("broadcasted", "confirmed", "reverted", "pending"),
        allowNull: false,
        defaultValue: "broadcasted",
      },
    },
    {
      sequelize,
      modelName: "ChainTx",
      tableName: "ChainTx",
    }
  );
  return ChainTx;
};

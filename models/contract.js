"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Contract extends Model {
    static associate(models) {
      Contract.belongsTo(models.Job, { foreignKey: "jobId", as: "job" });
      Contract.belongsTo(models.User, { foreignKey: "workerId", as: "worker" });
      Contract.belongsTo(models.User, {
        foreignKey: "employerId",
        as: "employer",
      });

      Contract.hasMany(models.Transaction, {
        foreignKey: "contractId",
        as: "transactions",
      });
    }
  }

  Contract.init(
    {
      jobId: { type: DataTypes.INTEGER, allowNull: false },
      workerId: { type: DataTypes.INTEGER, allowNull: false },
      employerId: { type: DataTypes.INTEGER, allowNull: false },

      contractNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },

      agreedWage: { type: DataTypes.DECIMAL(18, 2), allowNull: false },

      status: {
        type: DataTypes.ENUM("draft", "active", "completed", "cancelled"),
        allowNull: false,
        defaultValue: "draft",
      },

      startedAt: { type: DataTypes.DATE, allowNull: true },
      finishedAt: { type: DataTypes.DATE, allowNull: true },
    },
    {
      sequelize,
      modelName: "Contract",
      tableName: "Contracts",
    }
  );

  return Contract;
};

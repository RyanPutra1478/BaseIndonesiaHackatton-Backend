"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Job extends Model {
    static associate(models) {
      Job.belongsTo(models.User, {
        foreignKey: "employerId",
        as: "employer",
      });

      Job.hasMany(models.Application, {
        foreignKey: "jobId",
        as: "applications",
      });

      Job.hasOne(models.Contract, {
        foreignKey: "jobId",
        as: "contract",
      });

      Job.hasMany(models.Transaction, {
        foreignKey: "jobId",
        as: "transactions",
      });

      Job.hasMany(models.Rating, { foreignKey: "jobId", as: "ratings" });
    }
  }

  Job.init(
    {
      employerId: { type: DataTypes.INTEGER, allowNull: false },

      title: { type: DataTypes.STRING(150), allowNull: false },

      description: { type: DataTypes.TEXT, allowNull: false },

      wage: { type: DataTypes.DECIMAL(18, 2), allowNull: false },

      location: { type: DataTypes.STRING(120), allowNull: false },

      requirements: { type: DataTypes.JSON, allowNull: true },

      status: {
        type: DataTypes.ENUM(
          "draft",
          "open",
          "closed",
          "in_contract",
          "completed",
          "cancelled"
        ),
        allowNull: false,
        defaultValue: "open",
      },
    },
    {
      sequelize,
      modelName: "Job",
      tableName: "Jobs",
    }
  );

  return Job;
};

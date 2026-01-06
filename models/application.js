"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Application extends Model {
    static associate(models) {
      Application.belongsTo(models.Job, { foreignKey: "jobId", as: "job" });
      Application.belongsTo(models.User, {
        foreignKey: "workerId",
        as: "worker",
      });
    }
  }

  Application.init(
    {
      jobId: { type: DataTypes.INTEGER, allowNull: false },
      workerId: { type: DataTypes.INTEGER, allowNull: false },

      status: {
        type: DataTypes.ENUM("submitted", "withdrawn", "rejected", "accepted"),
        allowNull: false,
        defaultValue: "submitted",
      },

      coverLetter: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      sequelize,
      modelName: "Application",
      tableName: "Applications",
    }
  );

  return Application;
};

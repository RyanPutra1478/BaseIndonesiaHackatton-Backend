"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    static associate(models) {
      Rating.belongsTo(models.Job, { foreignKey: "jobId", as: "job" });

      Rating.belongsTo(models.User, {
        foreignKey: "fromUserId",
        as: "fromUser",
      });
      Rating.belongsTo(models.User, { foreignKey: "toUserId", as: "toUser" });
    }
  }

  Rating.init(
    {
      jobId: { type: DataTypes.INTEGER, allowNull: false },
      fromUserId: { type: DataTypes.INTEGER, allowNull: false },
      toUserId: { type: DataTypes.INTEGER, allowNull: false },

      score: { type: DataTypes.TINYINT, allowNull: false },

      comment: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      sequelize,
      modelName: "Rating",
      tableName: "Ratings",
    }
  );

  return Rating;
};

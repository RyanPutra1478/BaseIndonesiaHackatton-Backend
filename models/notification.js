"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      Notification.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    }
  }

  Notification.init(
    {
      userId: { type: DataTypes.INTEGER, allowNull: false },

      title: { type: DataTypes.STRING(120), allowNull: false },

      message: { type: DataTypes.TEXT, allowNull: false },

      isRead: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      idempotencyKey: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "Notification",
      tableName: "Notifications",
    }
  );

  return Notification;
};

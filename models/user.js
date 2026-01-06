"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Job, { foreignKey: "employerId", as: "jobsPosted" });
      User.hasMany(models.Application, {
        foreignKey: "workerId",
        as: "applications",
      });

      User.hasMany(models.Contract, {
        foreignKey: "workerId",
        as: "workerContracts",
      });
      User.hasMany(models.Contract, {
        foreignKey: "employerId",
        as: "employerContracts",
      });

      User.hasOne(models.Wallet, {
        foreignKey: "userId",
        as: "wallet",
      });

      User.hasMany(models.WalletTx, {
        foreignKey: "userId",
        as: "walletTxs",
      });

      User.hasMany(models.Notification, {
        foreignKey: "userId",
        as: "notifications",
      });

      User.hasMany(models.Rating, {
        foreignKey: "fromUserId",
        as: "ratingsGiven",
      });
      User.hasMany(models.Rating, {
        foreignKey: "toUserId",
        as: "ratingsReceived",
      });
    }
  }

  User.init(
    {
      name: { type: DataTypes.STRING(120), allowNull: false },
      email: { type: DataTypes.STRING(190), allowNull: false, unique: true },
      passwordHash: { type: DataTypes.STRING(255), allowNull: false },

      role: {
        type: DataTypes.ENUM("worker", "employer", "admin"),
        allowNull: false,
        defaultValue: "worker",
      },

      skills: { type: DataTypes.JSON, allowNull: true },

      kycStatus: {
        type: DataTypes.ENUM("unsubmitted", "pending", "verified", "rejected"),
        allowNull: false,
        defaultValue: "unsubmitted",
      },

      kycKtpKey: DataTypes.STRING(255),
      kycFaceKey: DataTypes.STRING(255),
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users",
    }
  );

  return User;
};

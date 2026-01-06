"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Contracts", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      jobId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Jobs", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      workerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      employerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      contractNumber: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },

      agreedWage: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false,
      },

      status: {
        type: Sequelize.ENUM("draft", "active", "completed", "cancelled"),
        allowNull: false,
        defaultValue: "draft",
      },

      startedAt: { type: Sequelize.DATE, allowNull: true },
      finishedAt: { type: Sequelize.DATE, allowNull: true },

      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    await queryInterface.addConstraint("Contracts", {
      fields: ["jobId"],
      type: "unique",
      name: "uq_contracts_job",
    });

    await queryInterface.addIndex("Contracts", [
      "employerId",
      "status",
      "createdAt",
    ]);
    await queryInterface.addIndex("Contracts", [
      "workerId",
      "status",
      "createdAt",
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Contracts");
  },
};

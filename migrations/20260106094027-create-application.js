"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Applications", {
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

      status: {
        type: Sequelize.ENUM("submitted", "withdrawn", "rejected", "accepted"),
        allowNull: false,
        defaultValue: "submitted",
      },

      coverLetter: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    await queryInterface.addConstraint("Applications", {
      fields: ["jobId", "workerId"],
      type: "unique",
      name: "uq_applications_job_worker",
    });

    await queryInterface.addIndex("Applications", [
      "jobId",
      "status",
      "createdAt",
    ]);
    await queryInterface.addIndex("Applications", [
      "workerId",
      "status",
      "createdAt",
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Applications");
  },
};

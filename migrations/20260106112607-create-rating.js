"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Ratings", {
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

      fromUserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      toUserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      score: {
        type: Sequelize.TINYINT,
        allowNull: false,
      },

      comment: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    await queryInterface.addConstraint("Ratings", {
      fields: ["jobId", "fromUserId", "toUserId"],
      type: "unique",
      name: "uq_ratings_job_from_to",
    });

    await queryInterface.addIndex("Ratings", ["toUserId", "createdAt"]);
    await queryInterface.addIndex("Ratings", ["fromUserId", "createdAt"]);

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Ratings");
  },
};

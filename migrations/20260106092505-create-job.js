"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Jobs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      employerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      title: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      wage: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false,
      },

      location: {
        type: Sequelize.STRING(120),
        allowNull: false,
      },

      requirements: {
        type: Sequelize.JSON,
        allowNull: true,
      },

      status: {
        type: Sequelize.ENUM(
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

      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    await queryInterface.addIndex("Jobs", ["status", "createdAt"]);
    await queryInterface.addIndex("Jobs", ["employerId", "createdAt"]);
    await queryInterface.addIndex("Jobs", ["location"]);

    // OPTIONAL: kalau kamu mau keyword search yang lebih proper.
    // Catatan: FULLTEXT butuh MySQL InnoDB + versi yang mendukung.
    // await queryInterface.sequelize.query(
    //   "ALTER TABLE Jobs ADD FULLTEXT INDEX jobs_fulltext_title_desc (title, description);"
    // );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Jobs");
  },
};

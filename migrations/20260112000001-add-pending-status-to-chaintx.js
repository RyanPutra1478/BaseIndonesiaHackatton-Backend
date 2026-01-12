"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.changeColumn("ChainTx", "status", {
            type: Sequelize.ENUM("broadcasted", "confirmed", "reverted", "pending"),
            allowNull: false,
            defaultValue: "broadcasted",
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.changeColumn("ChainTx", "status", {
            type: Sequelize.ENUM("broadcasted", "confirmed", "reverted"),
            allowNull: false,
            defaultValue: "broadcasted",
        });
    },
};

"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.changeColumn("Transactions", "type", {
            type: Sequelize.ENUM(
                "escrow_fund",
                "escrow_release",
                "escrow_refund",
                "withdrawal_request",
                "contract_registration"
            ),
            allowNull: false,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.changeColumn("Transactions", "type", {
            type: Sequelize.ENUM(
                "escrow_fund",
                "escrow_release",
                "escrow_refund",
                "withdrawal_request"
            ),
            allowNull: false,
        });
    },
};

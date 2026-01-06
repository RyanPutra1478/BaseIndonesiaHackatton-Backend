"use strict";

const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    const email = "admin@local.test";
    const password = "ChangeMe123!";

    const passwordHash = await bcrypt.hash(password, 12);

    await queryInterface.bulkInsert(
      "Users",
      [
        {
          name: "System Admin",
          email: email.toLowerCase(),
          passwordHash,
          role: "admin",
          kycStatus: "verified",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    const [rows] = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE email = ? LIMIT 1",
      { replacements: [email.toLowerCase()] }
    );

    const adminId = rows?.[0]?.id;
    if (adminId) {
      await queryInterface.bulkInsert(
        "Wallets",
        [
          {
            userId: adminId,
            availableBalance: 0,
            lockedBalance: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        {}
      );
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Wallets", null, {});
    await queryInterface.bulkDelete("Users", { email: "admin@local.test" }, {});
  },
};

import { QueryInterface, Sequelize } from "sequelize";
import JwtService from "../utils/jwt";

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    const users = await queryInterface.bulkInsert(
      "users",
      [
        {
          firstName: "John",
          middleName: "Doe",
          lastName: "Smith",
          email: "user1@example.com",
          password: await JwtService.hashPasswords("Asdf@1234"),
          role: "customer",
          verified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Jane",
          middleName: "Doe",
          lastName: "Roe",
          email: "user2@example.com",
          password: await JwtService.hashPasswords("Asdf@1234"),
          role: "customer",
          verified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    const insertedUsers = await queryInterface.sequelize.query("SELECT * FROM users");

    await queryInterface.bulkInsert(
      "accounts",
      insertedUsers[0].map((user: any) => ({
        userId: user.id,
        accountNumber: `${user.id.toString().padStart(4, "0")}${Math.floor(100000 + Math.random() * 900000)}`,
        accountType: "savings",
        balance: 200000,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    );
  },

  down: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    await queryInterface.bulkDelete("Accounts", null, {});
    await queryInterface.bulkDelete("Users", null, {});
  },
};

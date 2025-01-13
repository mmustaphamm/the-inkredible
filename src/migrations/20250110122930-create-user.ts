// "use strict";

// import { QueryInterface, DataTypes } from "sequelize";

// module.exports = {
//   up: async (queryInterface: QueryInterface) => {
//     await queryInterface.createTable("users", {
//       id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//         allowNull: false,
//       },
//       email: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         unique: true,
//       },
//       firstName: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       middleName: {
//         type: DataTypes.STRING,
//         allowNull: true,
//       },
//       lastName: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       password: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       role: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         defaultValue: "customer",
//       },
//       authCode: {
//         type: DataTypes.STRING,
//         allowNull: true,
//       },
//       authExp: {
//         type: DataTypes.STRING,
//         allowNull: true,
//       },
//       verified: {
//         type: DataTypes.BOOLEAN,
//         defaultValue: false,
//         allowNull: false,
//       },
//       createdAt: {
//         type: DataTypes.DATE,
//         allowNull: false,
//         defaultValue: DataTypes.NOW,
//       },
//       updatedAt: {
//         type: DataTypes.DATE,
//         allowNull: false,
//         defaultValue: DataTypes.NOW,
//       },
//     });
//   },

//   down: async (queryInterface: QueryInterface) => {
//     await queryInterface.dropTable("users");
//   },
// };

// migrations/XXXXXXXXXXXXXX-create-users.ts
"use strict";

import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("users", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      middleName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("customer", "admin"), // Changed to ENUM to match model
        allowNull: false,
        defaultValue: "customer",
      },
      authCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      authExp: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });

    // Add index for email
    await queryInterface.addIndex("users", ["email"], {
      unique: true,
      name: "users_email_unique",
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("users");
  },
};

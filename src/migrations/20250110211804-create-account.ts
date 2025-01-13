// import { QueryInterface, DataTypes } from "sequelize";

// module.exports = {
//   async up(queryInterface: QueryInterface) {
//     await queryInterface.createTable("accounts", {
//       id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//         allowNull: false,
//       },
//       accountNumber: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         unique: true,
//       },
//       userId: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         references: {
//           model: "User",
//           key: "id",
//         },
//         onUpdate: "CASCADE",
//         onDelete: "CASCADE",
//       },
//       accountType: {
//         type: DataTypes.ENUM("savings", "current"),
//         allowNull: false,
//         defaultValue: "savings",
//       },
//       balance: {
//         type: DataTypes.FLOAT,
//         allowNull: false,
//         defaultValue: 0.0,
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

//   async down(queryInterface: QueryInterface) {
//     await queryInterface.dropTable("accounts");
//   },
// };

// migrations/XXXXXXXXXXXXXX-create-accounts.ts
"use strict";

import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("accounts", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      accountNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      accountType: {
        type: DataTypes.ENUM("savings", "current"),
        defaultValue: "savings",
        allowNull: false,
      },
      balance: {
        type: DataTypes.DECIMAL(15, 2), // Changed from FLOAT
        allowNull: false,
        defaultValue: 0.0,
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

    // Add indexes
    await queryInterface.addIndex("accounts", ["accountNumber"], {
      unique: true,
      name: "accounts_number_unique",
    });
    await queryInterface.addIndex("accounts", ["userId"], {
      name: "accounts_user_id",
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("accounts");
  },
};

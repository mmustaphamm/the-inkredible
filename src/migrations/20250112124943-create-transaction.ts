// import { QueryInterface, DataTypes } from "sequelize";

// export async function up(queryInterface: QueryInterface): Promise<void> {
//   await queryInterface.createTable("transactions", {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     transactionId: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//     },
//     userId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: { model: "users", key: "id" },
//       onUpdate: "CASCADE",
//       onDelete: "CASCADE",
//     },
//     sourceAccountId: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//       references: { model: "accounts", key: "id" },
//       onUpdate: "CASCADE",
//       onDelete: "SET NULL",
//     },
//     destinationAccountId: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//       references: { model: "accounts", key: "id" },
//       onUpdate: "CASCADE",
//       onDelete: "SET NULL",
//     },
//     type: {
//       type: DataTypes.ENUM("credit", "debit"),
//       allowNull: false,
//     },
//     amount: {
//       type: DataTypes.DECIMAL(15, 2),
//       allowNull: false,
//     },
//     currency: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       defaultValue: "NGN",
//     },
//     status: {
//       type: DataTypes.ENUM("pending", "completed", "failed"),
//       allowNull: false,
//     },
//     reference: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     createdAt: {
//       type: DataTypes.DATE,
//       allowNull: false,
//       defaultValue: DataTypes.NOW,
//     },
//     updatedAt: {
//       type: DataTypes.DATE,
//       allowNull: false,
//       defaultValue: DataTypes.NOW,
//     },
//   });
// }

// export async function down(queryInterface: QueryInterface): Promise<void> {
//   await queryInterface.dropTable("transactions");
// }

// migrations/XXXXXXXXXXXXXX-create-transactions.ts
"use strict";

import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("transactions", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      transactionId: {
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
      sourceAccountId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "accounts",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      destinationAccountId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "accounts",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      type: {
        type: DataTypes.ENUM("credit", "debit"),
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "NGN",
      },
      status: {
        type: DataTypes.ENUM("pending", "completed", "failed"),
        allowNull: false,
      },
      reference: {
        type: DataTypes.STRING,
        allowNull: true,
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
    await queryInterface.addIndex("transactions", ["transactionId"], {
      unique: true,
      name: "transactions_transaction_id_unique",
    });
    await queryInterface.addIndex("transactions", ["userId"], {
      name: "transactions_user_id",
    });
    await queryInterface.addIndex("transactions", ["sourceAccountId"], {
      name: "transactions_source_account_id",
    });
    await queryInterface.addIndex("transactions", ["destinationAccountId"], {
      name: "transactions_destination_account_id",
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("transactions");
  },
};

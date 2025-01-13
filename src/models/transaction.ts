import {
  Model,
  DataTypes,
  Sequelize,
  CreationOptional,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from "sequelize";

class Transaction extends Model<
  InferAttributes<Transaction>,
  InferCreationAttributes<Transaction>
> {
  declare id: CreationOptional<number>;
  declare transactionId: string;
  declare userId: ForeignKey<number>;
  declare sourceAccountId: CreationOptional<ForeignKey<number>>;
  declare destinationAccountId: CreationOptional<ForeignKey<number>>;
  declare type: "credit" | "debit";
  declare amount: number;
  declare currency: string;
  declare status: "pending" | "completed" | "failed";
  declare reference: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare user?: NonAttribute<Model>;
  declare sourceAccount?: NonAttribute<Model>;
  declare destinationAccount?: NonAttribute<Model>;

  static associate(models: any) {
    Transaction.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });

    Transaction.belongsTo(models.Account, {
      foreignKey: "sourceAccountId",
      as: "sourceAccount",
      constraints: false,
    });

    Transaction.belongsTo(models.Account, {
      foreignKey: "destinationAccountId",
      as: "destinationAccount",
      constraints: false,
    });
  }
}

export default (sequelize: Sequelize) => {
  Transaction.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
      },
      sourceAccountId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "accounts",
          key: "id",
        },
      },
      destinationAccountId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "accounts",
          key: "id",
        },
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
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Transaction",
      tableName: "transactions",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["transactionId"],
        },
        {
          fields: ["userId"],
        },
        {
          fields: ["sourceAccountId"],
        },
        {
          fields: ["destinationAccountId"],
        },
      ],
    }
  );

  return Transaction;
};

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

class Account extends Model<InferAttributes<Account>, InferCreationAttributes<Account>> {
  declare id: CreationOptional<number>;
  declare accountNumber: string;
  declare userId: ForeignKey<number>;
  declare accountType: "savings" | "current";
  declare balance: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare user?: NonAttribute<Model>;
  declare sourceTransactions?: NonAttribute<Model[]>;
  declare destinationTransactions?: NonAttribute<Model[]>;

  static associate(models: any) {
    Account.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });

    Account.hasMany(models.Transaction, {
      foreignKey: "sourceAccountId",
      as: "sourceTransactions",
      constraints: false,
    });

    Account.hasMany(models.Transaction, {
      foreignKey: "destinationAccountId",
      as: "destinationTransactions",
      constraints: false,
    });
  }
}

export default (sequelize: Sequelize) => {
  Account.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
      },
      accountType: {
        type: DataTypes.ENUM("savings", "current"),
        defaultValue: "savings",
      },
      balance: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Account",
      tableName: "accounts",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["accountNumber"],
        },
        {
          fields: ["userId"],
        },
      ],
    }
  );

  return Account;
};

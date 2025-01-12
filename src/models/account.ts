import { Model, DataTypes, Sequelize, Optional } from "sequelize";
import sequelize from ".";

interface AccountAttributes {
  id: number;
  accountNumber: string;
  userId: number;
  accountType: "savings" | "current";
  balance: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AccountCreationAttributes extends Optional<AccountAttributes, "id"> {}

export default class Account
  extends Model<AccountAttributes, AccountCreationAttributes>
  implements AccountAttributes
{
  public id!: number;
  public accountNumber!: string;
  public userId!: number;
  public accountType!: "savings" | "current";
  public balance!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associations: {};

  static associate(models: any) {
    Account.belongsTo(models.User, { foreignKey: "userId", as: "user" });
  }
}
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
    },
    accountType: {
      type: DataTypes.ENUM("savings", "current"),
      defaultValue: "savings",
    },
    balance: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0,
    },
  },
  {
    sequelize: sequelize,
    modelName: "Account",
    tableName: "accounts",
    timestamps: true,
  }
);

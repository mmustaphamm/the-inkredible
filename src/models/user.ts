import { Model, DataTypes, Sequelize, ForeignKey, NonAttribute, CreationOptional } from "sequelize";
import bcrypt from "bcrypt";
import sequelize from "./index";
import JwtService from "../utils/jwt";

export interface UserAttributes {
  id?: number;
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  password: string;
  role: string;
  authCode?: string;
  authExp?: string;
  verified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export default class User extends Model<UserAttributes, UserAttributes> implements UserAttributes {
  declare id: CreationOptional<number>;
  declare email: string;
  declare firstName: string;
  declare middleName?: string;
  declare lastName: string;
  declare password: string;
  declare role: string;
  declare authCode?: string;
  declare authExp?: string;
  declare verified: boolean;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  public static associations: {};

  static associate(models: any) {
    // Add any associations here
    User.hasOne(models.Account, { foreignKey: "userId", as: "account" });
  }
  toJSON() {
    const { password, ...values } = this.get() as { password?: string };
    return values;
  }
}
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
      type: DataTypes.ENUM("customer", "admin"),
      defaultValue: "customer",
      allowNull: false,
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
    },
  },
  {
    sequelize: sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    hooks: {
      beforeCreate: async (user: User) => {
        user.password = await JwtService.hashPasswords(user.password);
      },
      beforeUpdate: async (user: User) => {
        if (user.changed("password")) {
          user.password = await JwtService.hashPasswords(user.password);
        }
      },
    },
  }
);

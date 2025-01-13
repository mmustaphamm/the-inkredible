import {
  Model,
  DataTypes,
  Sequelize,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from "sequelize";
import JwtService from "../utils/jwt";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare email: string;
  declare firstName: string;
  declare middleName: CreationOptional<string>;
  declare lastName: string;
  declare password: string;
  declare role: "customer" | "admin";
  declare authCode: CreationOptional<string>;
  declare authExp: CreationOptional<string>;
  declare verified: boolean;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare account?: NonAttribute<Model>;
  declare transactions?: NonAttribute<Model[]>;

  static associate(models: any) {
    User.hasOne(models.Account, {
      foreignKey: "userId",
      as: "account",
    });

    User.hasMany(models.Transaction, {
      foreignKey: "userId",
      as: "transactions",
    });
  }

  toJSON() {
    const values = super.toJSON();
    delete values.password;
    return values;
  }
}

export default (sequelize: Sequelize) => {
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
        validate: {
          isEmail: true,
        },
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
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["email"],
        },
      ],
      hooks: {
        beforeCreate: async (user: User) => {
          if (user.password) {
            user.password = await JwtService.hashPasswords(user.password);
          }
        },
        beforeUpdate: async (user: User) => {
          if (user.changed("password")) {
            user.password = await JwtService.hashPasswords(user.password);
          }
        },
      },
    }
  );

  return User;
};

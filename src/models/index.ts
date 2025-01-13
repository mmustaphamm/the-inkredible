"use strict";

import fs from "fs";
import path from "path";
import { Sequelize, DataTypes } from "sequelize";
import config from "../config/config";

interface DbInterface {
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
  [key: string]: any;
}

const basename = path.basename(__filename);
const environment = process.env.NODE_ENV || "development";
const envConfig = config[environment];
const db: DbInterface = {} as DbInterface;

let sequelize: Sequelize;
if (envConfig.use_env_variable) {
  sequelize = new Sequelize(process.env[envConfig.use_env_variable]!);
} else {
  sequelize = new Sequelize(envConfig.database!, envConfig.username!, envConfig.password || "", {
    host: envConfig.host,
    dialect: envConfig.dialect as any,
    port: Number(envConfig.port),
    logging: false,
  });
}

const modelFiles = fs.readdirSync(__dirname).filter((file) => {
  return (
    file.indexOf(".") !== 0 &&
    file !== basename &&
    (file.slice(-3) === ".js" || file.slice(-3) === ".ts")
  );
});

for (const file of modelFiles) {
  const modelPath = path.join(__dirname, file);
  const model = require(modelPath);
  if (model.default && typeof model.default === "function") {
    const initModel = model.default(sequelize, DataTypes);
    db[initModel.name] = initModel;
  }
}

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;

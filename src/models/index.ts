"use strict";

import { Sequelize } from "sequelize";
import config from "../config/config";

const environment = process.env.NODE_ENV || "development";
const envConfig = config[environment];

let sequelize: Sequelize | undefined;

if (envConfig) {
  sequelize = new Sequelize(
    envConfig.database as string,
    envConfig.username as string,
    envConfig.password || "",
    {
      host: envConfig.host,
      port: Number(envConfig.port),
      dialect: envConfig.dialect as any,
    }
  );
} else {
  throw new Error(`Environment configuration for "${environment}" not found.`);
}

export default sequelize;

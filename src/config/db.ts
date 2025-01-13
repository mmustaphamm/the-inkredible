import { Sequelize } from "sequelize";
import sequelize from "../models";
import db from "../models";

class DatabaseService {
  private sequelize: Sequelize;
  constructor() {
    this.sequelize = db.sequelize;
  }

  private async dropAndSync() {
    try {
      // await this.sequelize.drop();
      await this.sequelize.sync({ alter: true });
      // await this.sequelize.sync({ force: true });
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  }

  public async databaseConnection() {
    try {
      // await this.dropAndSync();
      await this.sequelize.authenticate();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  }

  public async databaseConnectionShut() {
    try {
      await this.sequelize.close();
      console.log("Sequelize connection closed successfully.");
      process.exit(0);
    } catch (error) {
      console.error("Could not disconnect DB", error);
      process.exit(1);
    }
  }
}

export default DatabaseService;

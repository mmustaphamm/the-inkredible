import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import DatabaseService from "./db";
import YAML from "yamljs";
import path from "path";
import SwaggerUI from "swagger-ui-express";
import { AuthRoutes } from "../routes/auth.routes";
import RedisService from "../utils/redis";
import { UserRoutes } from "../routes/user.routes";
import QConsumer from "../messageQ/processes/consumer";

dotenv.config();

class App {
  public app: Application;
  private dbSetup: DatabaseService = new DatabaseService();
  private redisSetup = RedisService;
  private docs: any = YAML.load(path.join(__dirname, "../../src/docs.yaml"));
  //Routes Invocations
  private authRoute: AuthRoutes = new AuthRoutes();
  private userRoutes: UserRoutes = new UserRoutes();

  constructor() {
    this.app = express();
    this.initializeServices()
    this.config();
    this.routes();
  }

  private async initMessage(): Promise<void> {
    try {
      const qConsumer = new QConsumer();
      await qConsumer.startConsumer();
      console.log("Message consumer started successfully.");
    } catch (error) {
      console.error("Error starting queue consumer:", error);
    }
  }

  private async initializeServices(): Promise<void> {
    try {
      await this.redisSetup.start();
      await this.dbSetup.databaseConnection();
      await this.initMessage();
    } catch (error) {
      console.error('Error initializing services:', error);
    }
  }

  private config(): void {
    this.app.use(
      cors({
        origin: "*",
        methods: "GET,POST,PUT,DELETE,PATCH",
        credentials: true,
      })
    );
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use("/api/v1/docs", SwaggerUI.serve, SwaggerUI.setup(this.docs));
  }

  private routes(): void {
    this.userRoutes.route("/api/v1/user", this.app);
    this.authRoute.route("/api/v1/auth", this.app);

    this.app.get("/", (req: Request, res: Response) => {
      res.status(200).json({
        status: true,
        message: "Welcome to Home Page",
      });
    });
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({
        status: false,
        message: "Route not found",
      });
    });
  }
}

export const PORT = process.env.PORT;

const serverInstance = new App();
export default serverInstance.app;

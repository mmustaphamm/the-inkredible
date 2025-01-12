import { Application, Request, Response } from "express";
import { UserController } from "../controllers/user.controller";
import customerMiddleware from "../middlewares/customer.middleware";

export class UserRoutes {
  private userController: UserController = new UserController();

  public route(basePath: string, app: Application) {
    app.get(
      `${basePath}/profile`,
      customerMiddleware.authenticate,
      (req: Request, res: Response) => {
        this.userController.getProfile(req, res);
      }
    );
    app.put(
      `${basePath}/profile`,
      customerMiddleware.authenticate,
      (req: Request, res: Response) => {
        this.userController.updateUser(req, res);
      }
    );
  }
}

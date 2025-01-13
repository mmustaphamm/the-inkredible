import { Application, Request, Response } from "express";
import { UserController } from "../controllers/user.controller";
import customerMiddleware from "../middlewares/customer.middleware";

export class UserRoutes {
  private userController: UserController = new UserController();

  public route(basePath: string, app: Application) {
    app.get(`${basePath}/accounts`, (req: Request, res: Response) => {
      this.userController.userAccounts(req, res);
    });
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
    app.get(
      `${basePath}/transfer/account/:accountNumber`,
      customerMiddleware.authenticate,
      (req: Request, res: Response) => {
        this.userController.getUser(req, res);
      }
    );
    app.post(
      `${basePath}/transfer/request`,
      customerMiddleware.authenticate,
      (req: Request, res: Response) => {
        this.userController.createTransaction(req, res);
      }
    );
    app.get(
      `${basePath}/transfer/history`,
      customerMiddleware.authenticate,
      (req: Request, res: Response) => {
        this.userController.getTransactionHis(req, res);
      }
    );
  }
}

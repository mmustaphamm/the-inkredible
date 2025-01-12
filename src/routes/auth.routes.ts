import { Application, Request, Response } from "express";
import { AuthController } from "../controllers/auth.controller";
import customerMiddleware from "../middlewares/customer.middleware";

export class AuthRoutes {
  private authController: AuthController = new AuthController();

  public route(basePath: string, app: Application) {
    app.post(`${basePath}/register`, (req: Request, res: Response) => {
      this.authController.registerUser(req, res);
    });

    app.get(`${basePath}/verify-email`, (req: Request, res: Response) => {
      this.authController.verifyEmail(req, res);
    });

    app.post(`${basePath}/signin`, (req: Request, res: Response) => {
      this.authController.signinUser(req, res);
    });

    app.delete(
      `${basePath}/signout`,
      customerMiddleware.authenticate,
      (req: Request, res: Response) => {
        this.authController.signoutUser(req, res);
      }
    );
  }
}

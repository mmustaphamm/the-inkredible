import { Response, NextFunction } from "express";
import JwtService from "../utils/jwt";
import ResponseHandler from "../resources/handlers/service";
import { AuthenticatedRequest } from "./types";

class CustomerAuth {
  private jwtService: JwtService;

  constructor() {
    this.jwtService = new JwtService();
  }

  public authenticate = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const token = req.headers["authorization"] || req.headers["Authorization"];
      const jwtToken = String(token).split(" ")[1];
      const authUser = await this.jwtService.validateAccessToken(jwtToken);
      req.user = {
        id: authUser.id,
        email: authUser.email,
        role: authUser.role,
      };
      next();
    } catch (error) {
      return ResponseHandler.invalidRequest(error.message, null, res);
    }
  };
}

export default new CustomerAuth();

import { Request, Response } from "express";
import ResponseHandler from "../resources/handlers/service";
import UserService from "../resources/users/service";
import { AuthenticatedRequest } from "../middlewares/types";
import { updateUserValidator } from "../resources/users/validator";

export class UserController {
  private userService: UserService = new UserService();

  public async updateUser(req: AuthenticatedRequest, res: Response) {
    try {
      const claims = req.user;
      const { error } = updateUserValidator.validate(req.body);
      if (error) {
        return ResponseHandler.invalidRequest("Validation Error", error, res);
      }

      const { firstName, middleName, lastName } = req.body;
      const userInstance = await this.userService.userById(claims.id);

      userInstance.firstName = firstName || userInstance.firstName;
      userInstance.middleName = middleName || userInstance.middleName;
      userInstance.lastName = lastName || userInstance.lastName;
      const newUser = await userInstance.save();

      await this.userService.cacheAfterUpdate(newUser.id);
      ResponseHandler.successResponse("User Update Successful", null, res);
    } catch (error) {
      ResponseHandler.serverError(error.message, res);
    }
  }

  public async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const claims = req.user;
      const user = await this.userService.findUser(claims.id);

      ResponseHandler.successResponse("User profile fetched", user, res);
    } catch (error) {
      ResponseHandler.serverError(error.message, res);
    }
  }
}

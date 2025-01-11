import { Request, Response } from "express";
import {
  createUserValidator,
  createVerifyValidator,
  userLoginValidator,
} from "../resources/users/validator";
import ResponseHandler from "../resources/handlers/service";
import { IUser } from "../resources/users/types";
import { Generate } from "../utils/generate";
import UserService from "../resources/users/service";
import SendMail from "../resources/emailer/service";
import { IAccount } from "../resources/banking/types";
import AccountService from "../resources/banking/service";
import bcrypt from "bcrypt";
import JwtService from "../utils/jwt";
import { AuthenticatedRequest } from "../middlewares/types";

export class AuthController {
  private userService: UserService = new UserService();
  private accountService: AccountService = new AccountService();
  private jwtService: JwtService = new JwtService();

  public async registerUser(req: Request, res: Response) {
    try {
      const { error } = createUserValidator.validate(req.body);
      if (error) {
        return ResponseHandler.invalidRequest("Validation Error", error, res);
      }
      const { email, firstName, middleName, lastName, password, confirm_password } = req.body;

      const userExist = await this.userService.userExist(email);
      if (userExist != null) {
        return ResponseHandler.invalidRequest("User with email already exist", null, res);
      }

      if (password !== confirm_password) {
        return ResponseHandler.invalidRequest("Passwords does not match", null, res);
      }
      const codeX = await Generate.authCode(6);
      const pinExpiry = Date.now() + 1000 * 60 * Number(process.env.AUTH_PIN_EXPIRY);

      await new SendMail({
        firstName,
        lastName,
        email,
      }).sendVerifyEmail(codeX);

      const userDto: IUser = {
        email,
        firstName,
        middleName,
        lastName,
        password,
        authCode: codeX,
        authExp: String(pinExpiry),
      };

      const newUser = await this.userService.createUser(userDto);

      const accountNo = await Generate.accountNumber();
      const accountDto: IAccount = {
        userId: newUser.id,
        accountNumber: accountNo,
      };
      await this.accountService.createAccount(accountDto);
      ResponseHandler.successfullyCreated("Sign Up Successful", newUser, res);
    } catch (error) {
      ResponseHandler.serverError(error.message, res);
    }
  }

  public async verifyEmail(req: Request, res: Response) {
    try {
      const { error } = createVerifyValidator.validate(req.query);
      if (error) {
        return ResponseHandler.invalidRequest("Validation Error", error, res);
      }

      const { email, token } = req.query;
      const userExist = await this.userService.userExist(String(email));
      if (!userExist) {
        return ResponseHandler.invalidRequest("User with email does not exist", null, res);
      }

      if (userExist.verified) {
        return ResponseHandler.invalidRequest("user account already verified", null, res);
      }

      if (String(token) !== userExist.authCode) {
        return ResponseHandler.invalidRequest("invalid token", null, res);
      }

      const isExpired = Date.now() > Number(userExist.authExp);

      if (isExpired) {
        return ResponseHandler.invalidRequest("token has expired!", null, res);
      }

      userExist.verified = true;
      userExist.authCode = null;
      userExist.authExp = null;

      await userExist.save();
      ResponseHandler.successResponse("Account Verification Successful", null, res);
    } catch (error) {
      ResponseHandler.serverError(error.message, res);
    }
  }

  public async signinUser(req: Request, res: Response) {
    try {
      const { error } = userLoginValidator.validate(req.body);
      if (error) {
        return ResponseHandler.invalidRequest("Validation Error", error, res);
      }

      const { email, password } = req.body;

      const userExist = await this.userService.userExist(String(email));
      if (!userExist) {
        return ResponseHandler.invalidRequest("User with email does not exist", null, res);
      }

      const passVerify = await bcrypt.compare(password, userExist.password);
      if (!passVerify) {
        return ResponseHandler.invalidRequest("incorrect password", null, res);
      }

      const codeX = await Generate.authCode(6);
      const pinExpiry = Date.now() + 1000 * 60 * Number(process.env.AUTH_PIN_EXPIRY);

      if (!userExist.verified) {
        (userExist.authCode = codeX),
          (userExist.authExp = String(pinExpiry)),
          await userExist.save();

        await new SendMail({
          firstName: userExist.firstName,
          lastName: userExist.lastName,
          email,
        }).sendVerifyEmail(codeX);

        return ResponseHandler.invalidRequest(
          "user account not verified, check your email for verification code",
          null,
          res
        );
      }

      const token = this.jwtService.generateAccessToken(
        userExist.id,
        userExist.email,
        userExist.role
      );

      ResponseHandler.successResponse(
        "Login Successful",
        {
          firstName: userExist.firstName,
          lastName: userExist.lastName,
          email,
          accessToken: token,
        },
        res
      );
    } catch (error) {
      ResponseHandler.serverError(error.message, res);
    }
  }

  public async signoutUser(req: AuthenticatedRequest, res: Response) {
    try {
      const { id, email, role } = req.user;
      const token = this.jwtService.generateAccessToken(id, email, role);

      ResponseHandler.successResponse(
        "Logout Successful",
        {
          email,
          accessToken: token,
        },
        res
      );
    } catch (error) {
      ResponseHandler.serverError(error.message, res);
    }
  }
}

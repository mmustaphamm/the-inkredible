import { Request, Response } from "express";
import ResponseHandler from "../resources/handlers/service";
import UserService from "../resources/users/service";
import { AuthenticatedRequest } from "../middlewares/types";
import { updateUserValidator } from "../resources/users/validator";
import AccountService from "../resources/banking/service";
import { Generate } from "../utils/generate";
import { ITransaction } from "../resources/banking/types";
import QProducer from "../messageQ/queues/producer";

export class UserController {
  private userService: UserService = new UserService();
  private bankService: AccountService = new AccountService();
  private generate: Generate = new Generate();
  private enQService: QProducer = new QProducer();

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
      return ResponseHandler.successResponse("User Update Successful", null, res);
    } catch (error: any) {
      return ResponseHandler.serverError(error.message, res);
    }
  }

  public async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const claims = req.user;
      const user = await this.userService.findUser(claims.id);

      return ResponseHandler.successResponse("User profile fetched", user, res);
    } catch (error: any) {
      return ResponseHandler.serverError(error.message, res);
    }
  }

  public async userAccounts(req: Request, res: Response) {
    try {
      const data = await this.userService.userAccounts();

      return ResponseHandler.successResponse("User Account Fetch Successful", data, res);
    } catch (error: any) {
      return ResponseHandler.serverError(error.message, res);
    }
  }

  public async getUser(req: AuthenticatedRequest, res: Response) {
    try {
      const accountNumber = req.params.accountNumber;
      const userAcc = await this.bankService.findUserAccount(accountNumber);

      return ResponseHandler.successResponse("User Account fetched", userAcc, res);
    } catch (error: any) {
      return ResponseHandler.serverError(error.message, res);
    }
  }

  //send money, track by tid, fetch transaction hist
  public async createTransaction(req: AuthenticatedRequest, res: Response) {
    try {
      const claims = req.user;
      const { recId, amount, reference } = req.body;

      const sourceAccount = await this.bankService.findAccountByUserId(Number(claims.id));
      const destinationAccount = await this.bankService.findAccountByUserId(recId);

      const uniqueRef = await this.generate.transactionRef();

      if (sourceAccount.balance < amount) {
        //Charges can be further added to amount here, perharps conditionally by account type.
        return ResponseHandler.invalidRequest("Insufficient balance", null, res);
      }

      if (recId === claims.id) {
        return ResponseHandler.invalidRequest(
          "Oops, you can't send fund to the same account",
          null,
          res
        );
      }

      const senderLedger: ITransaction = {
        transactionId: `DBT-${uniqueRef}`,
        userId: Number(claims.id),
        sourceAccountId: sourceAccount.id,
        destinationAccountId: destinationAccount.id,
        type: "debit",
        amount: Number(amount),
        status: "pending",
        reference,
      };

      const createTrans = await this.bankService.createTransaction(senderLedger);

      await this.enQService.transactionProducer({ transId: createTrans.id, recId });

      return ResponseHandler.successResponse("Transaction being proccessed", null, res);
    } catch (error: any) {
      return ResponseHandler.serverError(error.message, res);
    }
  }

  public async getTransactionHis(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user.id;
      const tranHist = await this.bankService.userTrasactionHistory(userId);

      return ResponseHandler.successResponse("User Transactions fetched", tranHist, res);
    } catch (error: any) {
      return ResponseHandler.serverError(error.message, res);
    }
  }
}

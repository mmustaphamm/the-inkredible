import db from "../../models";
import { ITransaction } from "./types";
import RedisService from "../../utils/redis";
import { Constants } from "../../config/constants";

export default class AccountService {
  private redisService = RedisService;

  public async createAccount(data: any): Promise<typeof db.Account> {
    const account = await db.Account.create(data);
    return account;
  }

  public async findUserAccount(accNo: string) {
    const account = await db.Account.findOne({
      where: { accountNumber: accNo },
      attributes: ["accountNumber"],
      include: {
        model: db.User,
        as: "user",
        attributes: ["id", "firstName", "middleName", "lastName"],
      },
    });
    return account;
  }

  public async findAccountByUserId(uid: number) {
    const account = await db.Account.findOne({ where: { userId: uid } });
    return account;
  }

  public async verifyTidUniqueness(tid: string): Promise<boolean> {
    const trans = await db.Transaction.findOne({
      where: {
        transactionId: tid,
      },
    });
    return trans === null;
  }

  public async createTransaction(data: ITransaction): Promise<typeof db.Transaction> {
    const newTrans = await db.Transaction.create(data);
    return newTrans;
  }

  public async userTrasactionHistory(userId: number): Promise<typeof db.Transaction> {
    const allTrans = await this.redisService.cacheAndGet(
      Constants.TRANSACTION_HISTORY_KEY + `_${String(userId)}`,
      async () => {
        const trans = await db.Transaction.findAll({
          where: { userId },
          order: [["createdAt", "DESC"]],
        });
        return trans;
      },
      180 //3minutes
    );
    return allTrans;
  }

  public async getTransactionById(id: number): Promise<typeof db.Transaction> {
    const transaction = await db.Transaction.findByPk(id);
    return transaction;
  }

  public async executeTransaction(trans: typeof db.Transaction): Promise<boolean> {
    try {
      const sourceAccount = await db.Account.findByPk(trans.sourceAccountId);
      const destinationAccount = await db.Account.findByPk(trans.destinationAccountId);

      if (Number(sourceAccount.balance) < Number(trans.amount)) {
        throw new Error("Insufficient funds in the source account");
      }

      sourceAccount.balance = Number(sourceAccount.balance) - Number(trans.amount);
      await sourceAccount.save();

      destinationAccount.balance = Number(destinationAccount.balance) + Number(trans.amount);
      await destinationAccount.save();

      return true;
    } catch (error: any) {
      console.error("Error executing transaction:", error.message);
      return false;
    }
  }

  public async finalizeSender(execStatus: boolean, tid: number): Promise<void> {
    if (execStatus === true) {
      let transaction = await this.getTransactionById(tid);
      transaction.status = "completed";
      await transaction.save();
    } else {
      let transaction = await this.getTransactionById(tid);
      transaction.status = "failed";
      await transaction.save();
    }
  }
}

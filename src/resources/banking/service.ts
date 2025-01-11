import { IAccount } from "../banking/types";
import { Account } from "../../models/account";

export default class AccountService {
  public async createAccount(data: any) {
    const account = await Account.create(data);
    return account;
  }
}

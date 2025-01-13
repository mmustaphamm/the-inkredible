export interface IAccount {
  id?: number;
  userId: number;
  accountNumber: string;
}

export interface ITransaction {
  transactionId: string;
  userId: number;
  sourceAccountId: number;
  destinationAccountId: number;
  type: "debit" | "credit";
  amount: number;
  status: "pending" | "completed" | "failed";
  reference?: string;
}

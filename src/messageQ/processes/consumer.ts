import RedisService from "../../utils/redis";
import { Constants } from "../../config/constants";
import { RedisClientType } from "redis";
import UserService from "../../resources/users/service";
import TransactionService from "../../resources/banking/service";
import { ITransaction } from "../../resources/banking/types";
import { Generate } from "../../utils/generate";

class QConsumer {
  private client: RedisClientType;
  private userService: UserService = new UserService();
  private transactionService: TransactionService = new TransactionService();
  private generate: Generate = new Generate();

  // public async startConsumer() {
  //   while (true) {
  //     try {
  //       this.client = await RedisService.getRedisClient();

  //       //Dequeue and Process Transactions
  //       const transactionQueue = await this.client.brPop(Constants.TRANSACTION_MQ_KEY, 0);
  //       if (transactionQueue) {
  //         await this.transactionConsumer(JSON.parse(transactionQueue.element));
  //       }
  //     } catch (error) {
  //       console.error("Error starting queues consumer:", error);
  //     }
  //   }
  // }
  // THIS CANNOT WORK FINE ON THE SAME SERVER INSTANCE, EVENT LOOP IS BEING BLOCKED AS SOON AS IT STARTED. 
  // A DEDICATED SERVER IS NEEDED TO EXECUTE CONSUMER PROPERLY, HOWEVERY, IT'S BETTER THAN PUB/SUB BECAUSE OF QUEUEING ABILITY.

  public async startConsumer() {
    try {
      this.client = await RedisService.getRedisClient();
      const subscriber = this.client.duplicate();

      await subscriber.connect()
      await subscriber.subscribe(Constants.TRANSACTION_MQ_KEY, async (message) =>{
        await this.transactionConsumer(JSON.parse(message))
      })
    } catch (error) {
      console.error("Error initializing Redis subscriber:", error);
    }
  }

  private async transactionConsumer(data: any): Promise<any> {
    try {
      const receiverDtls = await this.userService.userById(Number(data.recId));
      const transactionDtls = await this.transactionService.getTransactionById(Number(data.transId));

      //check source account and charge and credit the rec, if couldn't be charged, set to failed
      const exectrans = await this.transactionService.executeTransaction(transactionDtls);

      if (exectrans !== true) {
        await this.transactionService.finalizeSender(false, transactionDtls.id);
        return
      }

      await this.transactionService.finalizeSender(true, transactionDtls.id);

      const uniqueRef = await this.generate.transactionRef();

      const receiverLedger: ITransaction = {
        transactionId: `CRD-${uniqueRef}`,
        userId: Number(receiverDtls.id),
        sourceAccountId: transactionDtls.sourceAccountId,
        destinationAccountId: transactionDtls.destinationAccountId,
        type: "credit",
        amount: Number(transactionDtls.amount),
        status: "completed",
        reference: transactionDtls.reference,
      };

      await this.transactionService.createTransaction(receiverLedger);
      //then can send credit notification
      return
    } catch (error) {
      throw Error("Error processing transaction consumer");
    }
  }

  public async stopConsumer() {
    try {
      if (this.client) {
        console.log("Stopping consumer...");
        await this.client.quit();
        console.log("Consumer stopped.");
      }
    } catch (error) {
      console.error("Error stopping the consumer:", error.message);
      process.exit(1);
    }
  }
}

export default QConsumer;

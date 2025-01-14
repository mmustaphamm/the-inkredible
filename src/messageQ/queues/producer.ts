import RedisService from "../../utils/redis";
import { Constants } from "../../config/constants";
import { RedisClientType } from "redis";

class QProducer {
  private client: RedisClientType | undefined;

  public async transactionProducer(data: any): Promise<string> {
    try {
      this.client = await RedisService.getRedisClient();
      // await this.client.lPush(Constants.TRANSACTION_MQ_KEY, JSON.stringify(data)); disable MQ
      await this.client.publish(Constants.TRANSACTION_MQ_KEY, JSON.stringify(data)); //enabled Pub/Sub
      return "Transaction being proccessed";
    } catch (error) {
      throw Error("Error in enqueueing request");
    }
  }
}

export default QProducer;

import { createClient, RedisClientType } from "redis";

class RedisService {
  private client: RedisClientType;
  private isClientReady: boolean = false;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            return new Error("Retry attempts exhausted: Too many attempts to connect.");
          }
          return Math.min(retries * 50, 2000);
        },
        connectTimeout: 10000,
        keepAlive: 5000,
      },
    });

    this.client.on("error", (err) => {
      console.error("Error connecting to Redis Client:", err);
    });

    this.client.on("ready", () => {
      this.isClientReady = true;
      console.log("Connected to Redis server ⚡️");
    });

    this.client.on("end", () => {
      this.isClientReady = false;
      console.log("Redis client disconnected.");
    });
  }

  public async start() {
    try {
      await this.client.connect();
    } catch (err) {
      console.error("Failed to initialize Redis:", err);
    }
  }

  public async getRedisClient(): Promise<RedisClientType> {
    try {
      if (!this.isClientReady) {
        throw new Error("Redis client is not ready.");
      }
      return this.client;
    } catch (error) {
      console.error("Error retrieving Redis Instance:", error);
      return null;
    }
  }

  private async getVal<T>(key: string): Promise<string | null> {
    try {
      if (!this.isClientReady) {
        throw new Error("Redis client is not ready.");
      }
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error("Error retrieving key from Redis:", err);
      return null;
    }
  }

  private async setVal<T>(key: string, value: T, ttl: number): Promise<boolean> {
    try {
      if (!this.isClientReady) {
        throw new Error("Redis client is not ready.");
      }
      await this.client.setEx(key, ttl, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error("Error setting key in Redis:", err);
      return false;
    }
  }

  private async delVal(key: string): Promise<boolean> {
    try {
      if (!this.isClientReady) {
        throw new Error("Redis client is not ready.");
      }
      await this.client.del(key);
      return true;
    } catch (err) {
      console.error("Error deleting key from Redis:", err);
      return false;
    }
  }

  public async cacheAndGet(key: string, cb: () => Promise<any>, ttl: number): Promise<any> {
    const getCache = await this.getVal(key);

    if (getCache && getCache !== "null" && getCache !== "") {
      return JSON.parse(getCache);
    }

    const request = await cb();

    await this.setVal(key, JSON.stringify(request), ttl);

    return request;
  }

  public async updateVal<T>(key: string, cb: () => Promise<any>, ttl: number): Promise<boolean> {
    await this.delVal(key);

    const request = await cb();
    await this.setVal(key, JSON.stringify(request), ttl);

    return true;
  }
}

export default new RedisService();

import RedisService from "../../utils/redis";
import { Constants } from "../../config/constants";
import db from "../../models";

export default class UserService {
  public async createUser(data: any) {
    const userData = await db.User.create(data);
    return userData;
  }

  public async userExist(email: string): Promise<typeof db.User> {
    try {
      const userExist = await db.User.findOne({
        where: { email },
      });
      return userExist;
    } catch (error: any) {
      console.log(error);
      throw Error(error.message);
    }
  }

  public async userById(id: number): Promise<typeof db.User> {
    const userExist = await db.User.findByPk(id);
    return userExist;
  }

  public async findUser(id: number): Promise<typeof db.User> {
    const user = await RedisService.cacheAndGet(
      Constants.CACHE_USER_PROFILE + `_${String(id)}`,
      async () => {
        const userWithAccount = await db.User.findOne({
          where: { id },
          attributes: {
            exclude: ["createdAt", "updatedAt", "authCode", "authExp", "password", "verified"],
          },
          include: [
            {
              model: db.Account,
              as: "account",
              attributes: { exclude: ["createdAt", "updatedAt", "userId"] },
            },
          ],
        });
        return userWithAccount;
      },
      36000
    );

    return user;
  }

  public async userAccounts(): Promise<any> {
    const users = await RedisService.cacheAndGet(
      Constants.CACHE_USERS_ACCOUNT,
      async () => {
        const usersWithAccounts = await db.User.findAll({
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "authCode",
              "authExp",
              "password",
              "verified",
              "role",
              "middleName",
            ],
          },
          include: [
            {
              model: db.Account,
              as: "account",
              attributes: {
                exclude: ["createdAt", "updatedAt", "userId", "id", "accountType", "balance"],
              },
            },
          ],
          raw: true,
          nest: true,
        });
        return usersWithAccounts;
      },
      300
    );

    return users;
  }

  public async cacheAfterUpdate(id: number): Promise<boolean> {
    const user = await RedisService.updateVal(
      Constants.CACHE_USER_PROFILE + `_${String(id)}`,
      async () => {
        const userWithAccount = await db.User.findOne({
          where: { id },
          attributes: {
            exclude: ["createdAt", "updatedAt", "authCode", "authExp", "password", "verified"],
          },
          include: [
            {
              model: db.Account,
              as: "account",
              attributes: { exclude: ["createdAt", "updatedAt", "userId"] },
            },
          ],
        });
        return userWithAccount;
      },
      36000 //10hrs
    );

    return user;
  }
}

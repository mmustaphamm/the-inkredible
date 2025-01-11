import { IUser } from "./types";
import User from "../../models/user";

export default class UserService {
  public async createUser(data: any) {
    const userData = await User.create(data);
    return userData;
  }

  public async userExist(email: string): Promise<User> {
    const userExist = await User.findOne({
      where: { email },
    });
    return userExist;
  }
}

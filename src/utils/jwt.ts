import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

class JwtService {
  private readonly jwtSecret: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || "";

    if (!this.jwtSecret) {
      throw new Error("JWT secret is not in the environment variables.");
    }
  }

  public static async hashPasswords(password: string): Promise<string> {
    try {
      const saltRounds = process.env.HASH_SALT || 12;
      const hash: string = await bcrypt.hash(password, Number(saltRounds));
      return hash;
    } catch (error: any) {
      throw new Error("Error generating access token");
    }
  }

  public generateAccessToken(id: number, email: string, role: string = "customer"): string {
    try {
      return jwt.sign({ id, email, role }, this.jwtSecret, { expiresIn: "10h" });
    } catch (error: any) {
      throw new Error("Error generating access token");
    }
  }

  public async validateAccessToken(token: string): Promise<any> {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public logoutUser(id: number, email: string, role: string = "customer"): string {
    try {
      return jwt.sign({ id, email, role }, this.jwtSecret, { expiresIn: 10 });
    } catch (error: any) {
      throw new Error("Error logging out user");
    }
  }
}

export default JwtService;

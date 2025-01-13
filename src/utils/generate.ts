import AccountService from "../resources/banking/service";

export class Generate {
  private lettersUpper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  private digits = "0123456789";
  private chars = `${this.lettersUpper}$${this.digits}`;
  private len = 10;
  private accountService: AccountService = new AccountService();

  public static async authCode(digit: number): Promise<string> {
    try {
      let pin = "";
      for (let i = 0; i < digit; i++) {
        const num = Math.floor(Math.random() * 10);
        pin += num;
      }
      return pin;
    } catch (error) {
      console.error(`Error occurred while generating auth code: ${error}`);
      return "Failed to generate authentication code.";
    }
  }

  public static async accountNumber(): Promise<string> {
    try {
      const startNum = Math.floor(2000 + Math.random() * 1000); // Random number between 2000-3000
      const remainingDigits = 6;
      let pin = startNum.toString();

      for (let i = 0; i < remainingDigits; i++) {
        const num = Math.floor(Math.random() * 10);
        pin += num;
      }

      return pin;
    } catch (error) {
      console.error(`Error occurred while generating account number: ${error}`);
      return "Failed to generate account number.";
    }
  }

  public async transactionRef(): Promise<string | null> {
    let uniqref = "";
    const charsetLength = this.chars.length;

    for (let i = 0; i < this.len; i++) {
      const randomIndex = Math.floor(Math.random() * charsetLength);
      uniqref += this.chars.charAt(randomIndex);
    }

    const tidBool = await this.accountService.verifyTidUniqueness(uniqref);
    if (!tidBool) {
      return this.transactionRef();
    }

    return uniqref;
  }
}

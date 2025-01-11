export class Generate {
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
}

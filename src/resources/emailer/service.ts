import nodemailer, { Transporter } from "nodemailer";
import verifyEmailTemplate from "../../views/verifyEmailTemplate";

interface mailClass {
  firstName: string;
  lastName: string;
  email: string;
}

class SendMail {
  private firstName: string;
  private lastName: string;
  private email: string;
  private readonly sender: string;

  constructor(data: mailClass) {
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.sender = String(process.env.MAILTRAP_USER);
  }

  private async createTransport() {
    const transport: Transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    return transport;
  }

  private async sendMsg(subject: string, html: string) {
    const mailOptions = {
      from: {
        name: process.env.MAIL_SENDER,
        address: this.sender,
      },
      to: this.email,
      subject,
      html,
      text: html,
    };

    const mail = await this.createTransport();
    await mail.sendMail(mailOptions);
  }

  public async sendVerifyEmail(pin: string) {
    const subject = "Welcome On Board, Verify Your Account";
    const names = `${this.firstName} ${this.lastName}`;
    const html = verifyEmailTemplate(names, pin);
    this.sendMsg(subject, html);
  }
}

export default SendMail;

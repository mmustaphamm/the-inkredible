export interface IUser {
  id?: number;
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  password: string;
  role?: string;
  authCode: string;
  authExp: string;
}

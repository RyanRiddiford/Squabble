export interface UpdateAccountRequest {
  username: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  middleName?: string;
  surname?: string;
  avatarString?: string;
}

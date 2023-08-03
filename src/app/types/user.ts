export interface IUser {
  userName: string;
  firstName: string;
  middleName: string;
  surname: string;
  email: string;
  accountId: number;
  isSso: boolean;
  microsoftSsoId: string;
  communicationUserId: string;
  communicationToken: string;
  avatar: string;
}

export class User implements IUser {
  userName: string = '';
  firstName: string = '';
  middleName: string = '';
  surname: string = '';
  email: string = '';
  accountId: number = -1;
  isSso: boolean = false;
  microsoftSsoId: string = '';
  communicationUserId: string = '';
  communicationToken: string = '';
  avatar: string = '';

  constructor() {}
}

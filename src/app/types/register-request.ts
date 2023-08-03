export interface RegisterRequest {
  UserName: string;
  Email: string;
  FirstName: string;
  Surname: string;
  MicrosoftSsoId?: string;
  Password?: string;
  ConfirmPassword?: string;
  SecurityQuestionOne?: string;
  SecurityAnswerOne?: string;
  SecurityQuestionTwo?: string;
  SecurityAnswerTwo?: string;
}

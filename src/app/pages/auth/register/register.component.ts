import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { SocialAuthService } from 'angularx-social-login';
import { RegisterRequest } from '../../../types/register-request';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-auth-register',
  templateUrl: './register.component.html',
  styleUrls: ['../auth.component.scss', './register.component.scss']
})
export class RegisterComponent implements OnInit {
  apiErrorMessage: string | null = null;
  faSpinner = faSpinner;
  microsoftSsoId: string | null = null;
  isSsoRegistration: boolean = false;
  processingRegistration: boolean = false;

  registerForm = new FormGroup({
    username: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
    firstName: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    secQuestionOne: new FormControl(''),
    secAnswerOne: new FormControl(''),
    secQuestionTwo: new FormControl(''),
    secAnswerTwo: new FormControl(''),
  });

  get username() { return this.registerForm.get('username') as FormControl; }
  get email() { return this.registerForm.get('email') as FormControl; }
  get password() { return this.registerForm.get('password') as FormControl; }
  get confirmPassword() { return this.registerForm.get('confirmPassword') as FormControl; }
  get firstName() { return this.registerForm.get('firstName') as FormControl; }
  get surname() { return this.registerForm.get('surname') as FormControl; }
  get secQuestionOne() { return this.registerForm.get('secQuestionOne') as FormControl; }
  get secAnswerOne() { return this.registerForm.get('secAnswerOne') as FormControl; }
  get secQuestionTwo() { return this.registerForm.get('secQuestionTwo') as FormControl; }
  get secAnswerTwo() { return this.registerForm.get('secAnswerTwo') as FormControl; }

  constructor(
    private route: ActivatedRoute,
    private authService: SocialAuthService,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
          if (params.hasOwnProperty('sso') && params.sso === 'true') {
            this.isSsoRegistration = true;
          } else {
            this.password.setValidators([Validators.required]);
            this.confirmPassword.setValidators([Validators.required]);
            this.secQuestionOne.setValidators([Validators.required]);
            this.secAnswerOne.setValidators([Validators.required]);
            this.secQuestionTwo.setValidators([Validators.required]);
            this.secAnswerTwo.setValidators([Validators.required]);
          }

          if (params.hasOwnProperty('microsoftSsoId')) {
            this.microsoftSsoId = params.microsoftSsoId;
          }
        }
      );
  }

  registerUser() {
    this.processingRegistration = true;

    const registerBody: RegisterRequest = {
      UserName: this.registerForm.get('username')?.value,
      Email: this.registerForm.get('email')?.value,
      FirstName: this.registerForm.get('firstName')?.value,
      Surname: this.registerForm.get('surname')?.value
    }

    if (this.isSsoRegistration) {
      registerBody.MicrosoftSsoId = this.microsoftSsoId as string;
    } else {
      registerBody.Password = this.registerForm.get('password')?.value
      registerBody.ConfirmPassword = this.registerForm.get('confirmPassword')?.value
      registerBody.SecurityQuestionOne = this.registerForm.get('secQuestionOne')?.value
      registerBody.SecurityAnswerOne = this.registerForm.get('secAnswerOne')?.value
      registerBody.SecurityQuestionTwo = this.registerForm.get('secQuestionTwo')?.value
      registerBody.SecurityAnswerTwo = this.registerForm.get('secAnswerTwo')?.value
    }

    this.http.post(`${environment.apiUrlBase}/api/Login/Register`, registerBody)
      .subscribe(
        async (data: any) => {
          const token = data.token;
          const tokenData = new JwtHelperService().decodeToken(data.token);

          // Store token data.
          localStorage.setItem('accountId', tokenData.account_id);
          localStorage.setItem('accessToken', token);

          await this.router.navigate(['/dashboard']);
        },
        (error) => {
          this.apiErrorMessage = error.error;
          this.registerForm.setErrors({ apiError: true })
        }
      );
  }
}

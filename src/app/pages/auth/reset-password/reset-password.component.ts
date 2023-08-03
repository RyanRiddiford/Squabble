import {HttpClient} from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { passwordMatchValidator } from '../../../shared/form-validation/password-match.directive';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-auth-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['../auth.component.scss', './reset-password.component.scss']
})
export class ResetPasswordComponent {
  faSpinner = faSpinner;
  apiErrorMessage = "";
  showSecurityQuestions = false;
  securityQuestionOne = "";
  securityQuestionTwo = "";
  isProcessingRequest = false;

  resetPasswordForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required),
    securityAnswerOne: new FormControl('', Validators.required),
    securityAnswerTwo: new FormControl('', Validators.required)
  }, { validators: passwordMatchValidator });

  constructor(
    private http: HttpClient,
    private notification: MatSnackBar,
    private router: Router
  ) {}

  get username() { return this.resetPasswordForm.get('username') as FormControl; }

  get password() { return this.resetPasswordForm.get('password') as FormControl; }

  get confirmPassword() { return this.resetPasswordForm.get('confirmPassword') as FormControl; }

  get securityAnswerOne() { return this.resetPasswordForm.get('securityAnswerOne') as FormControl; }

  get securityAnswerTwo() { return this.resetPasswordForm.get('securityAnswerTwo') as FormControl; }

  getSecurityQuestions() {
    this.isProcessingRequest = true;
    this.http.get(`${environment.apiUrlBase}/api/Login/GetSecurityQuestions/${this.username?.value}`)
      .subscribe(
        (response) => {
        // @ts-ignore
        this.securityQuestionOne = response.securityQuestionOne;
        // @ts-ignore
        this.securityQuestionTwo = response.securityQuestionTwo;
        this.showSecurityQuestions = true;
        this.isProcessingRequest = false;
      }, (error) => {
          this.notification.open(error.error, '',
            {
              duration: 4000,
              verticalPosition: 'top',
              panelClass: ['error-notification']
            });

          this.isProcessingRequest = false;
        });
  }

  resetPassword() {
    this.isProcessingRequest = true;

    const resetPasswordBody = {
      UserName: this.username?.value,
      Password: this.password?.value,
      ConfirmPassword: this.confirmPassword?.value,
      SecurityAnswerOne: this.securityAnswerOne?.value,
      SecurityAnswerTwo: this.securityAnswerTwo?.value
    }

    this.http.post(`${environment.apiUrlBase}/api/Login/ResetPassword`, resetPasswordBody)
      .subscribe(
        async () => {
          this.isProcessingRequest = false;
          await this.router.navigate(['/auth/login']);
        },
        (error) => {
          this.apiErrorMessage = error.error;
          this.resetPasswordForm.setErrors({ apiError: true })
          this.isProcessingRequest = false;
        });
  }
}

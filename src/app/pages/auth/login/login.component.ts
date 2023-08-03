import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import {
  MicrosoftLoginProvider,
  SocialAuthService,
} from 'angularx-social-login';
import { SquabbleAuthService } from '../../../services/squabble-auth.service';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-auth-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth.component.scss', './login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    UserName: new FormControl('', Validators.required),
    Password: new FormControl('', Validators.required),
  });

  constructor(
    private authService: SocialAuthService,
    private http: HttpClient,
    private router: Router,
    private squabbleAuthService: SquabbleAuthService,
    private notification: MatSnackBar
  ) { }

  ngOnInit(): void {}

  onSubmit() {
    this.squabbleAuthService.signIn(this.loginForm).subscribe(
      async (data) => {
        const token = data.value.token;
        const tokenData = new JwtHelperService().decodeToken(data.value.token);

        // Store token data.
        localStorage.setItem('accountId', tokenData.account_id);
        localStorage.setItem('accessToken', token);


        this.router.navigate(['/dashboard']);
      },
      (err) => {
        this.openNotification('Incorrect User Name or Password')
      }
    );
  }

  async signInWithMicrosoft(): Promise<void> {
    this.authService.signIn(MicrosoftLoginProvider.PROVIDER_ID);
    await this.router.navigate(['/sso']);
  }

  openNotification(message: string) {
    this.notification.open(message, '',
      {
        duration: 4000,
        verticalPosition: 'top',
        panelClass: ['error-notification']
      });
  }
}

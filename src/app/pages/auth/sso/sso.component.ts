import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { SocialAuthService } from 'angularx-social-login';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-auth-sso',
  templateUrl: './sso.component.html'
})
export class SsoComponent implements OnInit {
  faSpinner = faSpinner;

  constructor(private route: ActivatedRoute, private authService: SocialAuthService, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.http.get('https://graph.microsoft.com/v1.0/me', {
        headers: {
          Authorization: user.authToken
        }
      }).subscribe((profile) => {
        this.http.post(`${environment.apiUrlBase}/api/Login/Login`, {
          Sso: true,
          // @ts-ignore
          MicrosoftSsoId: profile.id
        }).subscribe(async (response: any) => {
          if (response.hasOwnProperty('redirectTo') && response.redirectTo) {
            await this.router.navigate([response.redirectTo], { queryParams: response.queryParams});
          } else {
            const token = response.token;
            const tokenData = new JwtHelperService().decodeToken(response.token);

            // Store token data.
            localStorage.setItem('accountId', tokenData.account_id);
            localStorage.setItem('accessToken', token);

            await this.router.navigate(['/dashboard']);
          }
        })
      });
    });
  }
}

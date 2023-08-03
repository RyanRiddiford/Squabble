import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SquabbleAuthService implements OnDestroy {
  private unsubscribe: Subscription[] = [];
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  jwtHelper: JwtHelperService;

  constructor(private http: HttpClient) {
    this.jwtHelper = new JwtHelperService();
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  isAuthenticated(): boolean {
    const accessToken = localStorage.getItem('accessToken');
    return !this.jwtHelper.isTokenExpired(accessToken as string);
  }

  signIn(signInGroup: FormGroup): Observable<any> {
    const url = `${environment.apiUrlBase}/api/Login/Login`;
    return this.http.post<any>(url, signInGroup.value, this.httpOptions);
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('accountId');
    window.location.href = environment.siteUrlBase;
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AcsTokenService {
  apiUrl: string = `${environment.apiUrlBase}/api/UserToken`;

  constructor(private http: HttpClient) {}

  /** get a communication user id */
  getUser() {
    const url = `${this.apiUrl}/GetUser`;

    return this.http.get(url);
  }

  /** get a communication user id and token */
  getUserAndToken() {
    const url = `${this.apiUrl}/GetUserAndToken`;

    return this.http.get(url);
  }

  /** refresh token */
  refreshToken(id: string) {
    const url = `${this.apiUrl}/GetRefreshToken/${id}`;

    return this.http.get(url);
  }

  /** Refreshes a user's access token.
   * Explicitly returns just the token for the proactive refresh configuration */
  async explicitRefreshTokenAsync(id: string): Promise<string> {
    let token = '';
    const url = `${this.apiUrl}/GetRefreshToken/${id}`;

    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      }),
    };

    try {
      this.http.get(url, httpOptions).subscribe(async (data: any) => {
        token = data.token;
        //console.log("In acs service. Updated Token: " + data.token);
        return token;
      });
    } catch (e) {
      console.log('failed to refresh token');
      console.log(e);
    } finally {
      return token;
    }
  }
}

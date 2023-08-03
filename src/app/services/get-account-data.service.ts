import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../types/user';

@Injectable({
  providedIn: 'root',
})
export class GetAccountDataService {
  apiUrl = `${environment.apiUrlBase}/api/Account`;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    }),
  };

  constructor(private http: HttpClient) {}

  /** get user data for the logged in user */
  getAccountData(): Observable<any> {
    return this.http.get<any>(this.apiUrl, this.httpOptions);
  }

  /** get a user by their CommunicationUserId */
  async getUserByCommunicationUserId(id: string) {
    const url = this.apiUrl + `/GetByCommunicationUserId/${id}`;
    let user: User = new User();
    await this.http
      .get<any>(url, this.httpOptions)
      .toPromise()
      .then((data: User) => {
        user = data;
      });
    return user;
  }

  /** get a user by their CommunicationUserId observable version */
  getUserByCommunicationUserIdObservable(id: string) {
    const url = this.apiUrl + `/GetByCommunicationUserId/${id}`;
    return this.http.get<any>(url, this.httpOptions);
  }

  /** return a user object with account data populated. */
  async getCurrentUserData(): Promise<User> {
    let user: User = new User();
    await this.getAccountData()
      .toPromise()
      .then((data) => {
        user.accountId = data.accountId;
        user.firstName = data.firstName;
        user.middleName = data.middleName;
        user.surname = data.surname;
        user.email = data.email;
        user.isSso = data.isSso;
        user.microsoftSsoId = data.microsoftSsoId;
        user.userName = data.userName;
        user.communicationUserId = data.communicationUserId;
        user.communicationToken = data.communicationToken;
      });
    return user;
  }
}

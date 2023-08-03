import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UpdateAccountRequest } from '../types/update-account-request';
import { IUser } from '../types/user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SquabbleAccountService {
  private _accountData = new BehaviorSubject({} as IUser);
  accountData = this._accountData.asObservable();

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    }),
  };

  constructor(private http: HttpClient) {}

  refreshAccountData(): void {
    const url = `${environment.apiUrlBase}/api/Account`;
    this.http.get<any>(url, this.httpOptions).subscribe((data) => {

      this._accountData.next(data);
    });
  }

  updateAccountData(
    updateAccountRequest: UpdateAccountRequest
  ): Observable<void> {
    const url = `${environment.apiUrlBase}/api/Account`;
    return this.http.put<any>(url, updateAccountRequest, this.httpOptions);
  }
}

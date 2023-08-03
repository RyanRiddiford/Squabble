import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { FormGroup } from '@angular/forms';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GetUserByUsernameService {
  constructor(private http: HttpClient) {}

  /** get user data by username */
  getUserData(addUserForm: FormGroup): Observable<any> {
    let userName = addUserForm.value.username;

    let apiUrl = `${environment.apiUrlBase}/api/Account/GetByUserName/${userName}`;

    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      }),
    };
    return this.http.get<any>(apiUrl, httpOptions);
  }
}

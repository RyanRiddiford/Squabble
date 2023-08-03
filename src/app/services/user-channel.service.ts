import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserChannelService {
  private userEventSubject = new Subject<any>();

  constructor(private http: HttpClient) {}

  /** send a channel related user event update */
  sendUserUpdate(message: string) {
    this.userEventSubject.next({ text: message });
  }

  /** get channel related event updates */
  getUserUpdate(): Observable<any> {
    return this.userEventSubject.asObservable();
  }

  /** remove user from a channel */
  removeUser(addUserForm: FormGroup): Observable<any> {
    let apiUrl = `${environment.apiUrlBase}/api/Channel/RemoveUser`;

    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      }),
    };
    return this.http.post<any>(apiUrl, addUserForm.value, httpOptions);
  }

  /** add user to a channel */
  addUser(addUserForm: FormGroup): Observable<any> {
    let apiUrl = `${environment.apiUrlBase}/api/Channel/AddUser`;

    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      }),
    };
    return this.http.post<any>(apiUrl, addUserForm.value, httpOptions);
  }
}

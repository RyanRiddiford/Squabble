import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SquabbleTeamService {
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    }),
  };
  private _reloadTeamList = new BehaviorSubject(false);
  private _selectedServer = new BehaviorSubject(null);
  private _selectedServerOwner = new BehaviorSubject(null);
  private _selectedServerAdmins = new BehaviorSubject(null);
  private _selectedServerMembers = new BehaviorSubject(null);

  reloadTeamList = this._reloadTeamList.asObservable();
  selectedServer = this._selectedServer.asObservable();
  selectedServerOwner = this._selectedServerOwner.asObservable();
  selectedServerAdmins = this._selectedServerAdmins.asObservable();
  selectedServerMembers = this._selectedServerMembers.asObservable();

  constructor(private http: HttpClient) {}

  triggerReloadTeamList() {
    this._reloadTeamList.next(true);
  }

  createTeam(createTeamGroup: FormGroup): Observable<any> {
    let apiUrl = `${environment.apiUrlBase}/api/Server`;
    return this.http.post<any>(apiUrl, createTeamGroup.value, this.httpOptions);
  }

  getServerById(serverId: number): Observable<any> {
    let apiUrl = `${environment.apiUrlBase}/api/Server/${serverId}`;
    return this.http.get<any>(apiUrl, this.httpOptions);
  }

  addUserToTeam(addUserForm: FormGroup): Observable<any> {
    let apiUrl = `${environment.apiUrlBase}/api/Server/AddUser`;
    return this.http.post<any>(apiUrl, addUserForm.value, this.httpOptions);
  }

  getServerOwner(serverId: number): Observable<any> {
    let apiUrl = `${environment.apiUrlBase}/api/Server/GetOwner/${serverId}`;
    return this.http.get<any>(apiUrl, this.httpOptions);
  }

  getServerAdmins(serverId: number): Observable<any> {
    let apiUrl = `${environment.apiUrlBase}/api/Server/GetAdmins/${serverId}`;
    return this.http.get<any>(apiUrl, this.httpOptions);
  }

  getServerMembers(serverId: number): Observable<any> {
    let apiUrl = `${environment.apiUrlBase}/api/Server/GetUsers/${serverId}`;
    return this.http.get<any>(apiUrl, this.httpOptions);
  }

  getIDsOfAllJoinedTeams(): Observable<any> {
    const accessToken = localStorage.getItem('accessToken');
    const tokenData = new JwtHelperService().decodeToken(accessToken);
    let apiUrl = `${environment.apiUrlBase}/api/Server/GetServers/${tokenData.account_id}`;
    return this.http.get<any>(apiUrl, this.httpOptions);
  }

  replaceOwner(serverId: number, accountId: number) {
    const apiUrl = `${environment.apiUrlBase}/api/Server/ReplaceOwner`;
    const body = {
      ServerId: serverId,
      AccountId: accountId,
    };
    return this.http.post(apiUrl, body, this.httpOptions);
  }

  makeAdmin(serverId: number, accountId: number) {
    const apiUrl = `${environment.apiUrlBase}/api/Server/MakeAdmin`;
    const body = {
      ServerId: serverId,
      AccountId: accountId,
    };
    return this.http.post(apiUrl, body, this.httpOptions);
  }

  makeMember(serverId: number, accountId: number) {
    const apiUrl = `${environment.apiUrlBase}/api/Server/MakeMember`;
    const body = {
      ServerId: serverId,
      AccountId: accountId,
    };
    return this.http.post(apiUrl, body, this.httpOptions);
  }

  removeUser(serverId: number, accountId: number) {
    const apiUrl = `${environment.apiUrlBase}/api/Server/RemoveUser`;
    const body = {
      ServerId: serverId,
      UserId: accountId
    }
    return this.http.post(apiUrl, body, this.httpOptions);
  }
}

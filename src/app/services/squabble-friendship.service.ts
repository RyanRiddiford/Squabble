import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { FriendInfo } from '../types/friendInfo';
import { map } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { PendingFriendRequestResponse } from '../types/pending-friend-request-response';

@Injectable({
  providedIn: 'root',
})
export class SquabbleFriendshipService {
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    }),
  };

  private _friendList = new BehaviorSubject([]);
  friendList = this._friendList.asObservable();
  private _pendingFriendList: BehaviorSubject<PendingFriendRequestResponse[]> =
    new BehaviorSubject([] as PendingFriendRequestResponse[]);
  pendingFriendList = this._pendingFriendList.asObservable();

  constructor(private http: HttpClient) {}

  reloadFriendList(): void {
    this.getFriends().subscribe((data) => {
      this._friendList.next(data);
    });

    this.getPendingFriendRequests().subscribe((data) => {
      this._pendingFriendList.next(data);
    });
  }

  private getFriends(): Observable<any> {
    let apiUrl = `${environment.apiUrlBase}/api/Friendship/GetFriends`;
    return this.http.get<any>(apiUrl, this.httpOptions);
  }

  private getPendingFriendRequests(): Observable<any> {
    let apiUrl = `${environment.apiUrlBase}/api/FriendRequest/GetPendingFriendRequests`;
    return this.http.get<any>(apiUrl, this.httpOptions);
  }

  /**
   * Send a friend request to another user.
   */
  sendFriendRequest(friendId: number): Observable<any> {
    const apiUrl = `${environment.apiUrlBase}/api/FriendRequest`;
    const body = {
      FriendId: friendId,
    };
    return this.http.post<any>(apiUrl, body, this.httpOptions);
  }

  acceptFriendRequest(
    friendRequestId: number,
    accepted: boolean
  ): Observable<any> {
    const apiUrl = `${environment.apiUrlBase}/api/FriendRequest/AcceptFriendRequest`;
    const body = {
      FriendRequestId: friendRequestId,
      Accepted: accepted,
    };
    return this.http.post<any>(apiUrl, body, this.httpOptions);
  }

  //TODO possible solution
  getFriendsList(id: number) {
    let apiUrl = `${environment.apiUrlBase}/api/Friendship/GetFriends/${id}`;
    return this.http
      .get<FriendInfo[]>(apiUrl, this.httpOptions)
      .pipe(map((response) => response));
  }
}

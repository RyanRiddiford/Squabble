import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChannelMemberInfo } from '../types/channel-member-info';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    }),
  };

  constructor(private http: HttpClient) {}

  createChannel(
    serverId: number | null,
    channelName: string,
    azureChatThreadId: string
  ): Observable<any> {
    const apiUrl = `${environment.apiUrlBase}/api/Channel`;

    const createChannelBody = {
      ServerId: serverId,
      ChannelName: channelName,
      AzureChatThreadId: azureChatThreadId,
    };

    return this.http.post(apiUrl, createChannelBody, this.httpOptions);
  }

  getOneToOneConversation(friendId: number): Observable<any> {
    const apiUrl = `${environment.apiUrlBase}/api/Channel/GetOneToOneChannel/${friendId}`;
    return this.http.get(apiUrl, this.httpOptions);
  }

  //Get the acs ids of users in a channel
  getMemberAcsIds(id: number): Observable<any> {
    const apiUrl = `${environment.apiUrlBase}/api/Channel/GetMemberAcsIds/${id}`;

    return this.http
      .get<ChannelMemberInfo[]>(apiUrl, this.httpOptions)
      .pipe(map((response) => response));
  }

  getByThreadId(id: string): Observable<any> {
    const apiUrl = `${environment.apiUrlBase}/api/Channel/GetByThreadId/${id}`;
    return this.http.get<any>(apiUrl);
  }

  getUserChannelsForServer(serverId: number): Observable<any> {
    const apiUrl = `${environment.apiUrlBase}/api/Server/GetChannels/${serverId}`;
    return this.http.get(apiUrl, this.httpOptions);
  }
}

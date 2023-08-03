import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { FormGroup } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class SquabbleKanbanService {
  apiUrl = `${environment.apiUrlBase}/api/Kanban`;
  tokenData = new JwtHelperService().decodeToken(
    localStorage.getItem('accessToken')!
  );

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    }),
  };

  constructor(private http: HttpClient) {}

  getItems(): Observable<any> {
    return this.http.get<any>(this.apiUrl, this.httpOptions);
  }

  addItem(item: any): Observable<any> {
    let itemWithUserID = {
      userID: this.tokenData.account_id,
      kanbanItemID: item.kanbanItemID,
      listName: item.listName,
      itemName: item.itemName,
      position: item.position,
    };
    return this.http.post<any>(this.apiUrl, itemWithUserID, this.httpOptions);
  }

  updateItem(item: any): Observable<any> {
    let itemWithUserID = {
      userID: this.tokenData.account_id,
      kanbanItemID: item.kanbanItemID,
      listName: item.listName,
      itemName: item.itemName,
      position: item.position,
    };

    return this.http.put<any>(this.apiUrl, itemWithUserID, this.httpOptions);
  }

  deleteItem(key: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${key}`, this.httpOptions);
  }
}

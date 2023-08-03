import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Post } from '../types/post';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AddPostToDatabaseService {
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    }),
  };

  constructor(private http: HttpClient) {}

  /** save a chat message to the database */
  addPost(post: Post): Observable<any> {
    const url = `${environment.apiUrlBase}/api/post`;
    return this.http.post<any>(url, post, this.httpOptions);
  }
}

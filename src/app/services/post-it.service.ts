import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PostIt } from '../components/post-it-dialog/post-it-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class PostItService {
  private apiUrl = 'http://localhost:5188/api/GiornateLavorative'

  constructor(private http: HttpClient) { }

  // getPostIt(): Observable<PostIt[]> {
  //   return this.http.get<PostIt[]>(this.apiUrl);
  // }

  getPostItById(id: string): Observable<PostIt[]> {
    return this.http.get<PostIt[]>(`${this.apiUrl}/${id}`);
  }

   salvaPostIt(postIt: PostIt): Observable<string> {
     return this.http.post(this.apiUrl, postIt, { responseType: 'text' });
   }

  aggiornaPostIt(id: string, postIt: PostIt): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}`, postIt, { responseType: 'text' });
  }

  eliminaPostIt(id: string): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }
}

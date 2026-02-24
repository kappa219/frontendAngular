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

  //per il file di EXEL ,prendo tutti i post-it di un dipendente, senza filtrarli per settimana, cosi' da avere tutte le informazioni in un unico file
  getPostItById(id: string): Observable<PostIt[]> {
    return this.http.get<PostIt[]>(`${this.apiUrl}/${id}`);
  }

  getPostItBySettimana(id: string, dataInizio: string, dataFine: string): Observable<PostIt[]> {
    return this.http.get<PostIt[]>(`${this.apiUrl}/${id}?dataInizio=${dataInizio}&dataFine=${dataFine}`);
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

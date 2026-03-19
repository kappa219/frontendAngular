import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PostIt } from '../features/dashboard/components/post-it-dialog/post-it-dialog.component';

export interface DtoReport {
  dipendenteId: string;
  data: string;
  oreLavorate: number;
  azienda: string;
  mansione: string;
  ora: number;
  note?: string;
  titoloNota?: string;
  oraInizio: string;
  oraFine: string;
}

@Injectable({
  providedIn: 'root'
})
export class PostItService {
  private apiUrl = 'http://localhost:5188/api/GiornateLavorative'
  username: string = 'ciao mi chiamo kevin manno e mi hanno inniettato in questo servizio lo recupero da un altro componente e lo uso per fare una prova';
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

  generaReportAnnuale(anno: number, connectionId: string): Observable<any> {
    return this.http.get(`http://localhost:5015/api/report/annuale/${anno}`, {
      headers: { 'X-SignalR-ConnectionId': connectionId }
    });
  }

  scaricaReportAnnuale(anno: number): Observable<Blob> {
    return this.http.get(`http://localhost:5015/api/report/scarica/annuale/${anno}`, { responseType: 'blob' });
  }
}

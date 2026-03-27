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
/** 
 *   11,2 GiB [##########] /.config                                                                                                                                                                           
    8,5 GiB [#######   ] /.cache
    7,0 GiB [######    ] /.local
    4,8 GiB [####      ] /Scrivania
    3,8 GiB [###       ] /.npm
    3,6 GiB [###       ] /Downloads
    2,8 GiB [##        ] /Documenti
    2,7 GiB [##        ] /.vscode
    2,2 GiB [#         ] /snap
    2,1 GiB [#         ] /Immagini
    2,0 GiB [#         ] /Siti
    1,6 GiB [#         ] /.m2
    1,5 GiB [#         ] /.nvm
    1,5 GiB [#         ] /.nuget
  667,4 MiB [          ] /.gradle
  348,9 MiB [          ] /.sdkman
  346,7 MiB [          ] /.thunderbird
  253,7 MiB [          ] /.phpls
  249,5 MiB [          ] /bin
   81,8 MiB [          ] /.dotnet
   35,5 MiB [          ] /.claude
   18,8 MiB [          ] /.ServiceHub
   14,2 MiB [          ] /.eclipse
   12,6 MiB [          ]  phantomjs-1.9.8-linux-
 * 
 * 
 * 
 * 
 */
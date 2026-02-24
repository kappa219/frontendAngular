import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

export interface TipologiaLavoro {
  id: string;
  nome: string;
  descrizione: string;
}

export interface Dipendente {
  id?: string;
  nome: string;
  cognome: string;
  dataAssunzione?: string;
  dataDimissione?: string;
  eta: number;
  stipendio?: number;
  tipologiaLavoro?: TipologiaLavoro;
  codiceFiscale?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DipendentiService {

  private apiUrl = `${environment.apiUrl}/AnagrafiaDipendenti`;
  private tipologieUrl = `${environment.apiUrl}/TipologiaLavoro`;

  constructor(private http: HttpClient) { }

  getDipendenti() {
    return this.http.get<Dipendente[]>(this.apiUrl);
  }

  salvaDipendente(dipendente: Dipendente) {
    return this.http.post<Dipendente>(this.apiUrl, dipendente);
  }

  getTipologieLavoro() {
    return this.http.get<TipologiaLavoro[]>(this.tipologieUrl);
  }

  getDipendente(id: string) {
    return this.http.get<Dipendente>(`${this.apiUrl}/${id}`);
  }

  modificaDipendente(id: string, dipendente: any) {
    return this.http.put<Dipendente>(`${this.apiUrl}/${id}`, dipendente);
  }

  eliminaDipendente(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }
}
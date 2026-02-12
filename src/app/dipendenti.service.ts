import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
}

@Injectable({
  providedIn: 'root'
})
export class DipendentiService {

  constructor(private http: HttpClient) { }

  getDipendenti() {
    return this.http.get<Dipendente[]>('http://localhost:5188/api/AnagrafiaDipendenti');
  }

  salvaDipendente(dipendente: Dipendente) {
    return this.http.post<Dipendente>('http://localhost:5188/api/AnagrafiaDipendenti', dipendente);
  }

  getTipologieLavoro() {
    return this.http.get<TipologiaLavoro[]>('http://localhost:5188/api/TipologiaLavoro');
  }

  getDipendente(id: string) {
    return this.http.get<Dipendente>(`http://localhost:5188/api/AnagrafiaDipendenti/${id}`);
  }

  modificaDipendente(id: string, dipendente: any) {
    return this.http.put<Dipendente>(`http://localhost:5188/api/AnagrafiaDipendenti/${id}`, dipendente);
  }

  eliminaDipendente(id: string) {
    return this.http.delete(`http://localhost:5188/api/AnagrafiaDipendenti/${id}`);
  }
}
import { Component, signal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Messaggio {
  ruolo: 'utente' | 'assistente';
  testo: string;
  caricamento?: boolean;
}

@Component({
  selector: 'app-assistente',
  imports: [CommonModule, FormsModule],
  templateUrl: './assistente.component.html',
  styleUrl: './assistente.component.css'
})
export class AssistenteComponent implements AfterViewChecked {
  @ViewChild('chatBody') chatBody!: ElementRef;

  messaggi = signal<Messaggio[]>([
    {
      ruolo: 'assistente',
      testo: 'Ciao! Sono il tuo assistente sugli animali da compagnia. Puoi farmi domande su cani, gatti, uccelli, pesci, insetti e qualsiasi altro animale!'
    }
  ]);

  domanda = '';
  inCaricamento = false;

//   private readonly SYSTEM_PROMPT = `Sei un assistente esperto del CCNL Commercio italiano.
// Rispondi SOLO in italiano.
// Rispondi SOLO a domande riguardanti il contratto collettivo nazionale del commercio (ferie, malattia, stipendio, orari, straordinari, permessi, preavviso, ecc.).
// Se ti chiedono altro, rispondi: "Posso aiutarti solo con domande sul CCNL Commercio."
// Sii chiaro, preciso e usa un linguaggio semplice.`;

  constructor(private http: HttpClient) {}

  ngAfterViewChecked(): void {
    this.scrollInFondo();
  }

  invia(): void {
    const testo = this.domanda.trim();
    if (!testo || this.inCaricamento) return;

    this.messaggi.update(m => [...m, { ruolo: 'utente', testo }]);
    this.domanda = '';
    this.inCaricamento = true;

    this.messaggi.update(m => [...m, { ruolo: 'assistente', testo: '', caricamento: true }]);

    const storico = this.messaggi()
      .filter(m => !m.caricamento && m.testo)
      .slice(1)
      .map(m => ({
        role: m.ruolo === 'utente' ? 'user' : 'assistant',
        content: m.testo
      }));

    this.http.post<{ risposta: string }>('http://localhost:5188/api/Gemma', {
      domanda: testo,
      storico
    }).subscribe({
      next: (res) => {
        this.messaggi.update(m => {
          const nuovi = [...m];
          nuovi[nuovi.length - 1] = { ruolo: 'assistente', testo: res.risposta };
          return nuovi;
        });
        this.inCaricamento = false;
      },
      error: () => {
        this.messaggi.update(m => {
          const nuovi = [...m];
          nuovi[nuovi.length - 1] = { ruolo: 'assistente', testo: 'Errore di connessione con il modello AI. Assicurati che Ollama sia in esecuzione.' };
          return nuovi;
        });
        this.inCaricamento = false;
      }
    });
  }

  inviaConEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.invia();
    }
  }

  private scrollInFondo(): void {
    if (this.chatBody) {
      this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
    }
  }
}

import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DipendentiService, Dipendente } from '../../dipendenti.service';
import { PostItService } from '../../services/post-it.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MyCalendarComponent } from '../../calendar/calendar.component';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-dettaglio-dipendente',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MyCalendarComponent],
  templateUrl: './dettaglio-dipendente.component.html',
  styleUrls: ['./dettaglio-dipendente.component.css']
})
export class DettaglioDipendenteComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dipendentiService = inject(DipendentiService);
  private postItService = inject(PostItService);

  dipendente = signal<Dipendente | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.dipendentiService.getDipendente(id).subscribe({
        next: (data) => {
          this.dipendente.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Errore nel caricamento del dipendente');
          this.loading.set(false);
          console.error(err);
        }
      });
    }
  }

  tornaIndietro() {
    this.router.navigate(['/dashboard']);
  }

downloadexel() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    const dip = this.dipendente();
    console.log('Dipendente per Excel:', dip?.tipologiaLavoro?.descrizione);
    console.log('TipologiaLavoro completa:', dip?.tipologiaLavoro);
    console.log('Dipendente completo:', dip);
    const nomeDipendente = dip ? `${dip.nome}_${dip.cognome}` : 'dipendente';

    this.postItService.getPostItById(id).subscribe({
      next: (postIts) => {
        const righe = postIts.map((p: any) => {
          const data = new Date(p.data || p.Data);
          const giorno = data.toLocaleDateString('it-IT', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
          const oraInizio = (p.oraInizio ?? p.OraInizio ?? '').substring(0, 5);
          const oraFine = (p.oraFine ?? p.OraFine ?? '').substring(0, 5);

          // Calcola ore lavorate
          let oreLavorate = '';
          if (oraInizio && oraFine) {
            const [hI, mI] = oraInizio.split(':').map(Number);
            const [hF, mF] = oraFine.split(':').map(Number);
            const minutiTotali = (hF * 60 + mF) - (hI * 60 + mI);
            if (minutiTotali > 0) {
              oreLavorate = `${Math.floor(minutiTotali / 60)}h ${minutiTotali % 60}m`;
            }
          }

          return {
            'nomeDipendente': dip?.nome,
            'cognomeDipendente': dip?.cognome ?? '',
            'Data': giorno,
            'Ora Inizio': oraInizio,
            'Ora Fine': oraFine,
            'Ore Lavorate': oreLavorate,
            'Titolo': p.titoloNota ?? p.TitoloNota ?? '',
            'Commento': p.note ?? p.Note ?? '',
            'Descrizione': dip?.tipologiaLavoro?.descrizione ?? ''
          };
        });
        console.log('Righe da esportare:', righe);

        // Ordina per data
        righe.sort((a: any, b: any) => {
          const dateA = new Date(a['Data']).getTime();
          const dateB = new Date(b['Data']).getTime();
          return dateA - dateB;
        });



        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(righe);
        // Imposta larghezza colonne
        ws['!cols'] = [
          { wch: 15 }, // Nome
          { wch: 15 }, // Cognome
          { wch: 30 }, // Data
          { wch: 12 }, // Ora Inizio
          { wch: 12 }, // Ora Fine
          { wch: 14 }, // Ore Lavorate
          { wch: 25 }, // Titolo
          { wch: 30 }, // Commento
          { wch: 40 }, // Descrizione
        ];
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Orari');

        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `orari_${nomeDipendente}.xlsx`);
      },
      error: (err) => {
        console.error('Errore nel download Excel:', err);
      }
    });
  }





}

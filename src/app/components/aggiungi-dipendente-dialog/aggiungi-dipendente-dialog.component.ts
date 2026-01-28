import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { DipendentiService, TipologiaLavoro } from '../../dipendenti.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-aggiungi-dipendente-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  templateUrl: './aggiungi-dipendente-dialog.component.html',
  styleUrl: './aggiungi-dipendente-dialog.component.css'
})
export class AggiungiDipendenteDialogComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<AggiungiDipendenteDialogComponent>);
  private dipendentiService = inject(DipendentiService);

  tipologieLavoro = signal<TipologiaLavoro[]>( []);


  dipendente = {
    nome: '',
    cognome: '',
    eta: 0,
    stipendio: 0,
    dataAssunzione: '',
    tipologiaLavoroId: ''
  };

  ngOnInit() {
    this.dipendentiService.getTipologieLavoro().subscribe(data => {
      this.tipologieLavoro.set(data);
    });
  }

  salva() {
    this.dipendentiService.salvaDipendente(this.dipendente).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Errore nel salvataggio:', err);
        if (err.status === 401) {
          alert('Errore: ' + "non hai i permessi per eseguire questa operazione.");
          this.dialogRef.close();
        } else {
          alert('Si è verificato un errore durante il salvataggio del dipendente.');
        }
      }
    });
  }

  annulla() {
    this.dialogRef.close();
  }
}

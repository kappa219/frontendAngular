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

  tipologieLavoro = signal<TipologiaLavoro[]>([]);
  errorMessage = '';

  dipendente = {
    nome: '',
    cognome: '',
    eta: 0,
    stipendio: 0,
    dataAssunzione: null as Date | null,
    tipologiaLavoroId: ''
  };

  ngOnInit() {
    this.dipendentiService.getTipologieLavoro().subscribe(data => {
      this.tipologieLavoro.set(data);
    });
  }

  isFormValido(): boolean {
    return !!(
      this.dipendente.nome.trim() &&
      this.dipendente.cognome.trim() &&
      this.dipendente.eta > 0 &&
      this.dipendente.dataAssunzione &&
      this.dipendente.tipologiaLavoroId
    );
  }

  salva() {
    this.errorMessage = '';

    if (!this.isFormValido()) {
      this.errorMessage = 'Compila tutti i campi obbligatori.';
      return;
    }

    const payload = {
      ...this.dipendente,
      dataAssunzione: this.dipendente.dataAssunzione
        ? this.dipendente.dataAssunzione.toISOString()
        : undefined
    };
    this.dipendentiService.salvaDipendente(payload).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Errore nel salvataggio:', err);
        if (err.status === 401) {
          this.errorMessage = 'Non hai i permessi per eseguire questa operazione.';
        } else {
          this.errorMessage = 'Si è verificato un errore durante il salvataggio.';
        }
      }
    });
  }

  annulla() {
    this.dialogRef.close();
  }
}

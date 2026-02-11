import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DipendentiService, Dipendente } from '../../dipendenti.service';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AggiungiDipendenteDialogComponent } from '../aggiungi-dipendente-dialog/aggiungi-dipendente-dialog.component';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, FormsModule, RouterModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
   theAuthService = inject(AuthService);
  buttonAggiungi: boolean = false;

  displayedColumns: string[] = ['nome', 'cognome', 'dataAssunzione', 'dataDimissione', 'eta', 'stipendio', 'mansione'];

  dipendenti = signal<Dipendente[]>([]);
  filtroTesto = signal('');
  filtroMansione = signal('');
  private dipendentiService = inject(DipendentiService);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  // Lista mansioni uniche per il select
  mansioni = computed(() => {
    const descrizioni = this.dipendenti()
      .map(d => d.tipologiaLavoro?.descrizione)
      .filter((d): d is string => !!d);
    return [...new Set(descrizioni)];
  });

  // Dipendenti filtrati
  dipendentiFiltrati = computed(() => {
    const testo = this.filtroTesto().toLowerCase();
    const mansione = this.filtroMansione();

    return this.dipendenti().filter(d => {
      const matchTesto = !testo ||
        d.nome.toLowerCase().includes(testo) ||
        d.cognome.toLowerCase().includes(testo);
      const matchMansione = !mansione ||
        d.tipologiaLavoro?.descrizione === mansione;
      return matchTesto && matchMansione;
    });
  });

  ngOnInit() {
    this.buttonAggiungi=this.theAuthService.hasRole('Admin');
    console.log("Permesso di aggiungere dipendenti:", this.buttonAggiungi);
    this.dipendentiService.getDipendenti().subscribe(data => {
      this.dipendenti.set(data);
    });
  }

  onRowClick(dipendente: Dipendente) {
    this.router.navigate(['/dipendente', dipendente.id]);
  }

  apriDialogAggiungi() {
    const dialogRef = this.dialog.open(AggiungiDipendenteDialogComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Ricarica i dipendenti dopo l'aggiunta
        this.dipendentiService.getDipendenti().subscribe(data => {
          this.dipendenti.set(data);
          console.log('Dipendente aggiunto con successo. Lista aggiornata.');
        });
      }
    });
  }
}

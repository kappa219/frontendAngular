import { Component, inject, OnInit, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { DipendentiService, Dipendente } from '../../dipendenti.service';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AggiungiDipendenteDialogComponent } from '../aggiungi-dipendente-dialog/aggiungi-dipendente-dialog.component';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatDialogModule, RouterModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
   theAuthService = inject(AuthService);
  buttonAggiungi: boolean = false;

  displayedColumns: string[] = ['nome', 'cognome', 'dataAssunzione', 'dataDimissione', 'eta', 'stipendio', 'mansione'];

  dipendenti = signal<Dipendente[]>([]);
  private dipendentiService = inject(DipendentiService);
  private dialog = inject(MatDialog);
  private router = inject(Router);

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
      width: '400px'
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

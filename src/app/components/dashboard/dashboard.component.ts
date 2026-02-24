import { Component, inject, OnInit, signal, computed, effect, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DipendentiService, Dipendente } from '../../dipendenti.service';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AggiungiDipendenteDialogComponent } from '../aggiungi-dipendente-dialog/aggiungi-dipendente-dialog.component';
import { AuthService } from '../../services/auth.service';
import { PostItService } from '../../services/post-it.service';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, MatTooltipModule, MatCardModule, MatPaginatorModule, FormsModule, RouterModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
   theAuthService = inject(AuthService);
  buttonAggiungi: boolean = false;

  displayedColumns: string[] = ['nome', 'cognome', 'dataAssunzione', 'dataDimissione', 'eta', 'stipendio', 'mansione', 'azioni'];

  dipendenti = signal<Dipendente[]>([]);
  filtroTesto = signal('');
  filtroMansione = signal('');
  private dipendentiService = inject(DipendentiService);
  private postItService = inject(PostItService);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  // Mappa dipendenteId -> numero di giornate lavorative (note nel calendario)
  giorniLavoratiMap = new Map<string, number>();

  // Statistiche per le card
  totaleDipendenti = computed(() => this.dipendenti().length);

  stipendioMedio = computed(() => {
    const dips = this.dipendenti().filter(d => d.stipendio != null);
    if (dips.length === 0) return 0;
    const somma = dips.reduce((acc, d) => acc + d.stipendio!, 0);
    return Math.round(somma / dips.length);
  });

  etaMedia = computed(() => {
    const dips = this.dipendenti();
    if (dips.length === 0) return 0;
    const somma = dips.reduce((acc, d) => acc + d.eta, 0);
    return Math.round(somma / dips.length);
  });

  totaleMansioni = computed(() => this.mansioni().length);

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

  dataSource = new MatTableDataSource<Dipendente>([]);

  constructor() {
    effect(() => {
      //this.dataSource.
      this.dataSource.data = this.dipendentiFiltrati();
    });
  }

  ngAfterViewInit() { 
    // Associa il paginator al dataSource dopo che la vista è stata inizializzata
    this.dataSource.paginator = this.paginator;


    this.paginator._intl.itemsPerPageLabel = 'Dipendenti per pagina:';
    // questi label senvono per le persone non vedenti che usano screen reader, non appaiono visivamente appaiono anche su alt quando ci passi ul nome 
    this.paginator._intl.nextPageLabel = 'Pagina successiva';
    this.paginator._intl.previousPageLabel = 'Pagina precedente';
    this.paginator._intl.firstPageLabel = 'Prima pagina';
    this.paginator._intl.lastPageLabel = 'Ultima pagina';

  }

  ngOnInit() {
    this.buttonAggiungi=this.theAuthService.hasRole('Admin');
    console.log("Permesso di aggiungere dipendenti:", this.buttonAggiungi);
    this.dipendentiService.getDipendenti().subscribe(data => {
      this.dipendenti.set(data);
      this.caricaGiorniLavorati(data);
    });
  }

  private caricaGiorniLavorati(dipendenti: Dipendente[]) {
    this.giorniLavoratiMap.clear();
    dipendenti.forEach(d => {
      if (d.id) {
        this.postItService.getPostItById(d.id).subscribe(postIts => {
          this.giorniLavoratiMap.set(d.id!, postIts.length);
        });
      }
    });
  }

  onRowClick(dipendente: Dipendente) {
    this.router.navigate(['/dipendente', dipendente.id]);
  }

  eliminaDipendente(dipendente: Dipendente, event: Event) {
    event.stopPropagation(); // evita di navigare al dettaglio
    if (!confirm(`Sei sicuro di voler eliminare ${dipendente.nome} ${dipendente.cognome}?`)) {
      return;
    }
    this.dipendentiService.eliminaDipendente(dipendente.id!).subscribe(() => {
      this.dipendentiService.getDipendenti().subscribe(data => {
        this.dipendenti.set(data);
      });
    });
  }

  apriDialogAggiungi() {
    const dialogRef = this.dialog.open(AggiungiDipendenteDialogComponent, {
      width: '600px',
      disableClose: true,
      
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dipendentiService.getDipendenti().subscribe(data => {
          this.dipendenti.set(data);
        });
      }
    });
  }

  getGiorniLavorati(dipendente: Dipendente): number {
    return this.giorniLavoratiMap.get(dipendente.id!) ?? 0;
  }

  apriDialogModifica(dipendente: Dipendente, event: Event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(AggiungiDipendenteDialogComponent, {
      width: '600px',
      data: dipendente
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dipendentiService.getDipendenti().subscribe(data => {
          this.dipendenti.set(data);
        });
      }
    });
  }
}

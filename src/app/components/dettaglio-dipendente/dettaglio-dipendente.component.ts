import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DipendentiService, Dipendente } from '../../dipendenti.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MyCalendarComponent } from '../../calendar/calendar.component';

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
}

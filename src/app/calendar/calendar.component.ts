import { HttpClient } from '@angular/common/http';

import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PostItDialogComponent, PostIt } from './../components/post-it-dialog/post-it-dialog.component';
import { PostItService } from '../services/post-it.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class MyCalendarComponent implements OnInit {
  private dialog = inject(MatDialog);
  private postItService = inject(PostItService);

  @Input() dipendenteId!: string;

  currentDate = new Date();
  currentMonth = '';
  currentYear = 0;
  selectedDay: number | null = null;
  view: 'month' | 'week' = 'week';

  // Map per salvare gli eventi: chiave = "YYYY-MM-DD-HH", valore = PostIt
  events: Map<string, PostIt> = new Map();

  // Per vista mensile
  daysInMonth: (number | null)[] = [];

  // Per vista settimanale
  weekDays: Date[] = [];
  hours: number[] = Array.from({ length: 24 }, (_, i) => i);

  private monthNames = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ];

  private dayNames = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];

  constructor() {
    this.updateCalendar();
  }

  ngOnInit(): void {
    this.caricaPostIt();
  }

  caricaPostIt(): void {
    if (!this.dipendenteId) return;
    this.postItService.getPostItById(this.dipendenteId).subscribe({
      next: (postIts) => {
        console.log('Dati ricevuti dal backend:', postIts);
        postIts.forEach((postIt: any) => {
          const oraInizio = postIt.oraInizio ?? postIt.OraInizio ?? '08:00';
          const ora = this.estraiOra(oraInizio);
          console.log('PostIt:', postIt, 'oraInizio:', oraInizio);
          const data = new Date(postIt.data || postIt.Data);
          const chiave = this.getEventKey(data, ora);
          console.log('Chiave generata:', chiave);
          this.events.set(chiave, { ...postIt, oraInizio, oraFine: postIt.oraFine ?? postIt.OraFine });
        });
        console.log('Events Map:', Array.from(this.events.entries()));
      },
      error: (err) => {
        console.error('Errore nel caricamento dei post-it:', err);
      }
    });
  }

  // Estrae l'ora numerica da una stringa "HH:MM"
  private estraiOra(oraString: string): number {
    return parseInt(oraString.split(':')[0], 10);
  }

  updateCalendar(): void {
    this.currentMonth = this.monthNames[this.currentDate.getMonth()];
    this.currentYear = this.currentDate.getFullYear();

    if (this.view === 'month') {
      this.generateDays();
    } else {
      this.generateWeek();
    }
  }

  generateDays(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const startDay = firstDay === 0 ? 6 : firstDay - 1;
    const totalDays = new Date(year, month + 1, 0).getDate();

    this.daysInMonth = [];

    for (let i = 0; i < startDay; i++) {
      this.daysInMonth.push(null);
    }

    for (let day = 1; day <= totalDays; day++) {
      this.daysInMonth.push(day);
    }
  }

  generateWeek(): void {
    this.weekDays = [];
    const startOfWeek = this.getStartOfWeek(this.currentDate);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      this.weekDays.push(day);
    }
  }

  getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    return d;
  }

  prevMonth(): void {
    if (this.view === 'month') {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    } else {
      this.currentDate.setDate(this.currentDate.getDate() - 7);
    }
    this.updateCalendar();
  }

  nextMonth(): void {
    if (this.view === 'month') {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    } else {
      this.currentDate.setDate(this.currentDate.getDate() + 7);
    }
    this.updateCalendar();
  }

  selectDay(day: number | null): void {
    if (day) {
      this.selectedDay = day;
    }
  }

  setView(view: 'month' | 'week'): void {
    this.view = view;
    this.updateCalendar();
  }

  getDayName(date: Date): string {
    return this.dayNames[date.getDay()];
  }

  formatHour(hour: number): string {
    return `${hour.toString().padStart(2, '0')}:00`;
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  getWeekRange(): string {
    if (this.weekDays.length === 0) return '';
    const start = this.weekDays[0];
    const end = this.weekDays[6];
    return `${start.getDate()} - ${end.getDate()} ${this.monthNames[end.getMonth()]} ${end.getFullYear()}`;
  }

  onCellClick(day: Date, hour: number) {
    const chiave = this.getEventKey(day, hour);
    const esistente = this.events.get(chiave);

    const dialogRef = this.dialog.open(PostItDialogComponent, {
      width: '400px',
      data: esistente || { data: day, oraInizio: this.formatHour(hour), oraFine: this.formatHour(hour + 1) }
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result, "prima di modifica");
      console.log('Eventi:', Array.from(this.events.entries()));

      if (result?.deleted) {
        console.log("cancellato");
        this.events.delete(chiave);
        if (result.id) {
          this.postItService.eliminaPostIt(result.id).subscribe({
            next: () => {
              console.log("eliminato dal backend");
            },
            error: (err) => {
              console.error("errore nella cancellazione", err);
            }
          });
        } else {
          console.log("eliminato solo localmente (post-it non ancora salvato)");
        }
      } else if (result) {
        // Aggiorna la chiave se l'ora di inizio è cambiata
        const nuovaOra = this.estraiOra(result.oraInizio);
        const nuovaChiave = this.getEventKey(new Date(result.data), nuovaOra);

        // Rimuovi dalla vecchia posizione e aggiungi alla nuova
        this.events.delete(chiave);
        this.events.set(nuovaChiave, result);

        const postItDaSalvare = {
          ...result,
          OraInizio: result.oraInizio,
          OraFine: result.oraFine,
          dipendenteId: this.dipendenteId
        };

        if (result.id) {
          // Modifica (PUT)
          this.postItService.aggiornaPostIt(result.id, postItDaSalvare).subscribe({
            next: () => {
              console.log("modificato con successo", postItDaSalvare);
            },
            error: (err) => {
              console.error("errore nella modifica", err);
            }
          });
        } else {
          // Nuovo (POST)
          this.postItService.salvaPostIt(postItDaSalvare).subscribe({
            next: () => {
              console.log("salvato con successo");

              this.caricaPostIt(); // Ricarica per ottenere l'id
            },
            error: (err) => {
              console.error("errore nel salvataggio dei dati", err);
            }
          });
        }
      }
    });
  }

  // Crea chiave unica: "2026-01-29-14"
  getEventKey(day: Date, hour: number): string {
    const anno = day.getFullYear();
    const mese = String(day.getMonth() + 1).padStart(2, '0');
    const giorno = String(day.getDate()).padStart(2, '0');
    return `${anno}-${mese}-${giorno}-${hour}`;
  }

  // Recupera l'evento per una cella
  getEvent(day: Date, hour: number): string {
    const evento: any = this.events.get(this.getEventKey(day, hour));
    return evento ? evento.titoloNota : '';
  }
}

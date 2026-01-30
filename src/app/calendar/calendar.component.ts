import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class MyCalendarComponent {
  currentDate = new Date();
  currentMonth = '';
  currentYear = 0;
  selectedDay: number | null = null;
  view: 'month' | 'week' = 'week';

  // Map per salvare gli eventi: chiave = "YYYY-MM-DD-HH", valore = testo evento
  events: Map<string, string> = new Map();

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
    const testo = prompt('Inserisci evento:');
    if (testo) {
      const chiave = this.getEventKey(day, hour);
      this.events.set(chiave, testo);
    }
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
    return this.events.get(this.getEventKey(day, hour)) || '';
  }
}

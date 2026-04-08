import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

export interface PostIt {
  id?: string;
  titoloNota: string;
  note: string;
  oreLavorate: number;
  azienda: string;
  mansione: string;
  data: Date;
  oraInizio?: string;
  oraFine?: string;
  dipendenteId?: string;
}

interface DialogData extends PostIt {
  isDuplicate?: boolean;
}

@Component({
  selector: 'app-post-it-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './post-it-dialog.component.html',
  styleUrl: './post-it-dialog.component.css'
})
export class PostItDialogComponent {
  private dialogRef = inject(MatDialogRef<PostItDialogComponent>);
  private data = inject<DialogData | null>(MAT_DIALOG_DATA, { optional: true });

  // Ore disponibili dalle 8:00 alle 20:00 con intervalli di 30 minuti
  oreDisponibili: string[] = this.generaOre();

  oraInizio: string = this.data?.oraInizio || '08:00';
  oraFine: string = this.data?.oraFine || '17:00';

  private generaOre(): string[] {
    const ore: string[] = [];
    for (let h = 8; h <= 20; h++) {
      ore.push(`${h.toString().padStart(2, '0')}:00`);
      if (h < 20) {
        ore.push(`${h.toString().padStart(2, '0')}:30`);
      }
    }
    return ore;
  }

  nota: PostIt = {
    id: this.data?.id,
    titoloNota: this.data?.titoloNota || '',
    note: this.data?.note || '',
    oreLavorate: this.data?.oreLavorate || 0,
    azienda: this.data?.azienda || '',
    mansione: this.data?.mansione || '',
    data: this.data?.data || new Date()
  };

  dataString: string = this.formatDateForInput(this.data?.data || new Date());
  dataDaStr: string = this.formatDateForInput(this.data?.data || new Date());
  dataAStr: string = this.formatDateForInput(this.data?.data || new Date());

  get isEdit(): boolean {
    return !!this.data?.id;
  }

  get isDuplicate(): boolean {
    return !!this.data?.isDuplicate;
  }

  get orarioInvalido(): boolean {
    return this.oraInizio >= this.oraFine;
  }

  get rangeInvalido(): boolean {
    return this.isDuplicate && this.dataDaStr > this.dataAStr;
  }

  private formatDateForInput(date: any): string {
    if (date instanceof Date) {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }
    return String(date).substring(0, 10);
  }

  private parseStr(s: string): Date {
    const [y, m, d] = s.split('-').map(Number);
    // Usa mezzogiorno (12:00) per evitare lo sfasamento UTC in Italia:
    // mezzanotte locale (00:00 UTC+1) diventerebbe "21T23:00Z" = giorno prima per il backend
    return new Date(y, m - 1, d, 12, 0, 0);
  }

  salva() {
    if (!(this.nota.titoloNota && this.nota.note && this.oraInizio && this.oraFine) || this.orarioInvalido) return;

    if (this.isDuplicate) {
      if (this.rangeInvalido) return;
      this.dialogRef.close({
        ...this.nota,
        dataDa: this.parseStr(this.dataDaStr),
        dataA: this.parseStr(this.dataAStr),
        oraInizio: this.oraInizio,
        oraFine: this.oraFine,
        duplicate: true
      });
    } else {
      this.dialogRef.close({
        ...this.nota,
        data: this.parseStr(this.dataString),
        oraInizio: this.oraInizio,
        oraFine: this.oraFine
      });
    }
  }

  duplica() {
    this.dialogRef.close({
      ...this.nota,
      data: this.parseStr(this.dataString),
      oraInizio: this.oraInizio,
      oraFine: this.oraFine,
      duplicate: true,
      id: undefined
    });
  }

  annulla() {
    this.dialogRef.close();
  }

  deletenota() {
    this.dialogRef.close({ deleted: true, id: this.data?.id });
  }
}

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
  private data = inject<PostIt | null>(MAT_DIALOG_DATA, { optional: true });

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

  get orarioInvalido(): boolean {
  return this.oraInizio >= this.oraFine;
}


  salva() {
    if ((this.nota.titoloNota || this.nota.note ) && !this.orarioInvalido) {
      this.dialogRef.close({
        ...this.nota,
        oraInizio: this.oraInizio,
        oraFine: this.oraFine
      });
    }
  }

  annulla() {
    this.dialogRef.close();
  }
  deletenota() {
    this.dialogRef.close({ deleted: true, id: this.data?.id });
  }
}

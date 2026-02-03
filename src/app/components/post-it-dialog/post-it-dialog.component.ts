import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface PostIt {
  id?: string;
  titoloNota: string;
  note: string;
  oreLavorate: number;
  azienda: string;
  mansione: string;
  data: Date;
  ora: number;
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
    MatIconModule
  ],
  templateUrl: './post-it-dialog.component.html',
  styleUrl: './post-it-dialog.component.css'
})
export class PostItDialogComponent {
  private dialogRef = inject(MatDialogRef<PostItDialogComponent>);
  private data = inject<PostIt | null>(MAT_DIALOG_DATA, { optional: true });
  

  nota: PostIt = {
    id: this.data?.id,
    titoloNota: this.data?.titoloNota || '',
    note: this.data?.note || '',
    oreLavorate: this.data?.oreLavorate || 0,
    azienda: this.data?.azienda || '',
    mansione: this.data?.mansione || '',
    data: this.data?.data || new Date(),
    ora: this.data?.ora || 0
  };

  salva() {
    if (this.nota.titoloNota || this.nota.note) {

      this.dialogRef.close(this.nota);
    }
  }

  annulla() {
    this.dialogRef.close();
  }
  deletenota() {
    this.dialogRef.close({ deleted: true, id: this.data?.id });
  }
}

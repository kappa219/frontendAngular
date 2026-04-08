import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-contattaci',
  imports: [FormsModule],
  templateUrl: './contattaci.component.html',
  styleUrl: './contattaci.component.css'
})
export class ContattaciComponent {

  onSubmit(form: NgForm): void {
    if (form.invalid) return;
    console.log('Dati form:', form.value);
    // qui puoi chiamare un servizio per inviare i dati
    form.reset();
  }
}

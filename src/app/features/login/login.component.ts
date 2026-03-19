import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  mostraPassword: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response: any) => {
        console.log('Login successful:', response);
        this.authService.setUser(response.user, response.token);
        this.router.navigate(['/dashboard']);
      },
      error: (error: any) => {
        console.error('Login fallita:', error);
        if (error.status === 401) {
          this.errorMessage = 'Email o password errata.';
        } else if (error.status === 0) {
          this.errorMessage = 'Impossibile contattare il server.';
        } else {
          this.errorMessage = error.error?.message || 'Errore durante il login.';
        }
      }
    });
  }
}

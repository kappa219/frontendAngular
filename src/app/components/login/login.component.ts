import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {
   //  console.log('Email:', this.email);
  //    console.log('Password:', this.password);

    this.authService.login(this.email, this.password).subscribe({
      next: (response: any) => {
        console.log('Login successful:', response);
        // Salva utente e token dopo login riuscito
        this.authService.setUser(response.user, response.token);
        this.router.navigate(['/dashboard']);
      },
      error: (error: any) => {
        console.error('Login fallita:', error);
        alert('Login failed: ' + (error.error?.message || error.statusText));
      }
    });
  }
}

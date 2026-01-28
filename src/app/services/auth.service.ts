import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface User {
  username: string;
  email: string;
  token?: string;
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:5188/api/auth';
  private tokenKey = 'auth_token';
  private platformId = inject(PLATFORM_ID);

  currentUser = signal<User | null>(null);
  isLoggedIn = computed(() => this.currentUser() !== null);

  constructor(private http: HttpClient) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadUserFromStorage();
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  hasRole(role: string): boolean {
    if (
      this.currentUser()?.role === "Admin") {
      return true;
    }
    else return false;
  }

  // Chiamare dopo login riuscito
  setUser(user: User, token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
    }
    this.currentUser.set(user);
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
    }
    this.currentUser.set(null);
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  private loadUserFromStorage(): void {
    const token = this.getToken();
    if (token && !this.isTokenExpired(token)) {
      const decoded = this.decodeToken(token);
      if (decoded) {
        this.currentUser.set({
          username: decoded.username || decoded.sub,
          email: decoded.email || '',
          role: decoded.role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
        });
      }
    }
  }

  private isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded?.exp) return false;
    const expirationDate = new Date(decoded.exp * 1000);
    return expirationDate < new Date();
  }

  private decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }
}

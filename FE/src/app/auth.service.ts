import { Injectable } from '@angular/core';
import { run } from 'googleapis/build/src/apis/run';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'token';
  private roleKey = 'role';
  private usernameKey = 'username';

  setToken(token: string, role: string): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.roleKey, role);
    this.getUsernameFromToken(); // Lưu username khi lưu token
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRole(): string | null {
    return localStorage.getItem(this.roleKey);
  }

  getUsername(): string | null {
    return localStorage.getItem(this.usernameKey);
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    localStorage.removeItem(this.usernameKey);
  }

  decodeToken(token: string): any | null {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Token không hợp lệ:', error);
      return null;
    }
  }

  getUsernameFromToken(): void {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.decodeToken(token);
      if (decodedToken && decodedToken.sub) {
        localStorage.setItem(this.usernameKey, decodedToken.sub);
      } else {
        console.error('Token không chứa username hợp lệ');
      }
    }
  }
}


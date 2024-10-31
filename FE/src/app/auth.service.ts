import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'token';
  private roleKey = 'role';

  // Lưu token và role vào localStorage
  setToken(token: string, role: string): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.roleKey, role);
  }

  // Lấy token từ localStorage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Lấy role từ localStorage
  getRole(): string | null {
    return localStorage.getItem(this.roleKey);
  }

  // Xóa token và role khỏi localStorage
  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
  }
}

import { Component, OnInit } from '@angular/core';
import { SecurityService } from './security.service';
import { AuthService } from 'app/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent implements OnInit {
  constructor(
      private securityService: SecurityService,
      private authService: AuthService,
      private router: Router
  ) {}

  ngOnInit(): void {}

  username: string = '';
  password: string = '';
  checkUsername: boolean = false;
  checkPassword: boolean = false;

  login(): void {
    if (!this.isCheck()) {
      return;
    }
    this.securityService.login(this.username, this.password).subscribe(
        response => {
          this.authService.setToken(response.token, response.role); // Lưu token và role
          Swal.fire({
            icon: 'success',
            title: 'Đăng nhập thành công!',
            text: 'Chào mừng bạn đến với hệ thống!',
            showConfirmButton: false,
            timer: 3000
          });
          this.router.navigate(['/ban-hang']);
        },
        error => {
          this.handleError(error);
        }
    );
  }

  changePassword(): void {
    this.router.navigate(['/change-password']);
  }

  getTokenLocalStorage(): void {
    localStorage.getItem('token');
    localStorage.getItem('role');
  }

  private handleError(error: any): void {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      // Nếu là lỗi phía client
      errorMessage = `Lỗi: ${error.message}`;
    } else {
      // Nếu là lỗi từ server
      if (error.status === 401) {
        errorMessage = 'Sai tên đăng nhập hoặc mật khẩu. Vui lòng thử lại.';
      } else {
        errorMessage = `Lỗi server: ${error.message || error.statusText}`;
      }
    }
    this.showErrorMessage(errorMessage);
  }

  private isCheck(): boolean {
    // Reset all check flags to false
    this.checkUsername = false;
    this.checkPassword = false;

    let isValid = true; // Assume valid initially

    if (!this.username) {
      this.checkUsername = true;
      isValid = false;
    }
    if (!this.password) {
      this.checkPassword = true;
      isValid = false;
    }

    return isValid;
  }

  showSuccessMessage(message: string) {
    Swal.fire({
      icon: 'success',
      title: 'Thành công!',
      text: message,
      showConfirmButton: false,
      timer: 1500
    });
  }

  showErrorMessage(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Thất bại!',
      text: message,
      showConfirmButton: false,
      timer: 3000
    });
  }

  showWarningMessage(message: string) {
    Swal.fire({
      icon: 'warning',
      title: 'Cảnh báo!',
      text: message,
      showConfirmButton: false,
      timer: 1500
    });
  }
}

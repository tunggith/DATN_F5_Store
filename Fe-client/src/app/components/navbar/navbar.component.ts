import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DangNhapService } from 'src/app/dang-nhap/dang-nhap.service';
import Swal from 'sweetalert2';
declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: '/trang-chu', title: 'Trang chủ', icon: '', class: '' },
  { path: '/san-pham', title: 'Sản phẩm', icon: '', class: '' },
  { path: '/ve-chung-toi', title: 'Về chúng tôi', icon: '', class: '' },
  { path: '/lien-he', title: 'Liên hệ', icon: '', class: '' },
  { path: '/tra-cuu-don-hang', title: 'Tra cứu đơn hàng', icon: '', class: '' }
];
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  popupDangNhap: boolean = false;
  popupDangKy: boolean = false;
  menuItems: any[] = [];
  hoTen:string='';
  constructor(private router:Router) { }
  ngOnInit(): void {
    this.hoTen = localStorage.getItem('hoTen')||'';
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  logout(){
    localStorage.clear();
    this.hoTen = '';
    this.showSuccessMessage('Đăng xuất thành công!');
    this.router.navigate(['/trang-chu']);
  }
  openPopupDangNhap() {
    this.popupDangNhap = true;
  }
  closePopupDangNhap() {
    this.popupDangNhap = false;
    this.hoTen= localStorage.getItem('hoTen')||'';
  }
  openPopUpDangKy(){
    this.popupDangKy = true;
  }
  closePopupDangKy(){
    this.popupDangKy = false;
  }
  getRedirectTaiKhoan(){
    this.router.navigate(['/tai-khoan']);
  }
  // =================== Thông báo ===================

  showSuccessMessage(message: string) {
    Swal.fire({
      icon: 'success',
      title: 'Thành công!',
      text: message,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });
  }

  showErrorMessage(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Thất bại!',
      text: message,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });
  }

  showWarningMessage(message: string) {
    Swal.fire({
      icon: 'warning',
      title: 'Cảnh báo!',
      text: message,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });
  }
  // ================= Xử lý lỗi =================
  private handleError(error: any): void {
    let errorMessage = 'Có lỗi xảy ra';
    if (error.error instanceof ErrorEvent) {
      // Lỗi từ phía client
      errorMessage = `Lỗi: ${error.error.message}`;
    } else {
      // Lỗi từ phía server
      errorMessage = `${error.error}`;
    }
    this.showErrorMessage(errorMessage);
  }
}

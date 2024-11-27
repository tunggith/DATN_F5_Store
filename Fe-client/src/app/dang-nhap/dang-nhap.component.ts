import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import Swal from 'sweetalert2';
import { DangNhapService } from './dang-nhap.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dang-nhap',
  templateUrl: './dang-nhap.component.html',
  styleUrls: ['./dang-nhap.component.css']
})
export class DangNhapComponent implements OnInit {
  @Output() closePopup = new EventEmitter<void>();
  username: string = '';
  password: string = '';
  id: string = '';
  hoTen: string = '';
  constructor(private dangNhapService: DangNhapService, private router: Router) { }
  ngOnInit(): void { }
  close() {
    this.closePopup.emit();
  }
  //================Đăng nhâp====================
  login() {
    this.dangNhapService.login(this.username, this.password).subscribe(
      response => {
        this.id = response.result.content.id;
        this.hoTen = response.result.content.ten;
        localStorage.setItem('id', this.id);
        localStorage.setItem('hoTen', this.hoTen);

        // Kiểm tra nếu có giỏ hàng (cart) trong localStorage
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');

        if (Array.isArray(cart) && cart.length > 0) {
          // Dữ liệu giỏ hàng có tồn tại, gọi API lưu giỏ hàng
          const cartRequests = cart.filter((item: CartItem) => item.chiTietSanPham)
            .map((item: CartItem) => ({
              idChiTietSanPham: item.chiTietSanPham.id,
              soLuong: item.soLuong,
              trangThai: item.trangThai
            }));

          // Gọi API lưu thông tin giỏ hàng một lần cho tất cả các sản phẩm
          if (cartRequests.length > 0) {
            this.dangNhapService.luuLocalStogate(this.id, cartRequests).subscribe(
              response => {
                console.log('Dữ liệu giỏ hàng đã được lưu thành công', response);
              },
              error => {
                console.error('Có lỗi khi lưu giỏ hàng', error);
              }
            );
          }
        }

        this.router.navigate(['/trang-chu']);
        this.showSuccessMessage("Đăng nhập thành công");
        this.close();
      },
      error => {
        this.handleError(error);
      }
    );
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
interface ChiTietSanPham {
  id: number;
  sanPham: { ten: string };
  size: { ten: string };
  mauSac: { ten: string };
  // Các thuộc tính khác
}

interface CartItem {
  chiTietSanPham: ChiTietSanPham;
  soLuong: number;
  trangThai: string;
}

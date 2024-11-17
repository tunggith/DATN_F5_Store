import { Component, OnInit } from '@angular/core';
import { DangNhapService } from '../dang-nhap/dang-nhap.service';
import { DatePipe } from '@angular/common';
import Swal from "sweetalert2";

@Component({
  selector: 'app-tai-khoan',
  templateUrl: './tai-khoan.component.html',
  styleUrls: ['./tai-khoan.component.css'],
  providers: [DatePipe]
})
export class TaiKhoanComponent implements OnInit {
  urlAnh: string = 'assets/default-person-icon.png'; // Đường dẫn ảnh mặc định
  khachHang = {
    ma: '',
    ten: '',
    gioiTinh: 0,
    sdt: '',
    email: '',
    ngayThangNamSinh: '',
    anh: ''
  };
  diaChi: any[] = [];
  errors: any = {}; // Dùng để lưu lỗi cho từng trường

  constructor(
    private dangNhapService: DangNhapService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.detailKhachHang();
    this.getDiaChiKhachHang();
  }

  // Kiểm tra tên khách hàng hợp lệ
  isValidName(name: string): boolean {
    const nameRegex = /^[A-Za-zÀ-ỹ\s]+$/; // Chỉ cho phép chữ cái và khoảng trắng
    return nameRegex.test(name) && name.length <= 50;
  }

// Kiểm tra tuổi hợp lệ
  isValidAge(dateOfBirth: string): boolean {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();

    // Nếu chưa qua sinh nhật năm nay thì trừ 1 năm
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age > 3 && age < 110;
  }

// Kiểm tra lỗi các trường
  validateForm() {
    this.errors = {}; // Reset lỗi

    // Kiểm tra họ tên
    if (!this.khachHang.ten.trim()) {
      this.errors.ten = 'Họ tên không được bỏ trống';
    } else if (!this.isValidName(this.khachHang.ten)) {
      this.errors.ten = 'Họ tên không hợp lệ (chỉ cho phép chữ và không vượt quá 50 ký tự)';
    }

    // Kiểm tra ngày tháng năm sinh và tuổi hợp lệ
    if (!this.khachHang.ngayThangNamSinh) {
      this.errors.ngayThangNamSinh = 'Ngày tháng năm sinh không được bỏ trống';
    } else if (!this.isValidAge(this.khachHang.ngayThangNamSinh)) {
      this.errors.ngayThangNamSinh = 'Tuổi phải lớn hơn 3 và nhỏ hơn 110';
    }

    // Kiểm tra email
    if (!this.khachHang.email || !this.isValidEmail(this.khachHang.email)) {
      this.errors.email = 'Email không hợp lệ';
    }

    // Kiểm tra số điện thoại
    if (!this.khachHang.sdt || !this.isValidPhoneNumber(this.khachHang.sdt)) {
      this.errors.sdt = 'Số điện thoại không hợp lệ';
    }
  }

  // Kiểm tra email hợp lệ
  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  // Kiểm tra số điện thoại hợp lệ
  isValidPhoneNumber(sdt: string): boolean {
    const phoneRegex = /^[0-9]{10,11}$/; // Giả sử số điện thoại là 10-11 chữ số
    return phoneRegex.test(sdt);
  }

  // Lấy thông tin tài khoản
  detailKhachHang() {
    const id = localStorage.getItem('id') || '';
    if (id) {
      this.dangNhapService.detailKhachHang(id).subscribe(
        data => {
          this.khachHang = data.result.content;
          this.khachHang.gioiTinh = Number(this.khachHang.gioiTinh);
          this.khachHang.ngayThangNamSinh = this.datePipe.transform(this.khachHang.ngayThangNamSinh, 'yyyy-MM-dd') || '';
          if (![0, 1, 2].includes(this.khachHang.gioiTinh)) {
            this.khachHang.gioiTinh = 0; // Giá trị mặc định là Nữ
          }
          if (!this.khachHang.anh) {
            this.khachHang.anh = this.urlAnh;
          }
        },
        error => {
          console.error("Không thể lấy thông tin khách hàng:", error);
          Swal.fire({
            title: 'Lỗi!',
            text: 'Không thể lấy thông tin tài khoản. Vui lòng thử lại.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
    }
  }

  // Lấy địa chỉ khách hàng
  getDiaChiKhachHang() {
    const id = localStorage.getItem('id') || '';
    if (id !== '') {
      this.dangNhapService.diaChiKhachHang(id).subscribe(
        data => {
          this.diaChi = data.result.content.map((diaChiItem: any) => this.formatDiaChi(diaChiItem));
        },
        error => {
          console.error("Không thể lấy địa chỉ khách hàng:", error);
        }
      );
    }
  }

  // Định dạng địa chỉ đầy đủ
  formatDiaChi(diaChiItem: any): string {
    return `${diaChiItem.soNha}, ${diaChiItem.duong}, ${diaChiItem.phuongXa}, ${diaChiItem.quanHuyen}, ${diaChiItem.tinhThanh}, ${diaChiItem.quocGia}`;
  }

  // Xử lý khi người dùng chọn ảnh
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.khachHang.anh = e.target.result; // Đặt đường dẫn ảnh
      };
      reader.readAsDataURL(file); // Đọc file ảnh
    }
  }

  // Cập nhật thông tin khách hàng
  updateKhachHang() {
    this.validateForm();
    if (Object.keys(this.errors).length === 0) {  // Kiểm tra nếu không có lỗi
      const id = localStorage.getItem('id') || '';
      if (id !== '') {
        this.dangNhapService.updateKhachHang(id, this.khachHang).subscribe(
          (response) => {
            Swal.fire({
              title: 'Thành công!',
              text: 'Cập nhật thông tin khách hàng thành công!',
              icon: 'success',
              confirmButtonText: 'OK'
            });
          },
          (error) => {
            console.error('Lỗi khi cập nhật thông tin khách hàng:', error);
            Swal.fire({
              title: 'Lỗi!',
              text: 'Đã xảy ra lỗi, vui lòng thử lại.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        );
      } else {
        Swal.fire({
          title: 'Cảnh báo!',
          text: 'Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
      }
    }
  }

}

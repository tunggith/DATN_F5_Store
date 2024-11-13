import { Component, OnInit } from '@angular/core';
import { DangNhapService } from '../dang-nhap/dang-nhap.service';
import { DatePipe } from '@angular/common';

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
    gioiTinh: '',
    sdt: '',
    email: '',
    ngayThangNamSinh: '',
    anh: ''
  };
  diaChi: any[] = [];

  constructor(
    private dangNhapService: DangNhapService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.detailKhachHang();
    this.getDiaChiKhachHang();
  }

  // Lấy thông tin tài khoản
  detailKhachHang() {
    const id = localStorage.getItem('id') || '';
    if (id !== '') {
      this.dangNhapService.detailKhachHang(id).subscribe(
        data => {
          this.khachHang = data.result.content;
          this.khachHang.ngayThangNamSinh = this.datePipe.transform(this.khachHang.ngayThangNamSinh, 'yyyy-MM-dd') || '';
          
          // Kiểm tra ảnh và thiết lập ảnh mặc định nếu không có
          if (!this.khachHang.anh) {
            this.khachHang.anh = this.urlAnh;
          }
        },
        error => {
          console.error("Không thể lấy thông tin khách hàng:", error);
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
}

import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { BanHangService } from 'app/ban-hang.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-customer-popup',
  templateUrl: './customer-popup.component.html',
  styleUrls: ['./customer-popup.component.scss']
})
export class CustomerPopupComponent implements OnInit {
  @Output() closePopup = new EventEmitter<void>();
  @Output() customerSelected = new EventEmitter<any>();
  khachHang: any[] = [];
  filteredCustomers: any[] = [];
  search: string = '';
  selectedCustomerId: number | null = null;
  customer = {
    ten: '',
    gioiTinh: '',
    ngayThangNamSinh: '',
    email: '',
    sdt: ''
  };

  constructor(private banHangService: BanHangService) { }

  ngOnInit(): void {
    this.getAllKhachHang();
  }

  close() {
    this.closePopup.emit();
  }
  getAllKhachHang(pageNumber: number = 0, pageSize: number = 5, search: string = ''): void {
    this.banHangService.getKhachHang(pageNumber, pageSize, search).subscribe(
      data => {
        this.khachHang = data.result.content.content;
        this.filteredCustomers = this.khachHang;
      }
    );
  }
  filterCustomers(): void {
    this.filteredCustomers = this.khachHang.filter(kh =>
      (kh.ten && kh.ten.toLowerCase().includes(this.search.toLowerCase())) || // Kiểm tra kh.ten
      (kh.email && kh.email.toLowerCase().includes(this.search.toLowerCase())) || // Kiểm tra kh.email
      (kh.sdt && kh.sdt.includes(this.search)) // Kiểm tra kh.sdt
    );
  }
  onSelectChange(event: any): void {
    const selectedValue = event.target.value;

    if (selectedValue) {
      this.selectedCustomerId = +selectedValue; // Chuyển đổi sang số
      const selectedCustomer = this.khachHang.find(kh => kh.id === this.selectedCustomerId);
      this.customerSelected.emit(selectedCustomer); // Phát sự kiện với thông tin khách hàng đã chọn
      this.close(); // Đóng popup sau khi chọn khách hàng
    }
  }
  addCustomer(): void {
    const khachHang = {
      id: 0, // Tạm thời để 0, backend sẽ xử lý
      diaChiKhachHang: {
        hoTen: null, // Kiểm tra và gán giá trị null nếu chuỗi trống
        soNha: null, // Gán null nếu không có giá trị
        duong: null,
        phuongXa: null,
        quanHuyen: null,
        tinhThanh: null,
        quocGia: null,
        loaiDiaChi: null,
        trangThai: null,
        sdt: null,
      },
      ma: '',
      ten: this.customer.ten,
      gioiTinh: this.customer.gioiTinh,
      ngayThangNamSinh: this.customer.ngayThangNamSinh,
      email: this.customer.email,
      anh: '',
      sdt: this.customer.sdt,
      userName: '',
      password: '',
      trangThai: ''
    };
    console.log(khachHang);
    this.banHangService.addKhachHang(khachHang).subscribe(
      (response) => {
        console.log('Thêm khách hàng thành công!', response);
      },
      (error) => {
        console.error('Lỗi khi thêm khách hàng', error);
      }
    );
  }
}

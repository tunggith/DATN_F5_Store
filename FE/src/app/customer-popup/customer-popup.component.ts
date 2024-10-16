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
  }

  close() {
    this.closePopup.emit();
  }

  addCustomer(): void {
    const khachHang = {
      ten: this.customer.ten,
      gioiTinh: this.customer.gioiTinh,
      ngayThangNamSinh: this.customer.ngayThangNamSinh,
      email: this.customer.email,
      sdt: this.customer.sdt,
    };
    
    this.banHangService.addKhachHang(khachHang).subscribe(
      (response) => {
        console.log('Thêm khách hàng thành công!', response);

        // Giả sử API trả về ID của khách hàng vừa được tạo
        const addedCustomerId = response.id; // Lấy ID từ response (bạn phải kiểm tra định dạng của response)

        // Gửi ID khách hàng vừa thêm về component cha
        this.customerSelected.emit(addedCustomerId);

        // Đóng popup
        this.close();
      },
      (error) => {
        console.error('Lỗi khi thêm khách hàng', error);
      }
    );
  }
}

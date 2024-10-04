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
  khachHang: any[] = [];

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
      }
    );
  }
  onSelectChange(event: any): void {
    const selectedValue = event.target.value;

    if (selectedValue) {
      this.close();  // Đóng popup sau khi chọn khách hàng
    }
  }
}

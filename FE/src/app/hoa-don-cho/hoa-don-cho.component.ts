import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BanHangService } from 'app/ban-hang.service';
import { BanHangComponent } from 'app/ban-hang/ban-hang.component';
import { data } from 'jquery';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hoa-don-cho',
  templateUrl: './hoa-don-cho.component.html',
  styleUrls: ['./hoa-don-cho.component.scss']
})
export class HoaDonChoComponent implements OnInit {
  @Output() closePopup = new EventEmitter<void>();
  @Input() idDang !: number;
  
  hoaDonCho: any[] = [];
  
  constructor(private banHangService: BanHangService) { }
  ngOnInit(): void {
    this.getTrangThai();
  }
  getTrangThai(): void {
    this.banHangService.getTrangThaiCho().subscribe(
      data => {
        this.hoaDonCho = data.result.content;
      }
    )
  }
  setTrangThai(idCho: number): void {
    console.log(this.idDang);
    this.banHangService.setTrangThai(idCho, this.idDang).subscribe(
      response => {
        this.showSuccessMessage("Chọn thành công!");
        this.close();
      }
    )
  }

  // =================== Thông báo ===================

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
      timer: 1500
    });
  }

  showWarningMessage(message: string) {
    Swal.fire({
      icon: 'warning',
      title: 'Thất bại!',
      text: message,
      showConfirmButton: false,
      timer: 1500
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
  close() {
    this.closePopup.emit();
  }

}

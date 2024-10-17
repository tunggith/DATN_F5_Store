import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DiaChiKhachHangService } from './dia-chi-khach-hang.service';
import Swal from 'sweetalert2';
import { error, log } from 'console';



@Component({
  selector: 'app-dia-chi-khach-hang',
  templateUrl: './dia-chi-khach-hang.component.html',
  styleUrls: ['./dia-chi-khach-hang.component.css']
})
export class DiaChiKhachHangComponent implements OnInit {
  @Output() closePopup = new EventEmitter<void>();
  @Input() idKhachHang !: number;
  //Địa chỉ khách hàng
  customersDiaChi: any[] = [];
  page: number = 0;
  size: number = 3;
  pagination: any = [];
  idDiaChi: number=0;
  diaChiMoi: any={
      soNha: '',
      duong: '',
      phuongXa: '',
      quanHuyen: '',
      tinhThanh: '',
      quocGia: '',
      loaiDiaChi: 'Nhà riêng',
      trangThai: 'Còn sử dụng'
  }

  constructor(private diaChiKhachHangService: DiaChiKhachHangService) { }
  ngOnInit(): void {
    this.loadDiaChi(this.idKhachHang);
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
  changePage(newPage: number): void {
    this.page = newPage;
    this.loadDiaChi(this.idKhachHang);
  }
  loadDiaChi(id: number): void {
    this.diaChiKhachHangService.getAllAddresses(id, this.page, this.size).subscribe(
      (response: any) => {
        if (response.status) {
          this.customersDiaChi = response.result.content.content; // Lấy dữ liệu địa chỉ từ API
          this.pagination = response.result.pagination;
        }
      },
      (error) => {
        console.error('Lỗi khi gọi API địa chỉ:', error);
      }
    );
  }
  diaChiDetail(id:number):void{
    this.diaChiKhachHangService.chiTietDiaChi(id).subscribe(
      response=>{
        this.diaChiMoi = response.result.content;
      }
    )
  }
  createDiaChi(): void {
    const diaChiData = {
      idKhachHang: this.idKhachHang,
      soNha: this.diaChiMoi.soNha,
      duong: this.diaChiMoi.duong,
      phuongXa: this.diaChiMoi.phuongXa,
      quanHuyen: this.diaChiMoi.quanHuyen,
      tinhThanh: this.diaChiMoi.tinhThanh,
      quocGia: this.diaChiMoi.quocGia,
      loaiDiaChi: this.diaChiMoi.loaiDiaChi,
      trangThai: this.diaChiMoi.trangThai
    };
    this.diaChiKhachHangService.addDiaChiKhachHang(diaChiData).subscribe(
      response=>{
        this.showSuccessMessage("add thành công!");
        this.loadDiaChi(this.idKhachHang);
      },
      error=>{
        this.handleError(error);
      }
    )
  }
  updateDiaChi():void{
    const diaChiData = {
      idKhachHang: this.idKhachHang,
      soNha: '',
      duong: '',
      phuongXa: '',
      quanHuyen: '',
      tinhThanh: '',
      quocGia: '',
      loaiDiaChi: '',
      trangThai: ''
    };
    this.diaChiKhachHangService.updateDiaChiKhachHang(this.idDiaChi,diaChiData).subscribe(
      response=>{
        this.showSuccessMessage("cập nhật thành công!");
        this.loadDiaChi(this.idKhachHang);
      },
      error=>{
        this.handleError(error);
      }
    )
  }

}

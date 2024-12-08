import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BanHangService } from 'app/ban-hang.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-popup-san-pham',
  templateUrl: './popup-san-pham.component.html',
  styleUrls: ['./popup-san-pham.component.scss']
})
export class PopupSanPhamComponent implements OnInit {
  @Input() activeInvoiceID!: number;
  @Output() closePopup = new EventEmitter<void>();
  product: any[] = [];
  pagination: any = [];
  searchTerm: string = '';
  sizeId: string = '';
  mauSacId: string = '';
  thuongHieuId: string = '';
  xuatXuId: string = '';
  gioiTinhId: string = '';
  constructor(private banHangService: BanHangService) { }
  ngOnInit(): void {
    this.getSanPham();
    this.getSize();
    this.getMauSac();
    this.getThuongHieu();
    this.getXuatXu();
    this.getGioiTinh();
  }
  close() {
    this.closePopup.emit();
  }
  // ====================== Lấy dữ liệu bán hàng ====================

  getSanPham(pageSize: number = 0, pageNumber: number = 5): void {
    const sizeId = this.sizeId || '';
    const mauSacId = this.mauSacId || '';
    const thuongHieuId = this.thuongHieuId || '';
    const xuatXuId = this.xuatXuId || '';
    const gioiTinhId = this.gioiTinhId || '';
    const keyWord = this.searchTerm || '';

    this.banHangService.getSanPham(pageSize, pageNumber, keyWord, sizeId, mauSacId, thuongHieuId, xuatXuId, gioiTinhId).subscribe(
      data => {
        this.product = data.result.content.content;
        this.pagination = data.result.pagination;
      },
      error => this.handleError(error)
    );
  }

  searchProduct(): void {
    this.getSanPham();
  }
  //=========call thuộc tính==============
  size: any[] = [];
  getSize(): void {
    this.banHangService.getSize().subscribe(
      data => {
        this.size = data.result.content;
      }
    )
  }
  mauSac: any[] = [];
  getMauSac(): void {
    this.banHangService.getMauSac().subscribe(
      data => {
        this.mauSac = data.result.content;
      }
    )
  }
  thuongHieu: any[] = [];
  getThuongHieu(): void {
    this.banHangService.getThuongHieu().subscribe(
      data => {
        this.thuongHieu = data.result.content;
      }
    )
  }
  xuatXu: any[] = [];
  getXuatXu(): void {
    this.banHangService.getXuatXu().subscribe(
      data => {
        this.xuatXu = data.result.content;
      }
    )
  }
  gioiTinh: any[] = [];
  getGioiTinh(): void {
    this.banHangService.getGioiTinh().subscribe(
      data => {
        this.gioiTinh = data.result.content;
      }
    )
  }
  //========chọn thuộc tính===============
  onChangeSize(event: any) {
    this.sizeId = event.target.value || '';
    this.getSanPham();
  }

  onChangeMauSac(event: any) {
    this.mauSacId = event.target.value || '';
    this.getSanPham();
  }

  onChangeThuongHieu(event: any) {
    this.thuongHieuId = event.target.value || '';
    this.getSanPham();
  }

  onChangeXuatXu(event: any) {
    this.xuatXuId = event.target.value || '';
    this.getSanPham();
  }

  onChangeGioiTinh(event: any) {
    this.gioiTinhId = event.target.value || '';
    this.getSanPham();
  }
  // ================= Chọn sản phẩm ================

  selectProduct(idSanPham: number): void {
    // Hiển thị hộp thoại để nhập số lượng sản phẩm
    Swal.fire({
      title: 'Nhập số lượng sản phẩm',
      input: 'number', // Kiểu nhập là số
      inputPlaceholder: 'Nhập số lượng',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy',
      inputAttributes: {
        min: '1', // Giá trị tối thiểu
        step: '1'  // Bước nhảy
      },
      customClass: {
        confirmButton: 'linear-gradient(135deg, #3a6f9e 0%, #4fb0d1 100%)', // Thay đổi màu cho nút xác nhận
        cancelButton: 'btn btn-danger' // Thay đổi màu cho nút hủy
      },
      focusConfirm: false,
      preConfirm: (value) => {
        const soLuong = Number(value);
        if (isNaN(soLuong) || soLuong < 1) {
          Swal.showValidationMessage('Số lượng phải lớn hơn hoặc bằng 1. Vui lòng nhập lại.');
          return false; // Trả về false để không đóng hộp thoại
        }
        return value; // Trả về giá trị hợp lệ
      }
    }).then((result) => {
      if (result.isConfirmed) { // Kiểm tra nếu người dùng đã nhấn "Xác nhận"
        const soLuong = Number(result.value); // Lấy giá trị số lượng
  
        // Tạo đối tượng sản phẩm đã chọn với số lượng đã nhập
        const selectedProduct = {
          hoaDon: this.activeInvoiceID,
          chiTietSanPham: idSanPham,
          soLuong: soLuong,
        };
  
        // Gọi service để chọn sản phẩm với số lượng đã nhập
        this.banHangService.selectProduct(idSanPham, selectedProduct).subscribe(
          response => {
            this.showSuccessMessage('Chọn sản phẩm thành công!');
            this.close();
          },
          error => {
            this.handleError(error);
          }
        );
      }
    });
  }
  //=========xử lý lỗi=================
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
}

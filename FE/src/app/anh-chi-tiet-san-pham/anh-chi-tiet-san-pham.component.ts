import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AnhChiTietSanPhamService } from './anh-chi-tiet-san-pham.service';
import Swal from 'sweetalert2';
import { error } from 'console';
import { url } from 'inspector';
import * as e from 'express';
import { flush } from '@angular/core/testing';
declare var $: any;

@Component({
  selector: 'app-anh-chi-tiet-san-pham',
  templateUrl: './anh-chi-tiet-san-pham.component.html',
  styleUrls: ['./anh-chi-tiet-san-pham.component.css']
})
export class AnhChiTietSanPhamComponent implements OnInit {
  @Output() closePopup = new EventEmitter<void>();
  @Input() idChiTietSanPham !: number;
  products: any[] = []; // Biến chứa danh sách sản phẩm
  totalElements: number = 0;
  size: number = 10; // Cấu hình số lượng nhân viên mỗi trang
  currentPage: number = 0; // Trang hiện tại
  totalPages: number = 0; // Tổng số trang
  idAnhDetail: number;
  urlDetail: string = '';
  selectedFile: File = null;
  urlAnh: string = '';
  validate: boolean = false;

  constructor(private productService: AnhChiTietSanPhamService) { }

  ngOnInit(): void {
    this.getProducts(); // Gọi phương thức để tải danh sách sản phẩm khi component được khởi tạo
  }
  close() {
    this.closePopup.emit();
  }
  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages) {
      return; // Kiểm tra nếu trang không hợp lệ
    }
    this.currentPage = page;
    // this.searchKhachHang();
    this.getProducts();
  }
  // Phương thức để lấy danh sách ảnh chi tiết sản phẩm với phân trang
  getProducts(): void {
    this.productService.getProducts(this.currentPage, this.size, this.idChiTietSanPham).subscribe(
      (response: any) => {
        if (response.status) {
          this.products = response.result.content.content; // Lưu danh sách sản phẩm
          this.totalPages = response.result.content.totalPages; // Cập nhật tổng số trang
        }
        console.log(this.products);

      },
      (error) => {
        console.error('Lỗi khi gọi API danh sách sản phẩm:', error);
      }
    );
  }
  create(): void {
    if (this.urlAnh === null|| this.urlAnh.trim() === '') {
      this.validate = true;
    } else {
      const anh = {
        idChiTietSanPham: this.idChiTietSanPham,
        urlAnh: this.urlAnh
      }
      this.productService.create(anh).subscribe(
        response => {
          this.showSuccessMessage('Thêm thành công!');
          this.getProducts();
          this.resetForm();
        },
        error => {
          this.handleError(error);
        }
      )
    }
  }
  update(id: number): void {
    if (this.urlAnh === null|| this.urlAnh.trim() === '') {
      this.validate = true;
    } else {
      const anh = {
        idChiTietSanPham: this.idChiTietSanPham,
        urlAnh: this.urlAnh
      }
      this.productService.update(id, anh).subscribe(
        response => {
          this.showSuccessMessage('Cập nhật thành công!');
          this.getProducts();
          this.resetForm();
        },
        error => {
          this.handleError(error);
        }
      )
    }
  }
  detail(id: number): void {
    this.productService.detail(id).subscribe(
      data => {
        this.idAnhDetail = data.result.content.id
        this.urlAnh = data.result.content.urlAnh;
      },
      error => {
        this.handleError(error);
      }
    )
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.urlAnh = e.target.result;
      };
      reader.readAsDataURL(file);
    }
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
  resetForm():void{
    this.urlAnh='';
    this.idAnhDetail = 0;
  }

}

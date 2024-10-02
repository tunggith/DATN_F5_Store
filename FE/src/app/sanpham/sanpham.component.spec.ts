import { Component, OnInit } from '@angular/core';
import { SevricesanphamService } from './sevricesanpham.service'; // Đảm bảo bạn import đúng service
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sanpham',
  templateUrl: './sanpham.component.html',
  styleUrls: ['./sanpham.component.css']
})
export class SanphamComponent implements OnInit {
  sanPhamList: any[] = []; // Danh sách sản phẩm
  totalPages: number = 0; // Tổng số trang
  page: number = 0; // Trang hiện tại
  size: number = 5; // Kích thước mỗi trang

  constructor(private sanPhamService: SevricesanphamService) { }

  ngOnInit() {
    this.getSanPham(this.page); // Gọi API để lấy sản phẩm khi khởi tạo
  }

  getSanPham(page: number) {
    this.sanPhamService.getAllSanPham(page, this.size).subscribe(response => {
      if (response.status) {
        this.sanPhamList = response.result.content; // Lấy danh sách sản phẩm
        this.totalPages = response.result.totalPages; // Lấy tổng số trang
        this.page = response.result.pageable.pageNumber; // Cập nhật trang hiện tại
      }
    }, error => {
      console.error('Có lỗi xảy ra khi gọi API:', error);
    });
  }

  changePage(newPage: number) {
    if (newPage >= 0 && newPage < this.totalPages) {
      this.getSanPham(newPage); // Gọi lại API với trang mới
    }
  }

  viewDetail(idSanPham: number) {
    this.sanPhamService.getChiTietSanPham(idSanPham).subscribe(response => {
      console.log(response);
      // Xử lý hiển thị chi tiết sản phẩm, như mở modal hoặc điều hướng đến trang chi tiết
    }, error => {
      console.error('Có lỗi xảy ra khi gọi API chi tiết sản phẩm:', error);
    });
  }
}

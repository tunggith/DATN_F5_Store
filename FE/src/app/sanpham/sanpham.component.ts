import { Component, OnInit } from '@angular/core';
import { SevricesanphamService } from './sevricesanpham.service'; // Import service

@Component({
  selector: 'app-sanpham',
  templateUrl: './sanpham.component.html',
  styleUrls: ['./sanpham.component.css']
})
export class SanphamComponent implements OnInit {
  // Phân trang cho bảng 1 (quản lý sản phẩm)
  sanPhamList: any[] = [];
  totalPagesSanPham: number = 0;
  pageSanPham: number = 0;
  sizeSanPham: number = 5;

  // Phân trang cho bảng 2 (danh sách sản phẩm)
  danhSachSanPhamList: any[] = [];
  totalPagesDanhSach: number = 0;
  pageDanhSach: number = 0;
  sizeDanhSach: number = 5;

  constructor(private sanPhamService: SevricesanphamService) { }

  ngOnInit() {
    this.getSanPham(this.pageSanPham); // Lấy dữ liệu bảng 1
    this.getDanhSachSanPham(this.pageDanhSach); // Lấy dữ liệu bảng 2
  }

  // Hàm lấy dữ liệu cho bảng 1
  getSanPham(page: number) {
    this.sanPhamService.getAllSanPham(page, this.sizeSanPham).subscribe(response => {
      if (response.status) {
        this.sanPhamList = response.result.content.content;
        this.totalPagesSanPham = response.result.content.totalPages;
        this.pageSanPham = response.result.content.pageable.pageNumber;
      }
    });
  }

  // Hàm lấy dữ liệu cho bảng 2
  getDanhSachSanPham(page: number) {
    this.sanPhamService.getAllSanPham(page, this.sizeDanhSach).subscribe(response => {
      if (response.status) {
        this.danhSachSanPhamList = response.result.content.content;
        this.totalPagesDanhSach = response.result.content.totalPages;
        this.pageDanhSach = response.result.content.pageable.pageNumber;
      }
    });
  }

  // Hàm thay đổi trang cho bảng 1
  changePageSanPham(newPage: number) {
    if (newPage >= 0 && newPage < this.totalPagesSanPham) {
      this.getSanPham(newPage);
    }
  }

  // Hàm thay đổi trang cho bảng 2
  changePageDanhSach(newPage: number) {
    if (newPage >= 0 && newPage < this.totalPagesDanhSach) {
      this.getDanhSachSanPham(newPage);
    }
  }
}

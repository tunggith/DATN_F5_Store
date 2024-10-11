import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnhChiTietSanPhamService } from './anh-chi-tiet-san-pham.service';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-anh-chi-tiet-san-pham',
  templateUrl: './anh-chi-tiet-san-pham.component.html',
  styleUrls: ['./anh-chi-tiet-san-pham.component.css']
})
export class AnhChiTietSanPhamComponent implements OnInit {
  products: any[] = []; // Biến chứa danh sách sản phẩm
  productDetails: any[] = []; // Biến chứa danh sách chi tiết sản phẩm


  totalElements: number = 0;
  size: number = 10; // Cấu hình số lượng nhân viên mỗi trang
  currentPage: number = 0; // Trang hiện tại
  totalPages: number = 0; // Tổng số trang


  chiTietSanPhamList: any[] = [];  // Danh sách chi tiết sản phẩm để hiển thị trong select
chiTietSanPhamId: number;  // Biến để lưu ID được chọn
  // Biến cho sản phẩm được thêm hoặc cập nhật
  newAnhChiTiet: any = {
    urlAnh : '',
  };
  updateAnhChiTietData: any ={

  }

  constructor(private productService: AnhChiTietSanPhamService) { }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages) {
      return; // Kiểm tra nếu trang không hợp lệ
    }
    this.currentPage = page;
    // this.searchKhachHang();
    this.getProducts(this.currentPage);
    this.getProductDetails
  }
  ngOnInit(): void {
    this.getProducts(this.currentPage); // Gọi phương thức để tải danh sách sản phẩm khi component được khởi tạo
    this.getProductDetails(this.currentPage); // Gọi phương thức để tải danh sách chi tiết sản phẩm
  }

  // Phương thức để lấy danh sách sản phẩm với phân trang
  getProducts(page: number): void {
    this.productService.getProducts(this.currentPage, this.size).subscribe(
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

  // Phương thức để lấy danh sách chi tiết sản phẩm
  getProductDetails(page:number): void {
    this.productService.getChiTietSanPham(this.currentPage,this.size).subscribe(
      response=> {
        console.log('ctsp',response)
        if  ( response && response.status) {
          this.productDetails = response.result.content.body; // Lưu danh sách chi tiết sản phẩm
          console.log('danh sách chi tiết sản phám', this.productDetails);
        }
      },
      (error) => {
        console.error('Lỗi khi gọi API danh sách chi tiết sản phẩm:', error);
      }
    );  
  }

  // Phương thức để thêm hoặc cập nhật sản phẩm
  

  // Phương thức để khởi tạo lại form
  resetForm(): void {
    this.newAnhChiTiet = {
      id: null,
      urlAnh: '',
      chiTietSanPhamId: null // Reset khóa ngoại
    };
  }

  // Phương thức để chuyển trang
  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page; // Cập nhật trang hiện tại
      this.getProducts(this.currentPage); // Tải lại danh sách sản phẩm cho trang mới
      this.getProductDetails(this.currentPage);
    }
  }

  
  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.newAnhChiTiet.urlANh = e.target.result; // Lưu URL ảnh vào đối tượng nhân viên
      };
      reader.readAsDataURL(file); // Đọc file và tạo URL
    }
  }
  // Phương thức để chỉnh sửa sản phẩm
  showDetail(product: any): void {
    this.newAnhChiTiet = { ...product }; // Sao chép thông tin sản phẩm vào form
    this.updateAnhChiTietData.id = product.id;
    this.chiTietSanPhamId = product.chiTietSanPhamId; // Cập nhật chiTietSanPhamId

  }
   // Phương thức để xử lý sự kiện chọn file
   createAnhChiTiet(): void {
    this.productService.addProduct(this.newAnhChiTiet, this.chiTietSanPhamId).subscribe(
      (response) => {
        this.newAnhChiTiet = {};
        Swal.fire({
          title: 'Thành công!',
          text: 'Ảnh chi tiết sản phẩm đã được thêm thành công.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.getProducts(this.currentPage);
        this.getProductDetails(this.currentPage);
      },
      (error) => {
        Swal.fire({
          title: 'Lỗi!',
          text: 'Có lỗi xảy ra trong quá trình thêm mới ảnh chi tiết sản phẩm.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    );
  }
  updateAnhChiTiet(id: number): void {
    this.productService.updateProduct(id, this.newAnhChiTiet).subscribe(() => {
      Swal.fire({
        title: 'Thành công!',
        text: 'Ảnh chi tiết sản phẩm đã được cập nhật thành công.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      this.getProducts(this.currentPage);
      this.getProductDetails(this.currentPage);
      this.updateAnhChiTietData = {};
    }, error => {
      Swal.fire({
        title: 'Lỗi!',
        text: 'Có lỗi xảy ra trong quá trình cập nhật ảnh chi tiết sản phẩm.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      console.log('Có lỗi trong quá trình cập nhật', error);
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { KhuyenMaiSanPhamChiTietService } from './khuyen-mai-san-pham-chi-tiet.service';
import { CommonModule } from '@angular/common';
import { KhuyenMaiService } from '../khuyenMai/khuyen-mai.service';
import { ActivatedRoute } from '@angular/router';
import { DataResponse } from '../models/data-response.model';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-khuyen-mai-san-pham-chi-tiet',
  templateUrl: './khuyen-mai-san-pham-chi-tiet.component.html',
  styleUrls: ['./khuyen-mai-san-pham-chi-tiet.component.css']
})
export class KhuyenMaiChiTietSanPhamComponent implements OnInit {
  khuyenMais: any[] = [];
  chiTietSanPhams: any[] = [];
  locSanPhams: any[] = [];
  selectedKhuyenMai: any; 
  khuyenMaiChiTietSanPhams: any[];
  page: number = 0; 
  size : number = 5;
  totalPages: 0;
  searchTerm: string = '';

  selectedKhuyenMaiId: number | null = null;
  


  constructor(private khuyenMaiChiTietSanPhamService: KhuyenMaiSanPhamChiTietService,
    private router: ActivatedRoute,
    private khuyenMaiService : KhuyenMaiService,
    private CommonModule : CommonModule
    
  ) {}

  ngOnInit() {
    this.selectedKhuyenMaiId = +this.router.snapshot.paramMap.get('id')!; // Lấy id từ route
    this.fetchKhuyenMaiDetail(this.selectedKhuyenMaiId);
    this.fetchChiTietSanPhams();
    this.loadSanPhamTimKiems();
    this.fetchKhuyenMaiChiTietSanPham(this.selectedKhuyenMaiId);
    this.loadSelectionsFromLocalStorage();
    
  }

 

filterSanPhams() {
  if (!this.searchTerm) {
    return this.chiTietSanPhams;
  }
  return this.chiTietSanPhams.filter(sp => sp.ten_san_pham.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                                           sp.ma.toLowerCase().includes(this.searchTerm.toLowerCase()));
}


  // find thông tin khuyến mãi lấy theo selectedKhuyenMaiId 
  fetchKhuyenMaiDetail(id: number) {
    this.khuyenMaiService.getKhuyenMaiById(id).subscribe(
      (response: DataResponse<any>) => {
        if (response && response.status) {
          this.selectedKhuyenMai = response.result.content; // Lưu thông tin khuyến mãi
          console.log('Khuyen Mai Details:', this.selectedKhuyenMai);
        } else {
          console.error('Không tìm thấy thông tin khuyến mãi.');
        }
      },
      (error) => console.error('Lỗi khi gọi API khuyến mãi:', error)
    );
  }


// find sản phẩm đã được áp dụng khuyến mãi
  fetchKhuyenMaiChiTietSanPham(id: number) {
    this.khuyenMaiChiTietSanPhamService.getByKm(id).subscribe(
      (response: DataResponse<any>) => {
        if (response && response.status) {
          this.khuyenMaiChiTietSanPhams = response.result.content.content;

          if (!Array.isArray(this.khuyenMaiChiTietSanPhams)) {
            console.error('Dữ liệu không phải là một mảng:', this.khuyenMaiChiTietSanPhams);
          } else {
            // Duyệt qua từng sản phẩm và kiểm tra trạng thái
            this.khuyenMaiChiTietSanPhams.forEach(sanPham => {
              // Nếu trạng thái không phải "Đang hoạt động", thì khóa checkbox (disabled)
              sanPham.isDisabled = sanPham.trangThai !== 'Đang hoạt động';
            });
          }
        } else {
          console.error('Không tìm thấy thông tin khuyến mãi chi tiết sản phẩm.');
        }
      },
      (error) => console.error('Lỗi khi gọi API khuyến mãi chi tiết sản phẩm:', error)
    );
}




// find chi tiết sản phẩm
fetchChiTietSanPhams() {
  this.khuyenMaiChiTietSanPhamService.getAllctsp(this.page, this.size).subscribe(
    (response: any) => {
      console.log('Response:', response);
      this.chiTietSanPhams = response.content;  
      this.totalPages = response.totalPages;    
      this.loadSelectionsFromLocalStorage();  
    },
    (error) => console.error('Lỗi khi gọi API sản phẩm:', error)
  );
}

loadSanPhamTimKiems(): void {
  this.khuyenMaiChiTietSanPhamService.timTheoTenHoacMa(this.searchTerm,this.page, this.size)
    .subscribe(response => {
      this.chiTietSanPhams = response.content;  // Gán danh sách sản phẩm
      this.totalPages = response.totalPages;
      this.loadSelectionsFromLocalStorage();   // Tổng số trang
    }, error => {
      console.error('Lỗi khi tải sản phẩm:', error);
    });
}
onSearch(): void {
  this.page = 0;  // Reset về trang đầu tiên khi tìm kiếm mới
  this.loadSanPhamTimKiems();
}





  // hàm thêm, xóa khuyến mãi vào sản phẩm
  onCheckboxChange(chiTietSanPham : any, event: any) {
    if (!this.selectedKhuyenMai || !this.selectedKhuyenMai.id) {
      alert('Khuyến mãi lỗi, vui lòng thử lại');
      return;
    }
    const isChecked = event.target.checked;
    if (isChecked) {
      // Thêm sản phẩm vào khuyến mãi chi tiết
      const formData = {
        khuyenMai: { id: this.selectedKhuyenMai.id },
        chiTietSanPham: { id: chiTietSanPham.id }
      };
      this.khuyenMaiChiTietSanPhamService.createKhuyenMaiChiTietSanPham(formData).subscribe(
        (response) => {
          if (response.status) {
            Swal.fire({
              title: 'F5 Store xin thông báo : ',
              text: response.result.content,
              icon: 'success',
              confirmButtonText: 'OK',
              customClass: {
                confirmButton: 'custom-confirm-button'
              }
            });
            chiTietSanPham.selected = true; 
            this.fetchKhuyenMaiChiTietSanPham(this.selectedKhuyenMaiId); 
            this.saveSelectionsToLocalStorage(); 
            this.fetchKhuyenMaiDetail(this.selectedKhuyenMaiId);
            this.fetchChiTietSanPhams();    
          } else {
            Swal.fire({
              title: 'F5 Store xin thông báo : ',
              text: response.result.content,
              icon: 'error',
              confirmButtonText: 'OK',
              customClass: {
                confirmButton: 'custom-confirm-button'
              }
            });
            chiTietSanPham.selected = false;
            this.fetchKhuyenMaiChiTietSanPham(this.selectedKhuyenMaiId); 
            this.saveSelectionsToLocalStorage(); 
            this.fetchChiTietSanPhams();
          }
        },
        (error) => {
          Swal.fire({
            title: 'F5 Store xin thông báo : ',
            text:'Lỗi thêm khuyến mãi cho sản phẩm, vui lòng thử lại',
            icon: 'error',
            confirmButtonText: 'OK',
            customClass: {
              confirmButton: 'custom-confirm-button'
            }
          });
          event.target.checked = false; // Bỏ check nếu có lỗi
        }
      );
    } else {
      // Xóa sản phẩm khỏi khuyến mãi chi tiết
      this.khuyenMaiChiTietSanPhamService.XoaKmctsp(chiTietSanPham.id).subscribe(
        (response) => {
          if (response.result.content) {
            Swal.fire({
              title: 'F5 Store xin thông báo : ',
              text: response.result.content,
              icon: 'success',
              confirmButtonText: 'OK',
              customClass: {
                confirmButton: 'custom-confirm-button'
              }
            });
            chiTietSanPham.selected = false; // Cập nhật trạng thái checkbox
            this.saveSelectionsToLocalStorage(); // lưu lại trạng thái
            this.fetchChiTietSanPhams();
            this.fetchKhuyenMaiChiTietSanPham(this.selectedKhuyenMaiId); 

          
          } else {
            Swal.fire({
              title: 'F5 Store xin thông báo : ',
              text: 'Lỗi xóa khuyến mãi sản phẩm, vui lòng thử lại',
              icon: 'error',
              confirmButtonText: 'OK',
              customClass: {
                confirmButton: 'custom-confirm-button'
              }
            });
            event.target.checked = true;
            this.saveSelectionsToLocalStorage();
            this.fetchChiTietSanPhams();
          }
        
        },
        (error) => {
          console.log(error);
          Swal.fire({
            title: 'F5 Store xin thông báo : ',
            text: 'Lỗi xóa khuyến mãi sản phẩm, vui lòng thử lại',
            icon: 'error',
            confirmButtonText: 'OK',
            customClass: {
              confirmButton: 'custom-confirm-button'
            }
          });
          event.target.checked = true;
          this.saveSelectionsToLocalStorage();
          this.fetchChiTietSanPhams();  // Nếu xóa thất bại, giữ lại checkbox
      }
    );
  }
}



  loadSelectionsFromLocalStorage() {
    const selectedProductIds = JSON.parse(localStorage.getItem('selectedProducts')) || [];
    this.chiTietSanPhams.forEach(sp => {
      sp.selected = selectedProductIds.includes(sp.id);
    });
 }


 saveSelectionsToLocalStorage() {
    const selectedProductIds = this.chiTietSanPhams
      .filter(sp => sp.selected)
      .map(sp => sp.id);
    localStorage.setItem('selectedProducts', JSON.stringify(selectedProductIds));
}



prevPage(): void {
  if (this.page > 0) {
    this.page--;
    this.fetchChiTietSanPhams(); // Gọi lại để tải dữ liệu cho trang trước
  }
}


nextPage(): void {
  if (this.page < this.totalPages - 1) {
    this.page++;
    this.fetchChiTietSanPhams(); // Gọi lại để tải dữ liệu cho trang tiếp theo
  }
}


goToPage(pageNumber: number): void {
  console.log('Current Page:', this.page);
  this.page = pageNumber;
  this.fetchChiTietSanPhams(); // Gọi lại API để tải dữ liệu
}


}


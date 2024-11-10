import { Component, OnInit } from '@angular/core';
import { SanPhamService } from 'src/app/san-pham/san-pham-service.component';

@Component({
  selector: 'app-san-pham',
  templateUrl: './san-pham.component.html',
  styleUrls: ['./san-pham.component.css']
})
export class SanPhamComponent implements OnInit {

  xuatXuList: any[] = [];
  sizeList: any[] = [];
  mauSacList: any[] = [];
  gioiTinhList: any[] = [];
  sanPhamPage: any[] = [];
  totalPages: number[] = []; // Mảng chứa các số trang
  totalElements: number = 0; // Tổng số sản phẩm
  // Khai báo page và size trước
  page: number = 0;
  size: number = 10;

  // khai báo biến chọn màu
  selectedColors: string[] = [];
  selectedSizes: string[] = [];
  selectedGioiTinhs: string[] = [];
  selectedXuatXu: string[] = [];
// Biến để kiểm soát trạng thái mở rộng/thu lại
  isOpen: boolean = false; 
  isSizeOpen: boolean = false;
  isGioiTinhOpen: boolean = false;
  isThuongHieuOpen: boolean = false;
  isXuatXuOpen: boolean = false;





  
  constructor(private sanPhamService: SanPhamService) { }
//====================== hàm chạy ========================
  ngOnInit(): void {
    this.loadData();
  }
//===================== hàm chạy end========================

  //==================== hàm loadata ================
      loadData() :void{
        this.loadXuatXu();
        this.loadSize();
        this.loadMauSac();
        this.loadGioiTinh();
        this.loadSanPhamPhanTrang();

      }
  // ============= hàm loadata end===============

  loadXuatXu(): void {
    this.sanPhamService.getXuatXu().subscribe(
      (response: any) => {
        console.log('Phản hồi API Xuat Xu:', response);
        this.xuatXuList = response.result.content;
        console.log('Danh sách Xuất Xứ đã tải:', this.xuatXuList);
      },
      (error) => {
        console.error('Lỗi khi tải danh sách Xuất Xứ:', error);
      }
    );
  }

  loadSize(): void {
    this.sanPhamService.getSize().subscribe(
      (response: any) => {
        console.log('Phản hồi API Size:', response);
        this.sizeList = response.result.content;
        console.log('Danh sách Size đã tải:', this.sizeList);
      },
      (error) => {
        console.error('Lỗi khi tải danh sách Size:', error);
      }
    );
  }

  loadMauSac(): void {
    this.sanPhamService.getMauSac().subscribe(
      (response: any) => {
        console.log('Phản hồi API Mau Sac:', response);
        this.mauSacList = response.result.content;
        console.log('Danh sách Màu Sắc đã tải:', this.mauSacList);
      },
      (error) => {
        console.error('Lỗi khi tải danh sách Màu Sắc:', error);
      }
    );
  }

  loadGioiTinh(): void {
    this.sanPhamService.getGioiTinh().subscribe(
      (response: any) => {
        console.log('Phản hồi API Gioi Tinh:', response);
        this.gioiTinhList = response.result.content;
        console.log('Danh sách Giới Tính đã tải:', this.gioiTinhList);
      },
      (error) => {
        console.error('Lỗi khi tải danh sách Giới Tính:', error);
      }
    );
  }

  loadSanPhamPhanTrang(): void {
    this.sanPhamService.getSanPhamPhanTrang(this.page, this.size).subscribe(
      (response: any) => {
        console.log('Phản hồi API Sản Phẩm Phân Trang:', response);
        if (response && response.content) {
          this.sanPhamPage = response.content;
          this.totalElements = response.totalElements;
          this.calculateTotalPages(); // Tính tổng số trang sau khi nhận dữ liệu
        } else {
          console.log('Không có dữ liệu trong response.content');
        }
      },
      (error) => {
        console.error('Lỗi khi tải danh sách Sản Phẩm Phân Trang:', error);
      }
    );
  }
  
  changePage(page: number, event: MouseEvent) {
    event.preventDefault();  // Ngừng hành động mặc định của thẻ <a>
    // Xử lý logic phân trang tại đây
    console.log('Chuyển trang:', page);
    this.page = page;
    this.loadSanPhamPhanTrang(); // Gọi lại hàm phân trang
  }

  calculateTotalPages(): void {
    const totalPages = Math.ceil(this.totalElements / this.size);
    this.totalPages = Array.from({ length: totalPages }, (_, i) => i); // Tạo mảng số trang
  }



  

// ==============================================================================================================
//                                     XỬ LÝ MỞ RỘNG/THU GỌN VÀ CHỌN THUỘC TÍNH
// ==============================================================================================================
//
// Các hàm để quản lý việc mở rộng/thu gọn danh sách và xử lý lựa chọn của người dùng cho các thuộc tính sản phẩm 
// (màu sắc, kích thước, xuất xứ, giới tính).
// Mỗi hàm toggle kiểm soát trạng thái mở/thu gọn của một danh sách thuộc tính cụ thể, 
// trong khi mỗi hàm xử lý thay đổi sẽ quản lý việc chọn và bỏ chọn các thuộc tính riêng lẻ, 
// đồng thời ghi lại các giá trị đã chọn để kiểm tra.
//
// --------------------------------------------------------------------------------------------------------------
//
// Hàm Toggle cho Danh sách Thuộc tính
// --------------------------------------------------------------------------------------------------------------

  // Hàm xử lý khi nhấn vào tiêu đề để mở rộng/thu lại
  toggleColorList(): void {
    this.isOpen = !this.isOpen; // Đổi trạng thái mở rộng/thu lại
  }
  
  // Hàm xử lý khi nhấn vào tiêu đề để mở rộng/thu lại phần kích thước
  toggleSizeList(): void {
    this.isSizeOpen = !this.isSizeOpen; // Đổi trạng thái mở rộng/thu lại
  }

  toggleXuatXuList(): void {
    this.isXuatXuOpen = !this.isXuatXuOpen; // Đổi trạng thái mở rộng/thu lại
  }

  toggleGioiTinhList(): void {
    this.isGioiTinhOpen = !this.isGioiTinhOpen; // Đổi trạng thái mở rộng/thu lại
  }
    
//  sử lý khi chọn  thuộc tính
  onColorChange(color: any): void {
    if (this.selectedColors.includes(color.ten)) {
      // Nếu màu sắc đã có trong danh sách thì bỏ chọn
      this.selectedColors = this.selectedColors.filter(c => c !== color.ten);
    } else {
      // Nếu chưa có thì thêm vào danh sách đã chọn
      this.selectedColors.push(color.ten);
    }
    console.log('Màu sắc đã chọn:', this.selectedColors);
  }

 
  // Hàm xử lý khi người dùng chọn hoặc bỏ chọn kích thước
  onSizeChange(size: any): void {
    if (this.selectedSizes.includes(size.ten)) {
      // Nếu kích thước đã có trong danh sách thì bỏ chọn
      this.selectedSizes = this.selectedSizes.filter(s => s !== size.ten);
    } else {
      // Nếu chưa có thì thêm vào danh sách đã chọn
      this.selectedSizes.push(size.ten);
    }
    console.log('Kích thước đã chọn:', this.selectedSizes);
  }




  // Hàm xử lý khi người dùng chọn hoặc bỏ chọn kích thước
  onGioiTinhChange(GioiTinh: any): void {
    if (this.selectedSizes.includes(GioiTinh.ten)) {
      // Nếu kích thước đã có trong danh sách thì bỏ chọn
      this.selectedSizes = this.selectedSizes.filter(s => s !== GioiTinh.ten);
    } else {
      // Nếu chưa có thì thêm vào danh sách đã chọn
      this.selectedSizes.push(GioiTinh.ten);
    }
    console.log('Kích thước đã chọn:', this.selectedSizes);
  }

  
  // Hàm xử lý khi người dùng chọn hoặc bỏ chọn kích thước
  onXuatXuChange(XuatXu: any): void {
    if (this.selectedXuatXu.includes(XuatXu.ten)) {
      // Nếu kích thước đã có trong danh sách thì bỏ chọn
      this.selectedXuatXu = this.selectedXuatXu.filter(s => s !== XuatXu.ten);
    } else {
      // Nếu chưa có thì thêm vào danh sách đã chọn
      this.selectedXuatXu.push(XuatXu.ten);
    }
    console.log('Kích thước đã chọn:', this.selectedXuatXu);
  }
  
// ==============================================================================================================
//                                    KẾT THÚC XỬ LÝ MỞ RỘNG/THU GỌN VÀ CHỌN THUỘC TÍNH
// ==============================================================================================================
} 

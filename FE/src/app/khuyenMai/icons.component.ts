import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { KhuyenMaiService } from './khuyen-mai.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { SevricesanphamService } from '../sanpham/sevricesanpham.service';
import { KhuyenMaiSanPhamChiTietService } from '../khuyen-mai-san-pham-chi-tiet/khuyen-mai-san-pham-chi-tiet.service';
import { DataResponse } from '../models/data-response.model';
import Swal from 'sweetalert2';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-khuyen-mai',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.css']
})
export class IconsComponent implements OnInit {

  
  role:string='';
 
  isFormVisible: boolean = false;
 
  khuyenMais: any[] = [];
  khuyenMaiChiTietSanPhams : any[] = [];
  searchForm: FormGroup;
 
  
  
  currentKhuyenMai: any = {
    id: 0,
    ma: '',
    ten: '',
    kieuKhuyenMai: '',
    moTa: '',
    soLuong: 0,
    giaTriKhuyenMai: 0,
    thoiGianBatDau: new Date(),
    thoiGianKetThuc: new Date(),
    thoiGianTao: new Date(),
    thoiGianSua: new Date(),
    nguoiTao: '',
    nguoiSua: '',
    trangThai: ''
  };

  isEditing = false;
  alertMessage: string = '';
  alertType: string = ''; 
  searchTerm: string = '';
  page: number = 0; 
  size: number = 5;
  sizeSp: number = 5;
  pageSp: number = 0; 
  totalPages: 0;
  totalPageSp: 0;
  selectedKhuyenMai: any;
  selectedProductIds: number[] = [];
  products: any[] = [];






  // san pham
  sanPhamList: any[] = [];
  totalPagesSanPham: number = 0;
  pageSanPham: number = 0;
  sizeSanPham: number = 5;
  idSanPhamNe:  number = 1;
  chiTietSanPhamList: any[] = [];
  gioiTinhList: any[] = [];
  totalPagesChiTiet: number = 0;
  pageChiTiet: number = 0;
  sizeChiTiet: number = 5;
  thuongHieuList: any[] = [];
  xuatXuList: any[] = [];
  selectedSanPhamId: number = 0;
  filteredChiTietSanPhamList: any[] = []; // Danh sách lọc kết quả
  sizes: any[] = [];  // Biến để lưu danh sách các Size
  mauSacList: any[] = [];
  filteredSanPhamList: any[] = [];
  searchTerm1: string = '';
  chiTietSanPhamForm : FormGroup;
  searchChiTietTerm: string = '';
  
  
  // Các thuộc tính đã có
    selectedColor: number = null; // Biến để lưu ID màu sắc đã chọn
    selectedSize: number = null; // Biến để lưu ID kích thước đã chọn
    maxPrice: number = null; // Giá tối đa để lọc
    selectedPrice: number = null; // Giá tối thiểu để lọc
    filteredChiTietSanPhamList2: any[] = []; // Danh sách lọc kết quả
    selectedSizes: number[] = [];
    selectedMauSacs: number[] = [];
    isValidSelection: boolean = false;

  

// Biến để lưu tên sản phẩm đã chọn
selectedSanPhamName: string = '';
selectedchiTietSanPhamId: number = 0;
selectedThuongHieu: number = 0;
selectedXuatXu: number = 0;
selectedGioiTinh: number = 0;



  constructor(
    private khuyenMaiService: KhuyenMaiService, 
    private fb: FormBuilder,
    private khuyenMaiSanPhamChiTietService: KhuyenMaiSanPhamChiTietService,
    private sanPhamService: SevricesanphamService,private cdr: ChangeDetectorRef
   
  ) {}

  ngOnInit(): void {
    
    this.role = localStorage.getItem('role');
    this.searchForm = this.fb.group({
      searchKey: [''],
      fromDate: [''],
      toDate: [''],
      trangThai: ['']
    });

      this.loadKhuyenMais();
      

      this.searchForm.valueChanges
      .pipe(debounceTime(500))
      .subscribe(values => {
        this.searchVouchers(values);
      });

     

     // sản phẩm
  
      this.sanPhamService.getAllThuongHieu().subscribe(response => {
        this.thuongHieuList = response.result.content || [];
        this.cdr.detectChanges(); // Ép cập nhật view
      });
    
      this.sanPhamService.getAllXuatXu().subscribe(response => {
        this.xuatXuList = response.result.content || [];
        this.cdr.detectChanges(); // Ép cập nhật view
      });
    
      this.sanPhamService.getAllGioiTinh().subscribe(response => {
        this.gioiTinhList = response.result.content || [];
        this.cdr.detectChanges(); // Ép cập nhật view
      });
    
      this.sanPhamService.getAllMauSac().subscribe(response => {
        this.mauSacList = response.result.content || [];
        console.log('Dữ liệu màu sắc:', this.mauSacList); // Kiểm tra dữ liệu màu sắc
        this.cdr.detectChanges();
      }, error => {
        console.error('Lỗi khi tải màu sắc:', error);
      });
    
      this.sanPhamService.getAllSizes().subscribe(response => {
        this.sizes = response.result.content || [];
        console.log('Dữ liệu kích thước:', this.sizes); // Kiểm tra dữ liệu kích thước
        this.cdr.detectChanges();
      }, error => {
        console.error('Lỗi khi tải kích thước:', error);
      });
  
      this.loaddata();
      this.filteredChiTietSanPhamList = [...this.chiTietSanPhamList];
      this.filteredSanPhamList = [...this.sanPhamList];
      this.filterSanPham();
      
  }

  loadKhuyenMais(): void {
    this.khuyenMaiService.getAll(this.page,this.size).subscribe(
      (response: any) => {
        if (response.status) {
          this.khuyenMais = response.result.content.content;
          this.totalPages = response.result.content.totalPages; // Lấy dữ liệu khuyến mãi từ API
          this.alertMessage = response.message; // Lấy thông báo từ backend
          this.alertType = 'success';
        } else {
          this.alertMessage = response.message; // Lấy thông báo từ backend
          this.alertType = 'danger';
        }
      },
      (error) => {
        console.error('Lỗi khi gọi API:', error);
        this.alertMessage = 'Lỗi khi gọi API: ' + error.message; // Lấy thông báo lỗi
        this.alertType = 'danger';
      }
    );
  }

  toggleFormVisibility() {
    this.isFormVisible = !this.isFormVisible;
  }


  // Gọi phương thức này khi nhấn nút thêm
  addKhuyenMai(): void {
    this.createKhuyenMai();
  }



createKhuyenMai() {
  // Xóa thuộc tính id trước khi gửi yêu cầu
  const { id, thoiGianBatDau, thoiGianKetThuc, ...khuyenMaiData } = this.currentKhuyenMai;

  // Không chuyển đổi thoiGianBatDau và thoiGianKetThuc sang UTC, giữ nguyên giá trị đã chọn
  khuyenMaiData.thoiGianBatDau = thoiGianBatDau;
  khuyenMaiData.thoiGianKetThuc = thoiGianKetThuc;

  this.khuyenMaiService.create(khuyenMaiData).subscribe(
    response => {
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
        this.resetForm();
        this.loadKhuyenMais();       
        this.addPromotionToProducts(response.result.id);
       
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
      }
    },
    error => {
      Swal.fire({
        title: 'F5 Store xin thông báo : ',
        text: 'Lỗi Thêm khuyến mãi, vui lòng thử lại',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'custom-confirm-button'
        }
      });
    }
  );
}

  

  editKhuyenMai(): void {
    // Chuyển đổi thoiGianBatDau và thoiGianKetThuc sang UTC
    const { thoiGianBatDau, thoiGianKetThuc, ...khuyenMaiData } = this.currentKhuyenMai;
  
    this.currentKhuyenMai.thoiGianBatDau = thoiGianBatDau;
    this.currentKhuyenMai.thoiGianKetThuc = thoiGianKetThuc;
  
    this.khuyenMaiService.update(this.currentKhuyenMai).subscribe(
      (response: any) => {
        if (response.status) {
          const index = this.khuyenMais.findIndex(km => km.id === response.result.id);
          if (index !== -1) {
            this.khuyenMais[index] = response.result; // Cập nhật khuyến mãi
          }
          Swal.fire({
            title: 'F5 Store xin thông báo : ',
            text: response.result.content,
            icon: 'success',
            confirmButtonText: 'OK',
            customClass: {
              confirmButton: 'custom-confirm-button'
            }
          });
          this.resetForm();
          this.loadKhuyenMais();
          this.addPromotionToProducts(response.result.id);
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
        }
      },
      (error) => {
        Swal.fire({
          title: 'F5 Store xin thông báo : ',
          text: 'Lỗi sửa khuyến mãi, vui lòng thử lại',
          icon: 'error',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'custom-confirm-button'
          }
        });
      }
    );
  }
  
  onEdit(khuyenMai: any): void {
    this.currentKhuyenMai = {
      ...khuyenMai
       // Chuyển đổi định dạng
    };
    this.isEditing = true; // Đặt trạng thái chỉnh sửa thành true
   
  }
  

  capNhapKm(khuyenMaiId: number): void {
    const khuyenMai = { id: khuyenMaiId };
  
    // Gọi API cập nhật trạng thái khuyến mãi
    this.khuyenMaiService.capnhap(khuyenMai).subscribe(
      response => {
        if (response.status) {
          // Hiển thị thông báo thành công
          Swal.fire({
            title: 'F5 Store xin thông báo : ',
            text: response.result.content,
            icon: 'success',
            confirmButtonText: 'OK',
            customClass: {
              confirmButton: 'custom-confirm-button'
            }
          });
          this.loadKhuyenMais();
        this.khuyenMaiSanPhamChiTietService.getByKm(khuyenMaiId).subscribe(
          (response: DataResponse<any>) => {
            if (response.status) {
            // lấy danh sách chi tiết sản phẩm có trong khuyến mãi sản phẩm
              const chiTietSanPhamList = response.result.content.content; 

              // Kiểm tra nếu chi tiết sản phẩm có tồn tại
              if (Array.isArray(chiTietSanPhamList) && chiTietSanPhamList.length > 0) {
                // gán chiTietSanPhams = chi tiết sản phẩm có trong danh sách khuyến maĩ
                this.filteredChiTietSanPhamList = chiTietSanPhamList.map(item => item.chiTietSanPham);
                this.filteredChiTietSanPhamList.forEach(id => {
                  console.log('id can doi : ',id.id);
                  id.id.checkKm = false;      
                });    
                this.loadKhuyenMais();
                this.getSanPhamPhanTrang(this.pageSp);
              } else {
                console.error('Không có sản phẩm nào trong danh sách.');
              }
            } else {
              console.error('Không tìm thấy thông tin chi tiết sản phẩm khuyến mãi.');
            }
          },
          (error) => console.error('Lỗi khi gọi API chi tiết sản phẩm khuyến mãi:', error)
        );
        } else {
          // Hiển thị thông báo lỗi
          Swal.fire({
            title: 'F5 Store xin thông báo : ',
            text: response.result.content,
            icon: 'error',
            confirmButtonText: 'OK',
            customClass: {
              confirmButton: 'custom-confirm-button'
            }
          });
          this.loadKhuyenMais();
        }
      },
      error => {
        // Xử lý lỗi khi gọi API
        Swal.fire({
          title: 'F5 Store xin thông báo : ',
          text: 'Lỗi khi đổi trạng thái',
          icon: 'error',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'custom-confirm-button'
          }
        });
        this.loadKhuyenMais();
      }
    );
  }
  

// tìm kiếm and lọc
searchVouchers(values: any): void {
  const { searchKey, fromDate, toDate, trangThai } = values;

  if (searchKey && !fromDate && !toDate && !trangThai) {
    // Tìm theo tên/mã
    this.khuyenMaiService.timTheoTenHoacMa(this.page, this.size, searchKey).subscribe((response) => {
      this.khuyenMais = response.result.content;
      this.totalPages = response.result.pagination.totalPage;
    });
  } else if (trangThai && !searchKey && !fromDate && !toDate) {
    // Tìm theo trạng thái
    this.khuyenMaiService.timTheoTrangThai(this.page, this.size, trangThai).subscribe((response) => {
      this.khuyenMais = response.result.content;
      this.totalPages = response.result.pagination.totalPage;
    });
  } else if ((fromDate || toDate) && !searchKey && !trangThai) {
    // Tìm theo ngày
    this.khuyenMaiService.timTheoNgay(this.page, this.size, fromDate, toDate).subscribe((response) => {
      this.khuyenMais = response.result.content;
      this.totalPages = response.result.pagination.totalPage;
      console.log('du lieu vc ngày : ', this.khuyenMais);
    });
  } else if (searchKey && (fromDate || toDate) && !trangThai) {
    // Tìm theo tên/mã và ngày
    this.khuyenMaiService.timTheoNgay(this.page, this.size, fromDate, toDate).subscribe((response) => {
      this.khuyenMais = response.result.content.filter(voucher =>
        (voucher.ten && voucher.ten.includes(searchKey)) || (voucher.ma && voucher.ma.includes(searchKey))
      );
      this.totalPages = response.result.pagination.totalPage;
    });
  } else if (!searchKey && (fromDate || toDate) && trangThai) {
    // Tìm theo ngày và trạng thái
    this.khuyenMaiService.timTheoNgay(this.page, this.size, fromDate, toDate).subscribe((response) => {
      this.khuyenMais = response.result.content.filter(voucher =>
        voucher.trangThai === trangThai
      );    
      this.totalPages = response.result.pagination.totalPage;
    });
  } else if (searchKey && !(fromDate || toDate) && trangThai) {
    // Tìm theo tên/mã và trạng thái
    this.khuyenMaiService.timTheoTenHoacMa(this.page, this.size, searchKey).subscribe((response) => {
      this.khuyenMais = response.result.content.filter(voucher =>
        voucher.trangThai === trangThai
      );
      this.totalPages = response.result.pagination.totalPage;
    });
  } else if (searchKey && (fromDate || toDate) && trangThai) {
    // Tìm tất cả
    this.khuyenMaiService.timTheoNgay(this.page, this.size, fromDate, toDate).subscribe((response) => {
      this.khuyenMais = response.result.content.filter(voucher =>
        (voucher.ten && voucher.ten.includes(searchKey)) || (voucher.ma && voucher.ma.includes(searchKey)) && voucher.trangThai === trangThai
      );
      this.totalPages = response.result.pagination.totalPage;
    });
  } else {
    // nếu tất cả trống thì findAll
    this.loadKhuyenMais();
  }
}



onDateChange(event: Event, type: string) {
  const inputDate = (event.target as HTMLInputElement).value; // Lấy giá trị ngày

  console.log('Giá trị đã chọn:', inputDate); // Hiển thị giá trị đã chọn

  if (type === 'batDau') {
      this.currentKhuyenMai.thoiGianBatDau = inputDate; // Gán trực tiếp giá trị cho thoiGianBatDau
  } else {
      this.currentKhuyenMai.thoiGianKetThuc = inputDate; // Gán trực tiếp giá trị cho thoiGianKetThuc
  }

  const displayId = type === 'batDau' ? 'thoiGianBatDauInput' : 'thoiGianKetThucInput';
  const displayElement = document.getElementById(displayId) as HTMLInputElement;

  if (displayElement) {
      displayElement.value = inputDate; // Chỉ gán giá trị nếu phần tử tồn tại
  } else {
      console.error(`Phần tử với ID '${displayId}' không tồn tại`);
  }
}




resetForm(): void {
  this.currentKhuyenMai = {
    id: 0,
    ma: '',
    ten: '',
    kieuKhuyenMai: '',
    moTa: '',
    soLuong: 0,
    giaTriKhuyenMai: 0,
    thoiGianBatDau: new Date().toISOString().slice(0, 16), // Chỉ giữ lại đến phút
    thoiGianKetThuc: new Date().toISOString().slice(0, 16),
    thoiGianTao: new Date(),
    thoiGianSua: undefined,
    nguoiTao: '',
    nguoiSua: '',
    trangThai: ''
  };
  this.isEditing = false;
  this.alertMessage = ''; // Reset thông báo
  this.alertType = '';
}

prevPage(): void {
  if (this.page > 0) {
    this.page--;
    this.loadKhuyenMais(); // Gọi lại để tải dữ liệu cho trang trước
  }
}

nextPage(): void {
  if (this.page < this.totalPages - 1) {
    this.page++;
    this.loadKhuyenMais(); // Gọi lại để tải dữ liệu cho trang tiếp theo
  }
}

goToPage(pageNumber: number): void {
  this.page = pageNumber;
  this.loadKhuyenMais(); // Gọi lại để tải dữ liệu cho trang đã chọn
}



removeKhuyenMaiSanPham(chiTietSanPham: any) {
  console.log('Đã vào đây để xóa khuyến mãi');
  
  this.khuyenMaiSanPhamChiTietService.XoaKmctsp(chiTietSanPham.id).subscribe(
    (response) => {
      console.log('Response xóa sản phẩm:', response);
      if (response.status) {
        this.showSwalSuccess(response.result.content);
        this.loadKhuyenMais();

      
        this.sanPhamService.getChiTietSanPhamById(chiTietSanPham.id).subscribe(
          (response: any) => {
            this.idSanPhamNe = response.result.content.sanPham.id;
            this.openChiTietModal(this.idSanPhamNe);
            console.log('ID sản phẩm tìm lại:', this.idSanPhamNe);
          }
        );
      } else {
        this.showSwalError(response.result.content);
      }
    },
    (error) => {
      console.error('Error xóa sản phẩm:', error);
      this.showSwalError('Lỗi xóa khuyến mãi cho sản phẩm, vui lòng thử lại');
    }
  );
}





private showSwalSuccess(message: string) {
  Swal.fire({
    title: 'F5 Store xin thông báo : ',
    text: message,
    icon: 'success',
    confirmButtonText: 'OK',
    customClass: {
      confirmButton: 'custom-confirm-button',
      popup: 'custom-swal-popup'
    }
    
  });
}

private showSwalError(message: string) {
  Swal.fire({
    title: 'F5 Store xin thông báo : ',
    text: message,
    icon: 'error',
    confirmButtonText: 'OK',
    customClass: {
      confirmButton: 'custom-confirm-button',
      popup: 'custom-swal-popup'
    }
  });
}


// sản phẩm 

loaddata() {
  this.getSanPhamPhanTrang(this.pageSanPham);
  this.getAllThuongHieu();
  this.getAllXuatXu();
  this.getAllGioiTinh();
  this.getAllSizes();
  this.getAllMauSac();
  this.filterChiTietSanPham();

}

isChiTietModalOpen: boolean = false;

openChiTietModal(sanPhamId: number) {

  this.isChiTietModalOpen = true; // Mở modal


  this.selectSanPhamChiTiet(sanPhamId);
  
 
}




closeChiTietModal() {
  this.isChiTietModalOpen = false;
}

viewProductDetails(idSanPham: number) {
  // 2. Lọc chi tiết sản phẩm và chọn sản phẩm theo idSanPham
  this.selectSanPhamChiTiet(idSanPham); // Gọi hàm để chọn sản phẩm chi tiết

  // 3. Mở modal với id sản phẩm đã chọn
  this.openChiTietModal(idSanPham); // Gọi hàm mở modal


  this.sanPhamService.getSanPhambyid(idSanPham).subscribe(
    response => {
        console.log('Phản hồi từ API:', response); // Kiểm tra phản hồi từ API
        if (response && response.result && response.result.content.length > 0) {
            const product = response.result.content[0]; // Lấy sản phẩm đầu tiên từ mảng
         
            this.selectedSanPhamName = product.ten; // Gán tên sản phẩm
           
            this.filterChiTietSanPham();
        } else {
            console.warn('Không có dữ liệu sản phẩm trong phản hồi');
        }
    },
    error => {
        console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
    }
);

  // 4. Lọc chi tiết sản phẩm sau khi mở modal để chỉ hiển thị sản phẩm đã chọn
  this.filterChiTietSanPham(); // Lọc chỉ chi tiết sản phẩm cần xem
}


   // Lọc chi tiết sản phẩm theo API
   filterChiTietSanPham() {
    const sanPhamId = this.selectedSanPhamId; // Lấy ID sản phẩm được chọn
    const donGia = this.selectedPrice !== null ? this.selectedPrice : undefined; // Giá được chọn
    const mauSacId = this.selectedColor ? Number(this.selectedColor) : null; // ID màu sắc được chọn, hoặc null nếu không có
    const sizeId = this.selectedSize ? Number(this.selectedSize) : null; // ID kích thước được chọn, hoặc null nếu không có
    const page = this.pageChiTiet; // Trang hiện tại
    const size = this.sizeChiTiet; // Số lượng sản phẩm trên mỗi trang
  
    // Gọi service để lọc sản phẩm
    this.sanPhamService.filterChiTietSanPham(sanPhamId, donGia, mauSacId, sizeId, page, size).subscribe(
      response => {
        if (response && response.content) {
          this.filteredChiTietSanPhamList = response.content; // Cập nhật danh sách đã lọc
          console.log('hehehhe: ', this.filteredChiTietSanPhamList);
          this.filteredChiTietSanPhamList.forEach(chiTiet => {
            console.log('checkKM: ', chiTiet.checkKm);
          });
          this.totalPagesChiTiet = response.totalPages; // Cập nhật tổng số trang
        } else {
          console.warn('Không có dữ liệu chi tiết sản phẩm nào được trả về.');
          this.filteredChiTietSanPhamList = []; // Reset danh sách nếu không có dữ liệu
        }
      },
      error => {
        console.error('Lỗi khi lọc chi tiết sản phẩm:', error);
        Swal.fire('Lỗi', 'Có lỗi xảy ra khi lọc sản phẩm!', 'error');
      }
    );
  }
  
// Thay đổi giá và gọi lại hàm lọc
updatePrice(price: number) {
  this.selectedPrice = price;
  this.filterChiTietSanPham();
}
  // Thay đổi màu sắc và gọi lại hàm lọc
  selectColor(colorId: string) {
    this.selectedColor = Number(colorId);
    this.filterChiTietSanPham();
  }

  // Thay đổi kích thước và gọi lại hàm lọc
  selectSize(sizeId: string) {
    this.selectedSize = Number(sizeId);
    this.filterChiTietSanPham();
  }



  // Hàm tải màu sắc từ API
  loadMauSac() {
    // Giả định bạn đã có hàm để lấy danh sách màu sắc
    this.sanPhamService.getAllMauSac().subscribe(data => {
      this.mauSacList = data.result.content;
    });
  }

  // Hàm tải kích thước từ API
  loadSizes() {
    // Giả định bạn đã có hàm để lấy danh sách kích thước
    this.sanPhamService.getAllSizes().subscribe(data => {
      this.sizes = data.result.content;
    });
  }


 
getAllThuongHieu() {
  this.sanPhamService.getAllThuongHieu().subscribe(response => {
    this.thuongHieuList = response.result.content;
  }, error => {
    console.error('Lỗi khi lấy danh sách thương hiệu:', error);
  });
}

getAllXuatXu() {
  this.sanPhamService.getAllXuatXu().subscribe(response => {
    this.xuatXuList = response.result.content;
  }, error => {
    console.error('Lỗi khi lấy danh sách xuất xứ:', error);
  });
}

getAllGioiTinh() {
  this.sanPhamService.getAllGioiTinh().subscribe(response => {
    this.gioiTinhList = response.result.content;
  }, error => {
    console.error('Lỗi khi lấy danh sách giới tính:', error);
  });
}


getAllSizes(): void {
  this.sanPhamService.getAllSizes().subscribe(
    (response) => {
      console.log('Danh sách kích thước:', response);
      this.sizes = response.result.content;  // Gán dữ liệu trả về từ API vào biến sizes
      console.log('Danh sách kích thước:', this.sizes);
    },
    (error) => {
      console.error('Lỗi khi lấy danh sách kích thước:', error);
    }
  );
}
getAllMauSac(): void {
  this.sanPhamService.getAllMauSac().subscribe(
    (response) => {
      this.mauSacList = response.result.content;;  // Gán dữ liệu trả về từ API vào biến mauSacList
      console.log('Danh sách màu sắc:', this.mauSacList);
    },
    (error) => {
      console.error('Lỗi khi lấy danh sách màu sắc:', error);
    }
  );
}

getSanPhamPhanTrang(page: number, thuongHieuId?: number, xuatXuId?: number, gioiTinhId?: number) {
  this.sanPhamService.filterSanPham(thuongHieuId, xuatXuId, gioiTinhId, page, this.sizeSanPham).subscribe(response => {
      console.log('Dữ liệu trả về từ API:', response); // Log dữ liệu
      // Kiểm tra xem có dữ liệu không
      if (response && response.totalPages !== undefined) {
          // Gán danh sách sản phẩm từ phản hồi
          this.sanPhamList = response.content || []; // Gán danh sách sản phẩm
          this.filteredSanPhamList = [...this.sanPhamList]; // Sao chép dữ liệu cho filtered list
          console.log('Danh sách sản phẩm:', this.filteredSanPhamList);
          this.totalPagesSanPham = response.totalPages; // Gán tổng số trang
          this.pageSanPham = response.currentPage; // Gán số trang hiện tại
      } else {
          console.warn('Không có dữ liệu sản phẩm trong phản hồi');
          this.sanPhamList = [];
          this.filteredSanPhamList = [];
      }
  }, error => {
      console.error('Lỗi khi gọi API getSanPhamPhanTrang:', error);
  });
}



changePageSanPham(newPage: number) {
if (newPage >= 0 && newPage < this.totalPagesSanPham) {
  this.pageSanPham = newPage; // Cập nhật trang hiện tại
  this.getSanPhamPhanTrang(newPage, this.selectedThuongHieu, this.selectedXuatXu, this.selectedGioiTinh);
}
}



changePageChiTiet(newPage: number) {
  // Kiểm tra nếu trang mới hợp lệ
  if (newPage >= 0 && newPage < this.totalPagesChiTiet) {
      this.pageChiTiet = newPage; // Cập nhật trang hiện tại
     this.filterChiTietSanPham();
  }
}

loading: boolean = false;

getChiTietSanPhamPhanTrang(idSanPham: number, page: number = 0) {
  // Kiểm tra tính hợp lệ của idSanPham
  if (idSanPham === undefined || idSanPham === null || isNaN(idSanPham)) {
      console.error('ID sản phẩm không hợp lệ:', idSanPham);
      return; // Dừng lại nếu idSanPham không hợp lệ
  }

  this.loading = true; // Bắt đầu loading

  // Gọi API để lấy chi tiết sản phẩm
  this.sanPhamService.getChiTietSanPhamPhanTrang(idSanPham, page, this.sizeChiTiet).subscribe(
      response => {
          this.loading = false; // Kết thúc loading
          console.log("Danh sách chi tiết sản phẩm:", response);
          if (response && response.content) {
              this.chiTietSanPhamList = response.content || [];
              this.filteredChiTietSanPhamList = [...this.chiTietSanPhamList]; // Cập nhật danh sách lọc từ danh sách chính

              // Cập nhật thông tin phân trang
              if (response.pagination) {
                  this.totalPagesChiTiet = response.pagination.totalPages || 1;
                  this.pageChiTiet = response.pagination.pageNumber || 0;             
              } else {
                  this.totalPagesChiTiet = 1;
                  this.pageChiTiet = 0;
              }
          } else {
              console.warn('Response không hợp lệ hoặc không có danh sách sản phẩm.');
              this.chiTietSanPhamList = []; // Đặt lại danh sách nếu không có dữ liệu
          }
      },
      error => {
          this.loading = false; // Kết thúc loading khi có lỗi
          console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
          Swal.fire('Lỗi', 'Có lỗi xảy ra khi lấy chi tiết sản phẩm!', 'error');
      }
  );
}
  
  
   // Hàm tìm kiếm sản phẩm
   onSearch1(searchTerm1: string) {
    if (searchTerm1 && searchTerm1.trim() !== '') {
      this.filteredSanPhamList = this.sanPhamList.filter(sanpham =>
        sanpham.ten.toLowerCase().includes(searchTerm1.toLowerCase()) ||
        sanpham.ma.toLowerCase().includes(searchTerm1.toLowerCase())
      );
    } else {
      // Nếu không có từ khóa tìm kiếm, hiển thị lại toàn bộ danh sách sản phẩm
      this.filteredSanPhamList = [...this.sanPhamList];
    }
  }


  searchChiTietSanPham() {
    const search = this.searchTerm1.toLowerCase().trim();

    if (search) {
      // Lọc dữ liệu theo từ khóa
      this.filteredChiTietSanPhamList = this.chiTietSanPhamList.filter(chiTiet =>
        chiTiet.ma.toLowerCase().includes(search) ||
        chiTiet.ten.toLowerCase().includes(search) ||
        chiTiet.mauSac.ten.toLowerCase().includes(search) ||
        chiTiet.size.ten.toLowerCase().includes(search) ||
        chiTiet.trangThai.toLowerCase().includes(search)
      );
    } else {
      // Nếu không có từ khóa, hiển thị toàn bộ dữ liệu
      this.filteredChiTietSanPhamList = [...this.chiTietSanPhamList];
    }
  }

  onSearchChiTiet(searchTerm1: string) {
    if (searchTerm1 && searchTerm1.trim() !== '') {
      this.filteredChiTietSanPhamList = this.chiTietSanPhamList.filter(chiTiet =>
        chiTiet.ma.toLowerCase().includes(searchTerm1.toLowerCase()) ||
        chiTiet.ten.toLowerCase().includes(searchTerm1.toLowerCase()) ||
        chiTiet.mauSac.ten.toLowerCase().includes(searchTerm1.toLowerCase()) ||
        chiTiet.size.ten.toLowerCase().includes(searchTerm1.toLowerCase()) ||
        chiTiet.trangThai.toLowerCase().includes(searchTerm1.toLowerCase())
      );
    } else {
      // Nếu không có từ khóa tìm kiếm, hiển thị lại toàn bộ danh sách chi tiết sản phẩm
      this.filteredChiTietSanPhamList = [...this.chiTietSanPhamList];
    }
  }


   // Hàm chọn sản phẩm chi tiết
   selectSanPhamChiTiet(idSanPham: number) {
    this.selectedSanPhamId = idSanPham;
    this.getChiTietSanPhamPhanTrang(idSanPham);
  }
  
 
  

  filterSanPham(page: number = 0) {
    this.sanPhamService.filterSanPham(this.selectedThuongHieu, this.selectedXuatXu, this.selectedGioiTinh, page, this.sizeSanPham).subscribe(
      (response) => {
        console.log('Dữ liệu sản phẩm sẽ lọc:', response);
        this.filteredSanPhamList = response.content;
        this.totalPagesSanPham = response.totalPages;
        this.pageSanPham = response.currentPage;
      },
      (error) => {
        console.error('Lỗi khi lọc sản phẩm:', error);
      }
    );
  }
  
  
  
  checkValidSelection() {
      this.isValidSelection = this.selectedSizes.length > 0 && this.selectedMauSacs.length > 0;
  }
  

  toggleSize(sizeId: number) {
    if (this.selectedSizes.includes(sizeId)) {
        this.selectedSizes = this.selectedSizes.filter(id => id !== sizeId);
    } else {
        this.selectedSizes.push(sizeId);
    }
    this.checkValidSelection();
}

toggleMauSac(mauSacId: number) {
    if (this.selectedMauSacs.includes(mauSacId)) {
        this.selectedMauSacs = this.selectedMauSacs.filter(id => id !== mauSacId);
    } else {
        this.selectedMauSacs.push(mauSacId);
    }
    this.checkValidSelection();
}


  // Hàm xử lý khi người dùng chọn hoặc bỏ chọn màu sắc
  onMauSacChange(mauSacId: number, checked: boolean) {
    const mauSacsControl = this.chiTietSanPhamForm.get('mauSacs');
    if (checked) {
      this.selectedMauSacs.push(mauSacId);
    } else {
      this.selectedMauSacs = this.selectedMauSacs.filter(id => id !== mauSacId);
    }
    mauSacsControl?.setValue(this.selectedMauSacs);
    mauSacsControl?.markAsTouched();
    this.checkValidSelection();
  }

  // Hàm xử lý khi người dùng chọn hoặc bỏ chọn kích thước
  onSizeChange(sizeId: number, checked: boolean) {
    const sizesControl = this.chiTietSanPhamForm.get('sizes');
    if (checked) {
      this.selectedSizes.push(sizeId);
    } else {
      this.selectedSizes = this.selectedSizes.filter(id => id !== sizeId);
    }
    sizesControl?.setValue(this.selectedSizes);
    sizesControl?.markAsTouched();
    this.checkValidSelection();
  }

getAttributeLabel(attributeType: string): string {
  switch (attributeType) {
    case 'mau-sac': return 'Màu sắc';
    case 'size': return 'Kích thước';
    case 'xuat-xu': return 'Xuất xứ';
    case 'thuong-hieu': return 'Thương hiệu';
    default: return 'thuộc tính';
  }
}

validateYear(value: string): void {
  const selectedDate = new Date(value);
  const year = selectedDate.getFullYear();

  if (year < 1950 || year > 2150) {
    alert('Năm phải nằm trong khoảng từ 1950 đến 2150.');
    this.currentKhuyenMai.thoiGianBatDau = ''; // Reset giá trị nếu không hợp lệ
  }
}
validateYear2(value: string): void {
  const selectedDate = new Date(value);
  const year = selectedDate.getFullYear();

  if (year < 1950 || year > 2150) {
    alert('Năm phải nằm trong khoảng từ 1950 đến 2150.');
    this.currentKhuyenMai.thoiGianKetThuc = ''; // Reset giá trị nếu không hợp lệ
  }
}


onCheckboxChange(event: Event, productId: number): void {
  const checkbox = event.target as HTMLInputElement;
  if (checkbox.checked) {
    this.selectedProductIds.push(productId);
    console.log('id các sản phẩm được chọn',this.selectedProductIds);
  } else {
    this.selectedProductIds = this.selectedProductIds.filter(id => id !== productId);
  }
}


addPromotionToProducts(promotionId: number): void {
  const promises = this.selectedProductIds.map(productId => {
    const request = {
      khuyenMai: { id: promotionId },
      chiTietSanPham: { id: productId }
    };
    console.log('dữ liệu thêm kmsp :',request);
    return this.khuyenMaiSanPhamChiTietService.createKhuyenMaiChiTietSanPham(request).toPromise();
  });


  Promise.all(promises)
    .then(() => {
      this.resetForm();
    })
    .catch((error) => {
      console.error("Lỗi khi gắn khuyến mãi vào sản phẩm:", error);
    });
}


}

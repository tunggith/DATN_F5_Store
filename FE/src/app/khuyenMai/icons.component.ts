import { Component, OnInit } from '@angular/core';
import { KhuyenMaiService } from './khuyen-mai.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
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

  convertToLocalTime(dateString: string): string {
    return moment(dateString).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm'); // Thay đổi múi giờ tùy thuộc vào địa phương
  }
  
  khuyenMais: any[] = [];
  chiTietSanPhams: any[] = [];
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

  isAddingPromotionToProduct = false;
  selectedKhuyenMai: any;
  selectedProductIds: number[] = [];
  products: any[] = [];
  trangThai: string = ''; // Biến để lưu trạng thái chọn



  constructor(
    private khuyenMaiService: KhuyenMaiService, 
    private fb: FormBuilder,
    private khuyenMaiSanPhamChiTietService: KhuyenMaiSanPhamChiTietService
  ) {}

  ngOnInit(): void {

    this.searchForm = this.fb.group({
      searchKey: [''],
      fromDate: [''],
      toDate: [''],
      trangThai: ['']
    });

      this.loadKhuyenMais();
      this.fetchChiTietSanPhams();
      this.loadSanPhamTimKiems();
      this.loadSelectionsFromLocalStorage();

      this.searchForm.valueChanges
      .pipe(debounceTime(500))
      .subscribe(values => {
        this.searchVouchers(values);
      });
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
    this.fetchKhuyenMaiChiTietSanPham(); 
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
          // Lưu trạng thái hiện tại vào localStorage trước khi cập nhật
          this.saveSelectionsToLocalStorage();
  
          // Lấy chi tiết khuyến mãi sản phẩm theo id khuyến mãi
        this.khuyenMaiSanPhamChiTietService.getByKm(khuyenMaiId).subscribe(
          (response: DataResponse<any>) => {
            if (response.status) {
            // lấy danh sách chi tiết sản phẩm có trong khuyến mãi sản phẩm
              const chiTietSanPhamList = response.result.content.content; 

              // Kiểm tra nếu chi tiết sản phẩm có tồn tại
              if (Array.isArray(chiTietSanPhamList) && chiTietSanPhamList.length > 0) {
                // gán chiTietSanPhams = chi tiết sản phẩm có trong danh sách khuyến maĩ
                this.chiTietSanPhams = chiTietSanPhamList.map(item => item.chiTietSanPham);
                console.log('Danh sách sản phẩm:', this.chiTietSanPhams);
                this.chiTietSanPhams.forEach(sanPham => {
                  sanPham.selected = false; // Bỏ tick
                });
                this.saveSelectionsToLocalStorage();
                this.fetchChiTietSanPhams();
                this.fetchKhuyenMaiChiTietSanPham();
                this.loadSelectionsFromLocalStorage();
                this.loadKhuyenMais();
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



// find chi tiết sản phẩm
fetchChiTietSanPhams() {
  this.khuyenMaiSanPhamChiTietService.getAllctsp(this.pageSp, this.sizeSp).subscribe(
    (response: any) => {
      console.log('Response:', response);
      this.chiTietSanPhams = response.content;  
      this.totalPageSp = response.totalPages;    
      this.loadSelectionsFromLocalStorage();  
    },
    (error) => console.error('Lỗi khi gọi API sản phẩm:', error)
  );
}


loadSanPhamTimKiems(): void {
  this.khuyenMaiSanPhamChiTietService.timTheoTenHoacMa(this.searchTerm,this.pageSp, this.sizeSp)
    .subscribe(response => {
      this.chiTietSanPhams = response.content;  // Gán danh sách sản phẩm
      this.totalPageSp = response.totalPages;
      this.loadSelectionsFromLocalStorage();   // Tổng số trang
    }, error => {
      console.error('Lỗi khi tải sản phẩm:', error);
    });
}
onSearch(): void {
  this.pageSp = 0;  // Reset về trang đầu tiên khi tìm kiếm mới
  this.loadSanPhamTimKiems();
}


// find sản phẩm đã được áp dụng khuyến mãi
fetchKhuyenMaiChiTietSanPham() {
  this.khuyenMaiSanPhamChiTietService.getByKm(this.currentKhuyenMai.id).subscribe(
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

 // hàm thêm, xóa khuyến mãi vào sản phẩm
onCheckboxChange(chiTietSanPham : any, event: any) {
  const isChecked = event.target.checked;
  if (!this.currentKhuyenMai || !this.currentKhuyenMai.id) {
    Swal.fire({
      title: 'F5 Store xin thông báo : ',
      text: 'Vui lòng chọn khuyến mãi',
      icon: 'error',
      confirmButtonText: 'OK',
      customClass: {
        confirmButton: 'custom-confirm-button'
      }
    });
    event.target.checked = false;
    this.saveSelectionsToLocalStorage(); 
    this.fetchChiTietSanPhams();
  }
  if (isChecked) {
    // Thêm sản phẩm vào khuyến mãi chi tiết
    const formData = {
      khuyenMai: { id: this.currentKhuyenMai.id },
      chiTietSanPham: { id: chiTietSanPham.id }
    };

    this.khuyenMaiSanPhamChiTietService.createKhuyenMaiChiTietSanPham(formData).subscribe(
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
        
          event.target.checked = true; 
          chiTietSanPham.selected = true; 
          this.saveSelectionsToLocalStorage(); 
          this.fetchChiTietSanPhams();
          this.fetchKhuyenMaiChiTietSanPham();
          this.loadKhuyenMais(); 
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
          // Nếu thêm khuyến mãi không thành công, bỏ check sản phẩm này
          chiTietSanPham.selected = false;
          event.target.checked = false;  
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
        this.saveSelectionsToLocalStorage(); // Lưu lại trạng thái sau khi có lỗi
      }
    );
  } else {
    // Xóa sản phẩm khỏi khuyến mãi chi tiết
    this.khuyenMaiSanPhamChiTietService.XoaKmctsp(chiTietSanPham.id).subscribe(
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
          this.saveSelectionsToLocalStorage();
          this.fetchChiTietSanPhams();
          this.fetchKhuyenMaiChiTietSanPham(); 
        
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
          // Nếu xóa không thành công, checkbox vẫn giữ nguyên
          event.target.checked = true;
          chiTietSanPham.selected = true;
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
        chiTietSanPham.selected = true; // Giữ trạng thái checkbox nếu có lỗi
        this.saveSelectionsToLocalStorage();
        this.fetchChiTietSanPhams();  
      }
    );
  }
}


loadSelectionsFromLocalStorage() {
  const selectedProductIds = JSON.parse(localStorage.getItem('selectedProducts')) || [];
  // Kiểm tra từng sản phẩm trên trang hiện tại
  this.chiTietSanPhams.forEach(sp => {
    sp.selected = selectedProductIds.includes(sp.id);
  });
}


// Hàm lưu trạng thái sản phẩm vào localStorage
saveSelectionsToLocalStorage() {
  // Lấy danh sách ID các sản phẩm đã chọn từ localStorage
  let allSelectedProductIds = JSON.parse(localStorage.getItem('selectedProducts')) || [];

  // Lấy danh sách ID sản phẩm đã chọn trên trang hiện tại
  const currentSelectedProductIds = this.chiTietSanPhams
    .filter(sp => sp.selected)
    .map(sp => sp.id);

  // Lọc ra những sản phẩm chưa được chọn
  const uncheckedProductIds = this.chiTietSanPhams
    .filter(sp => !sp.selected)
    .map(sp => sp.id);

  // Loại bỏ các sản phẩm bị bỏ chọn khỏi danh sách
  allSelectedProductIds = allSelectedProductIds.filter(id => !uncheckedProductIds.includes(id));

  // Gộp danh sách cũ với danh sách mới và loại bỏ các ID trùng lặp
  const updatedSelectedProductIds = [...new Set([...allSelectedProductIds, ...currentSelectedProductIds])];

  // Lưu lại danh sách đã cập nhật vào localStorage
  localStorage.setItem('selectedProducts', JSON.stringify(updatedSelectedProductIds));
}


prevPageSp(): void {
  if (this.pageSp > 0) {
    this.pageSp--;
    this.fetchChiTietSanPhams(); // Gọi lại để tải dữ liệu cho trang trước
  }
}


nextPageSp(): void {
  if (this.pageSp < this.totalPageSp - 1) {
    this.pageSp++;
    this.fetchChiTietSanPhams(); // Gọi lại để tải dữ liệu cho trang tiếp theo
  }
}

goToPageSp(pageNumber: number): void {
  console.log('Current Page:', this.pageSp);
  this.pageSp = pageNumber;
  this.fetchChiTietSanPhams();
   // Gọi lại API để tải dữ liệu
}






}

import { Component, OnInit } from '@angular/core';
import { KhuyenMaiService } from './khuyen-mai.service';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-khuyen-mai',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.css']
})
export class IconsComponent implements OnInit {
  
  khuyenMais: any[] = [];
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
    thoiGianSua: undefined,
    nguoiTao: '',
    nguoiSua: '',
    trangThai: ''
  };

  isEditing = false;
  alertMessage: string = '';
  alertType: string = ''; 
  searchTerm: string = '';
  page: number = 0; 
  size: number = 3;

  isAddingPromotionToProduct = false;
  selectedKhuyenMai: any;
  selectedProductIds: number[] = [];
  products: any[] = [];
  trangThai: string = ''; // Biến để lưu trạng thái chọn
  totalPages: 0;


  constructor(
    private khuyenMaiService: KhuyenMaiService, 
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private fb: FormBuilder 
  ) {}

  ngOnInit(): void {

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
    const { id, ...khuyenMaiData } = this.currentKhuyenMai;
    this.khuyenMaiService.create(khuyenMaiData).subscribe(
        response => {
          if(response.status){
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
        }else{
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
    this.khuyenMaiService.update(this.currentKhuyenMai).subscribe(
      (response: any) => {
        if (response.status) {
          const index = this.khuyenMais.findIndex(km => km.id === response.result.id);
          if (index !== -1) {
            this.khuyenMais[index] = response.result;
             // Cập nhật khuyến mãi
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
    this.currentKhuyenMai = { ...khuyenMai,
      thoiGianBatDau: new Date(khuyenMai.thoiGianBatDau).toISOString().substring(0, 10), // Chuyển đổi định dạng
      thoiGianKetThuc: new Date(khuyenMai.thoiGianKetThuc).toISOString().substring(0, 10) // Chuyển đổi định dạng
    };
    

    this.isEditing = true; // Đặt trạng thái chỉnh sửa thành true
}




// hàm đổi trạng thái
  capNhapKm(khuyenMaiId: number): void {
    const khuyenMai = { id: khuyenMaiId };
    this.khuyenMaiService.capnhap(khuyenMai).subscribe(
      response => {
        // Xử lý phản hồi từ API nếu cần
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
      },
      error => {
        Swal.fire({
          title: 'F5 Store xin thông báo : ',
          text: 'Đổi trạng thái thành công',
          icon: 'success',
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
    // Tìm theo ten/ma
    this.khuyenMaiService.timTheoTenHoacMa(this.page, this.size, searchKey).subscribe((response) => {
      this.khuyenMais = response.result.content;
      this.totalPages = response.result.content.totalPages;
      console.log('tim theo ten/ma : ',this.khuyenMais);
    });
  } else if (trangThai && !searchKey && !fromDate && !toDate) {
    // Tìm theo trạng thái
    this.khuyenMaiService.timTheoTrangThai(this.page, this.size, trangThai).subscribe((response) => {
      this.khuyenMais = response.result.content;
      this.totalPages = response.result.content.totalPages;
      console.log('tim theo trangthai : ',this.khuyenMais);
    });
  } else if ((fromDate || toDate) && !searchKey && !trangThai) {
    // Tìm theo ngày
    this.khuyenMaiService.timTheoNgay(this.page, this.size, fromDate, toDate).subscribe((response) => {
      this.khuyenMaiService = response.result.content;
      this.totalPages = response.result.content.totalPages;
      console.log('tim theo ngay : ',this.khuyenMais);
      
    });
} else if (searchKey && (fromDate || toDate) && !trangThai) {
    // Tìm theo tên/ma và ngày
    this.khuyenMaiService.timTheoNgay(this.page, this.size, fromDate, toDate).subscribe((response) => {
      this.khuyenMais = response.result.content.filter(voucher =>
        (voucher.ten.includes(searchKey) || voucher.ma.includes(searchKey)) 
      );
      this.totalPages = response.result.content.totalPages;
      console.log('tim theo ten va ngay : ',this.khuyenMais);
    });   
  }else if (!searchKey && (fromDate || toDate) && trangThai) {
    // Tìm theo ngày và Trạng thái
    this.khuyenMaiService.timTheoNgay(this.page, this.size, fromDate, toDate).subscribe((response) => {
      this.khuyenMais = response.result.content.filter(voucher =>
         voucher.trangThai === trangThai
      );    
      
      this.totalPages = response.result.content.totalPages;
      console.log('tim theo ngay va trang thai : ',this.khuyenMais);
    });   
  }else if (searchKey && !(fromDate || toDate) && trangThai) {
    // Tìm theo ten/ma và trạng thái
    this.khuyenMaiService.timTheoTenHoacMa(this.page, this.size, searchKey).subscribe((response) => {
      this.khuyenMais = response.result.content.filter(voucher =>
        voucher.trangThai === trangThai
      );
      this.totalPages = response.result.content.totalPages;
      console.log('tim theo ten va trangthai : ',this.khuyenMais);
    });   
  }else if (searchKey && (fromDate && !toDate) && trangThai) {
    // Tìm tất cả để trống ngày kết th
    this.khuyenMaiService.timTheoNgay(this.page, this.size, fromDate, toDate).subscribe((response) => {
      this.khuyenMais = response.result.content.filter(voucher =>
        (voucher.ten.includes(searchKey) || voucher.ma.includes(searchKey))  && voucher.trangThai === trangThai  
      );
      console.log('tim theo tat ca nhgay bat dau : ',this.khuyenMais);
      this.totalPages = response.result.content.totalPages;
    });   
  }else if (searchKey && (!fromDate && toDate) && trangThai) {
    // Tìm tất cả để trống ngày kết th
    this.khuyenMaiService.timTheoNgay(this.page, this.size, fromDate, toDate).subscribe((response) => {
      this.khuyenMais = response.result.content.filter(voucher =>
        (voucher.ten.includes(searchKey) || voucher.ma.includes(searchKey))  && voucher.trangThai === trangThai  
      );
      console.log('tim theo tat ca ngay ket thuc : ',this.khuyenMais);
      this.totalPages = response.result.content.totalPages;
    });   
  }else if (searchKey && fromDate && toDate && trangThai) {
    // Tìm tất cả để trống ngày kết th
    this.khuyenMaiService.timTheoNgay(this.page, this.size, fromDate, toDate).subscribe((response) => {
      this.khuyenMais = response.result.content.filter(voucher =>
        (voucher.ten.includes(searchKey) || voucher.ma.includes(searchKey))  && voucher.trangThai === trangThai  
      );
      console.log('tim theo tat ca full : ',this.khuyenMais);
      console.log('Search parameters:', { searchKey, fromDate, toDate, trangThai });
      this.totalPages = response.result.content.totalPages;
    });   
    
  }
  else {
    // nếu tất cả trống thì findAll
    this.loadKhuyenMais();
  }
}


onDateChange(event: Event, type: string) {
  const inputDate = (event.target as HTMLInputElement).value; // Lấy giá trị ngày
  const formattedDate = this.formatDate(inputDate); // Chuyển đổi sang định dạng yyyy/MM/dd
  if (type === 'batDau') {
    this.currentKhuyenMai.thoiGianBatDau = formattedDate;
    (document.getElementById('thoiGianBatDauDisplay') as HTMLInputElement).value = this.formatDisplayDate(inputDate);
  } else {
    this.currentKhuyenMai.thoiGianKetThuc = formattedDate;
    (document.getElementById('thoiGianKetThucDisplay') as HTMLInputElement).value = this.formatDisplayDate(inputDate);
  }
}

// Hàm chuyển đổi định dạng ngày cho hiển thị
private formatDate(date: string): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = ('0' + (d.getMonth() + 1)).slice(-2);
  const day = ('0' + d.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}

// Hàm để định dạng ngày hiển thị dd/mm/yyyy
private formatDisplayDate(date: string): string {
  const d = new Date(date);
  const day = ('0' + d.getDate()).slice(-2);
  const month = ('0' + (d.getMonth() + 1)).slice(-2);
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
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
    thoiGianBatDau: new Date(),
    thoiGianKetThuc: new Date(),
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

// chuyển hướng qua khuyến mãi sản phẩm chi tiết theo id Khuyến mãi
redirectToAddKmct(khuyenMai: any) {
  if (khuyenMai && khuyenMai.id) {
    this.khuyenMaiService.setSelectedKhuyenMaiId(khuyenMai.id); // Lưu id khuyến mãi vào service
    this.router.navigate(['/khuyen-mai-chi-tiet-san-pham', khuyenMai.id]); // Chuyển hướng
  } else {
    console.error('KhuyenMai is undefined or does not have an id.');
  }
}


}

import { Component, OnInit } from '@angular/core';
import { VoucherService } from './voucher.service';
import { debounceTime } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.scss']
})
export class VoucherComponent implements OnInit {
  vouchers: any[] = [];
  searchForm: FormGroup;
  voucherForm: FormGroup; // Thêm FormGroup cho form thêm/sửa
  page = 0;
  size = 5;
  currentVoucher: any = null;
  totalPages: number = 0;  // Để lưu voucher hiện tại đang sửa

  constructor(
    private voucherService: VoucherService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getAllVouchers();
    
    // Khởi tạo form tìm kiếm
    this.searchForm = this.fb.group({
      searchKey: [''],
      fromDate: [''],
      toDate: [''],
      trangThai: ['']
    });

    // Khởi tạo form thêm/sửa
    this.voucherForm = this.fb.group({
      ma: [''],
      ten: [''],
      giaTriVoucher: [''],
      kieuGiamGia: ['$'], // Giá trị mặc định
      giaTriGiamToiDa: [''],
      giaTriHoaDonToiThieu: [''],
      thoiGianBatDau: [''],
      thoiGianKetThuc: [''],
      moTa: [''],
      soLuong: [''],
      nguoiTao: [''],
      nguoiSua: [''],
      trangThai: ['']
    });

    // Lắng nghe sự thay đổi của tất cả các trường trong form tìm kiếm
    this.searchForm.valueChanges
      .pipe(debounceTime(500))
      .subscribe(values => {
        this.searchVouchers(values);
      });
  }

  getAllVouchers(): void {
    this.voucherService.getAll(this.page,this.size).subscribe((response: any) => {
      this.vouchers = response.result.content.content;
      this.totalPages = response.result.content.totalPages;
      console.log('total :',this.totalPages);
      console.log('Dữ liệu voucher: ', this.vouchers);
    }, (error) => {
      console.error('Lỗi khi lấy dữ liệu voucher', error);
    });
  }

  createVoucher(voucherData: any): void {
    this.voucherService.create(voucherData).subscribe((response) => {
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
      this.getAllVouchers();
      this.resetForm();
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
    }, (error) => {
      alert('Lỗi khi tạo voucher '  );
    });
  }

  createOrUpdateVoucher(): void {
    const voucherData = this.voucherForm.value;
    if (this.currentVoucher) {
      voucherData.id = this.currentVoucher.id;
      // Nếu đang sửa voucher
      this.updateVoucher(voucherData);
    } else {
      // Nếu đang thêm voucher
      this.createVoucher(voucherData);
    }
  }



  updateVoucher(voucherData: any): void {
    this.voucherService.update(voucherData).subscribe((response : any) => {
      if(response.status){
      const index = this.vouchers.findIndex(km => km.id === response.result.content.id);
      if(index !== -1){
        this.vouchers[index] == response.result.content;
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
      this.getAllVouchers();
      this.resetForm();
    }
      if(! response.status){
        Swal.fire({
          title: 'F5 Store xin thông báo : ',
          text: 'Lỗi sửa voucher, vui lòng thử lại',
          icon: 'error',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'custom-confirm-button'
          }
        });
      } 
    },(error) => {
      Swal.fire({
        title: 'F5 Store xin thông báo : ',
        text: 'Lỗi sửa voucher, vui lòng thử lại',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'custom-confirm-button'
        }
      });
    });
  }
  editVoucher(voucher: any): void {
    this.currentVoucher = voucher;
    if (voucher.trangThai === 'Đang diễn ra') {
      // Vô hiệu hóa trường ngày bắt đầu
      this.voucherForm.get('thoiGianBatDau').disable();
    } else {
      // Kích hoạt lại trường nếu trạng thái khác
      this.voucherForm.get('thoiGianBatDau').enable();
    }
    voucher.thoiGianBatDau = this.formatDate(voucher.thoiGianBatDau);
    voucher.thoiGianKetThuc = this.formatDate(voucher.thoiGianKetThuc);
    this.voucherForm.patchValue(voucher); // Tự động điền dữ liệu vào form
  }


  capNhap(VoucherId: number): void {
    console.log("Đang gọi hàm capNhap với ID:", VoucherId);
    const voucher = { id: VoucherId };
    this.voucherService.capnhap(voucher).subscribe(
      response => {
        console.log("Phản hồi từ API:", response);
        if(response.status) {
          Swal.fire({
            title: 'F5 Store xin thông báo:',
            text: response.result.content,
            icon: 'success',
            confirmButtonText: 'OK',
            customClass: {
              confirmButton: 'custom-confirm-button'
            }
          });
          this.getAllVouchers(); // Gọi lại để cập nhật danh sách
        } else {
          Swal.fire({
            title: 'F5 Store xin thông báo:',
            text: response.result.content,
            icon: 'error',
            confirmButtonText: 'OK',
            customClass: {
              confirmButton: 'custom-confirm-button'
            }
          });
          this.getAllVouchers();
        }
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
        this.getAllVouchers();
      }
    );
}

  
  resetForm(): void {
    this.voucherForm.reset({
      kieuGiamGia: ['$'] // Giá trị mặc định cho kiểu giảm giá
    });
    this.currentVoucher = null; // Đặt lại voucher hiện tại
  }

  formatDate(date: string): string {
    let d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();
  
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
  
    return [year, month, day].join('-');
  }


  searchVouchers(values: any): void {
    const { searchKey, fromDate, toDate, trangThai } = values;
    if (searchKey && !fromDate && !toDate && !trangThai) {
      // Tìm theo ten/ma
      this.voucherService.timTheoTenHoacMa(this.page, this.size, searchKey).subscribe((response) => {
        this.vouchers = response.result.content;
        this.totalPages = response.result.content.totalPages;
      });
    } else if (trangThai && !searchKey && !fromDate && !toDate) {
      // Tìm theo trạng thái
      this.voucherService.timTheoTrangThai(this.page, this.size, trangThai).subscribe((response) => {
        this.vouchers = response.result.content;
        this.totalPages = response.result.content.totalPages;
      });
    } else if ((fromDate || toDate) && !searchKey && !trangThai) {
      // Tìm theo ngày
      this.voucherService.timTheoNgay(this.page, this.size, fromDate, toDate).subscribe((response) => {
        this.vouchers = response.result.content;
        this.totalPages = response.result.content.totalPages;
        console.log('du lieu vc ngày : ', this.vouchers);
      });
} else if (searchKey && (fromDate || toDate) && !trangThai) {
      // Tìm theo tên/ma và ngày
      this.voucherService.timTheoNgay(this.page, this.size, fromDate, toDate).subscribe((response) => {
        this.vouchers = response.result.content.filter(voucher =>
          (voucher.ten.includes(searchKey) || voucher.ma.includes(searchKey)) 
        );
        this.totalPages = response.result.content.totalPages;
      });   
    }else if (!searchKey && (fromDate || toDate) && trangThai) {
      // Tìm theo ngày và Trạng thái
      this.voucherService.timTheoNgay(this.page, this.size, fromDate, toDate).subscribe((response) => {
        this.vouchers = response.result.content.filter(voucher =>
           voucher.trangThai === trangThai
        );    
        this.totalPages = response.result.content.totalPages;
      });   
    }else if (searchKey && !(fromDate || toDate) && trangThai) {
      // Tìm theo ten/ma và trạng thái
      this.voucherService.timTheoTenHoacMa(this.page, this.size, searchKey).subscribe((response) => {
        this.vouchers = response.result.content.filter(voucher =>
          voucher.trangThai === trangThai
        );
        this.totalPages = response.result.content.totalPages;
      });   
    }else if (searchKey && (fromDate || toDate) && trangThai) {
      // Tìm tất cả
      this.voucherService.timTheoNgay(this.page, this.size, fromDate, toDate).subscribe((response) => {
        this.vouchers = response.result.content.filter(voucher =>
          (voucher.ten.includes(searchKey) || voucher.ma.includes(searchKey)) && voucher.trangThai === trangThai
        );
        this.totalPages = response.result.content.totalPages;
      });   
    }else {
      // nếu tất cả trống thì findAll
      this.getAllVouchers();
    }
  }


  prevPage(): void {
    if (this.page > 0) {
      this.page--;
      this.getAllVouchers(); // Gọi lại để tải dữ liệu cho trang trước
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.getAllVouchers(); // Gọi lại để tải dữ liệu cho trang tiếp theo
    }
  }

  goToPage(pageNumber: number): void {
    this.page = pageNumber;
    this.getAllVouchers(); // Gọi lại để tải dữ liệu cho trang đã chọn
  }

}

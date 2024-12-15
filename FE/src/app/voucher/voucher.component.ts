import { Component, OnInit , ViewChild, ElementRef} from '@angular/core';
import { VoucherService } from './voucher.service';
import { debounceTime } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import * as moment from 'moment-timezone';
import { AbstractControl, ValidationErrors } from '@angular/forms';


@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.scss']
})
export class VoucherComponent implements OnInit {
 @ViewChild('myModal') myModal!: ElementRef;
  
  role:string='';
  vouchers: any[] = [];
  searchForm: FormGroup;
  voucherForm: FormGroup; // Thêm FormGroup cho form thêm/sửa
  page = 0;
  size = 5;
  currentVoucher: any = null;
  totalPages: number = 0;  // Để lưu voucher hiện tại đang sửa
  isFormVisible: boolean = false;
  isEditing = false;

  constructor(
    private voucherService: VoucherService,
    private fb: FormBuilder,
    private CommonModule: CommonModule
  ) { }

  ngOnInit(): void {
    this.role = localStorage.getItem('role');
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
      ma: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9]+$')]],
      ten: ['', Validators.required],
      kieuGiamGia: ['VND',Validators.required],
      soLuong: [0, [Validators.required, Validators.min(0)]],
      giaTriVoucher: [0, [Validators.required, Validators.min(0)]],
      giaTriGiamToiDa: [0, [Validators.required, Validators.min(0)]],
      giaTriHoaDonToiThieu: [0, [Validators.required, Validators.min(0)]],
      thoiGianBatDau: ['', [Validators.required, this.validateYear]],
      thoiGianKetThuc: ['', [Validators.required, this.validateYear]],
      trangThai:[''],
      moTa: ['']
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
        // Đóng modal
        const modalElement = this.myModal.nativeElement;
        modalElement.classList.remove('show');
        modalElement.style.display = 'none';

        // Xóa lớp `modal-backdrop` và `modal-open`
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach((backdrop) => backdrop.remove());
        document.body.classList.remove('modal-open');
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

  toggleFormVisibility() {
    this.isFormVisible = !this.isFormVisible;
  }



  createOrUpdateVoucher(): void {
    const voucherData = this.voucherForm.value;

    // Format lại ngày trước khi gửi lên API
    voucherData.thoiGianBatDau = voucherData.thoiGianBatDau;
    voucherData.thoiGianKetThuc = voucherData.thoiGianKetThuc;

    console.log('Dữ liệu từ form:', voucherData);

    // Kiểm tra xem có đang chỉnh sửa hay không
    if (this.currentVoucher) {
        voucherData.id = this.currentVoucher.id; // Lấy ID để cập nhật
        this.updateVoucher(voucherData);
    } else {
        this.createVoucher(voucherData);
    }
    
}

updateVoucher(voucherData: any): void {
    console.log('Dữ liệu sửa:', voucherData);

    this.voucherService.update(voucherData).subscribe(
        (response: any) => {
            if (response.status) {
                this.vouchers = response.result.content;

                Swal.fire({
                    title: 'F5 Store xin thông báo:',
                    text: response.result.content,
                    icon: 'success',
                    confirmButtonText: 'OK',
                    customClass: {
                        confirmButton: 'custom-confirm-button'
                    }
                });

                // Load lại danh sách voucher và reset form
                this.getAllVouchers();
                this.resetForm();
                  // Đóng modal
                const modalElement = this.myModal.nativeElement;
                modalElement.classList.remove('show');
                modalElement.style.display = 'none';

                // Xóa lớp `modal-backdrop` và `modal-open`
                const backdrops = document.querySelectorAll('.modal-backdrop');
                backdrops.forEach((backdrop) => backdrop.remove());
                document.body.classList.remove('modal-open');
            } else {
                Swal.fire({
                    title: 'F5 Store xin thông báo:',
                    text: response.result.content || 'Cập nhật thất bại!',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    customClass: {
                        confirmButton: 'custom-confirm-button'
                    }
                });
                console.log('Lỗi cập nhật:', response);
            }
        },
        (error) => {
            Swal.fire({
                title: 'F5 Store xin thông báo:',
                text: 'Lỗi sửa voucher, vui lòng thử lại',
                icon: 'error',
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'custom-confirm-button'
                }
            });
            console.log('Lỗi từ BE:', error);
        }
    );
}

editVoucher(voucher: any): void {
    this.currentVoucher = voucher;
    this.isEditing = true;
    console.log('trang thai sua : ',this.isEditing);

    // Kích hoạt lại trường nếu đã vô hiệu hóa trước đó
    this.voucherForm.get('thoiGianBatDau').enable();

    // Format lại ngày trước khi patch vào form
    voucher.thoiGianBatDau = voucher.thoiGianBatDau;
    voucher.thoiGianKetThuc = voucher.thoiGianKetThuc;

    console.log('Trước khi patch, thoiGianBatDau:', voucher.thoiGianBatDau);

    // Patch dữ liệu vào form
    this.voucherForm.patchValue({
        ...voucher
    });

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
          text: 'Lỗi khi đổi trạng thái, Vui lòng thử lại',
          icon: 'error',
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


 // tìm kiếm and lọc
searchVouchers(values: any): void {
  const { searchKey, fromDate, toDate, trangThai } = values;

  if (searchKey && !fromDate && !toDate && !trangThai) {
    // Tìm theo tên/mã
    this.voucherService.timTheoTenHoacMa(this.page, this.size, searchKey).subscribe((response) => {
      this.vouchers = response.result.content;
      this.totalPages = response.result.pagination.totalPage;
    });
  } else if (trangThai && !searchKey && !fromDate && !toDate) {
    // Tìm theo trạng thái
    this.voucherService.timTheoTrangThai(this.page, this.size, trangThai).subscribe((response) => {
      this.vouchers = response.result.content;
      this.totalPages = response.result.pagination.totalPage;
    });
  } else if ((fromDate || toDate) && !searchKey && !trangThai) {
    // Tìm theo ngày
    this.voucherService.timTheoNgay(this.page, this.size, fromDate, toDate).subscribe((response) => {
      this.vouchers = response.result.content;
      this.totalPages = response.result.pagination.totalPage;
      console.log('du lieu vc ngày : ', this.vouchers);
    });
  } else if (searchKey && (fromDate || toDate) && !trangThai) {
    // Tìm theo tên/mã và ngày
    this.voucherService.timTheoNgay(this.page, this.size, fromDate, toDate).subscribe((response) => {
      this.vouchers = response.result.content.filter(voucher =>
        (voucher.ten && voucher.ten.includes(searchKey)) || (voucher.ma && voucher.ma.includes(searchKey))
      );
      this.totalPages = response.result.pagination.totalPage;
    });
  } else if (!searchKey && (fromDate || toDate) && trangThai) {
    // Tìm theo ngày và trạng thái
    this.voucherService.timTheoNgay(this.page, this.size, fromDate, toDate).subscribe((response) => {
      this.vouchers = response.result.content.filter(voucher =>
        voucher.trangThai === trangThai
      );    
      this.totalPages = response.result.pagination.totalPage;
    });
  } else if (searchKey && !(fromDate || toDate) && trangThai) {
    // Tìm theo tên/mã và trạng thái
    this.voucherService.timTheoTenHoacMa(this.page, this.size, searchKey).subscribe((response) => {
      this.vouchers = response.result.content.filter(voucher =>
        voucher.trangThai === trangThai
      );
      this.totalPages = response.result.pagination.totalPage;
    });
  } else if (searchKey && (fromDate || toDate) && trangThai) {
    // Tìm tất cả
    this.voucherService.timTheoNgay(this.page, this.size, fromDate, toDate).subscribe((response) => {
      this.vouchers = response.result.content.filter(voucher =>
        (voucher.ten && voucher.ten.includes(searchKey)) || (voucher.ma && voucher.ma.includes(searchKey)) && voucher.trangThai === trangThai
      );
      this.totalPages = response.result.pagination.totalPage;
    });
  } else {
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

  validateYear(control: AbstractControl): ValidationErrors | null {
    const selectedDate = new Date(control.value);
    const selectedYear = selectedDate.getFullYear();
  
    if (selectedYear < 1950) {
      return { yearTooSmall: true }; // Trả về lỗi nếu năm nhỏ hơn 1950
    } 
    if(selectedYear > 2150){
      return { yearTooSmall: true }; // Trả về lỗi nếu năm nhỏ hơn 1950
    }
    return null; // Không có lỗi
  }

  close(){
    this.isEditing = false;
    this.resetForm();
  }

}

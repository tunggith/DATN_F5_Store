import { response } from 'express';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CustomerService } from './KhachHang.service';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { GiaoHangNhanhService } from 'app/giao-hang-nhanh.service';

declare var $: any;
import Swal from 'sweetalert2';

@Component({
  selector: 'app-notifications',
  templateUrl: './KhachHang.component.html',
  styleUrls: ['./KhachHang.component.css'],
  providers: [DatePipe] // Thêm DatePipe vào providers

})
export class KhachHangComponent implements OnInit {
  
  khachHangForm: FormGroup;
  validationErrors: any = {};  // Lưu lỗi từ backend
  //Khách hàng
  customers: any[] = [];
  addresses = [];
  searchKeyword: string = '';
  popup: boolean = false;
  idKhachHang: number = 0;

  newKhachHang: any = {
    gioiTinh: '0',
    trangThai: 'Đang hoạt động',
    anh: '',
  };
  updateKhachHangData: any = {
    gioiTinh: '0',
    trangThai: 'Đang hoạt động',
    anh: '',
  };
  isUpdating: boolean = false; // Biến để xác định hành động
  isAdding: boolean = true; // Biến để xác định hành động thêm


  // Phân trang
  totalElements: number = 0;
  size: number = 10; // Cấu hình số lượng nhân viên mỗi trang
  currentPage: number = 0; // Trang hiện tại
  totalPages: number = 0; // Tổng số trang

  constructor(private customerService: CustomerService, private datePipe: DatePipe, private fb: FormBuilder) { 
    this.khachHangForm = this.fb.group({
      ma:[''],
      ten: ['', [Validators.required,  Validators.minLength(3),
        Validators.maxLength(25), Validators.pattern('^[a-zA-ZÀ-ỹà-ỹ\\s]+$')]],
      ngayThangNamSinh: ['', [Validators.required, this.validateAge]],
      sdt: ['', [Validators.required, Validators.pattern('^[0-9]{10,11}$')]],
      username: [''],
      password: [''],
      email: ['', [Validators.required, Validators.email]],
      anh: [''],
      gioiTinh: ['1'],
      trangThai: ['Đang hoạt động'],
    });
  }
  ngOnInit() {
    this.loadKhachHang(this.currentPage);
  }
  openPopup(idKhachHang: number) {
    this.idKhachHang = idKhachHang;
    this.popup = true;
  }
  closePopup() {
    this.popup = false;
  }
  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages) {
      return; // Kiểm tra nếu trang không hợp lệ
    }
    this.currentPage = page;
    // this.searchKhachHang();
    this.loadKhachHang(this.currentPage);
  }
  loadKhachHang(page: number): void {
    this.customerService.getAllKh(this.currentPage, this.size).subscribe(
      (response: any) => {
        if (response.status) {
          this.customers = response.result.content.content; // Lấy dữ liệu khách hàng từ API
          this.totalPages = response.result.content.totalPages; // Cập nhật tổng số trang
          console.log('Dữ liệu khách hàng:', response);
        }
      },
      (error) => {
        console.error('Lỗi khi gọi API khách hàng:', error);
      }
    );
  }
  updateTrangThai(id: number) {
    this.customerService.updateTrangThai(id).subscribe(
      response => {
        this.loadKhachHang(this.currentPage);
      }
    )
  }
  // Phương thức để định dạng ngày sinh
  formatDate(dateString: string): string {
    const date = new Date(dateString); // Chuyển đổi chuỗi ngày thành đối tượng Date
    return this.datePipe.transform(date, 'yyyy-MM-dd') || ''; // Định dạng lại ngày
  }
  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const reader = new FileReader();
  
      reader.onload = (e: any) => {
        // Cập nhật giá trị ảnh vào form
        this.khachHangForm.patchValue({
          anh: e.target.result
        });
        // Đồng thời cập nhật vào newKhachHang
        this.newKhachHang.anh = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page; // Cập nhật trang hiện tại
      this.loadKhachHang(this.currentPage); // Tải lại danh sách khách hàng
      this.searchKhachHang();
    }
  }

createKhachHang() {
  if (this.khachHangForm.valid) {
      this.newKhachHang = { ...this.khachHangForm.getRawValue() }; // Lưu dữ liệu vào newNhanVien
      this.customerService.addKhachHang(this.newKhachHang).subscribe({
          next: (response) => {
              if (response && response.status && response.result) {
                  console.log('Khách hàng đã được thêm thành công', response);
                  this.loadKhachHang(this.currentPage);

                  Swal.fire({
                      title: 'Thành công!',
                      text: 'Khách hàng đã được thêm thành công.',
                      icon: 'success',
                      confirmButtonText: 'OK'
                  });

                  // Đặt lại các trường trạng thái, giới tính
                  this.resetForm();
              } else {
                  // Nếu phản hồi không thành công, hiển thị thông báo lỗi từ backend
                  let errorMessage = 'Số điện thoại hoặc email đã tồn tại. Vui lòng nhập lại thông tin!';
                  if (response.result && response.result.message) {
                      errorMessage = response.result.message; // lấy thông báo lỗi từ backend
                  }

                  Swal.fire({
                      title: 'Lỗi!',
                      text: errorMessage,
                      icon: 'warning',
                      confirmButtonText: 'OK'
                  });
              }
          },
          error: (errors) => {
              if (errors.status === 400 && errors.error) {
                  this.validationErrors = errors.error;

                  Swal.fire({
                      title: 'Lỗi!',
                      text: errors.error.message || 'Vui lòng kiểm tra lại thông tin bạn đã nhập.',
                      icon: 'warning',
                      confirmButtonText: 'OK'
                  });
              } else {
                  Swal.fire({
                      title: 'Lỗi!',
                      text: 'Có lỗi xảy ra trong quá trình thêm khách hàng.',
                      icon: 'error',
                      confirmButtonText: 'OK'
                  });
              }
          }
      });
  } else {
      Swal.fire({
          title: 'Lỗi!',
          text: 'Vui lòng điền đầy đủ các trường bắt buộc.',
          icon: 'warning',
          confirmButtonText: 'OK'
      });
  }
}

  updateKhachHang(id: number): void {
    if (this.khachHangForm.valid) {
      this.updateKhachHang = { ...this.khachHangForm.getRawValue() }; // Lấy tất cả dữ liệu từ form

      this.customerService.updateKhachHang(id, this.updateKhachHang).subscribe({
          next: (response) => {
              if (response && response.status) {
                  Swal.fire({
                      title: 'Thành công!',
                      text: 'Khách hàng đã được cập nhật thành công.',
                      icon: 'success',
                      confirmButtonText: 'OK'
                  });
                  this.loadKhachHang(this.currentPage);
                  this.khachHangForm.reset();

                  // Đặt lại các trường trạng thái, giới tính
                  this.resetForm();
              } else {
                  let errorMessage = 'Có lỗi xảy ra khi cập nhật. Vui lòng thử lại.';
                  if (response.result && response.result.message) {
                      errorMessage = response.result.message; // lấy thông báo lỗi từ backend
                  }

                  Swal.fire({
                      title: 'Lỗi!',
                      text: errorMessage,
                      icon: 'warning',
                      confirmButtonText: 'OK'
                  });
              }
          },
          error: (errors) => {
              if (errors.status === 400 && errors.error) {
                  this.validationErrors = errors.error;

                  // Kiểm tra nếu backend trả về thông báo lỗi chi tiết
                  let errorText = 'Vui lòng kiểm tra lại thông tin bạn đã nhập.';
                  if (errors.error.message) {
                      errorText = errors.error.message;
                  }

                  Swal.fire({
                      title: 'Lỗi!',
                      text: errorText,
                      icon: 'warning',
                      confirmButtonText: 'OK'
                  });
              } else {
                  Swal.fire({
                      title: 'Lỗi!',
                      text: 'Có lỗi xảy ra trong quá trình cập nhật khách hàng.',
                      icon: 'error',
                      confirmButtonText: 'OK'
                  });
              }
          }
      });
  } else {
      Swal.fire({
          title: 'Lỗi!',
          text: 'Vui lòng điền đầy đủ các trường bắt buộc.',
          icon: 'warning',
          confirmButtonText: 'OK'
      });
  }
  // Kích hoạt lại trường mã để có thể nhập liệu khi thêm mới
  this.khachHangForm.get('ma')?.enable(); // Bật lại trường mã
  }

   // Kiểm tra ngày sinh >= 18 tuổi
  validateAge(control: AbstractControl): { [key: string]: any } | null {
    const dateOfBirth = new Date(control.value);
    const today = new Date();

    // Kiểm tra nếu ngày sinh không hợp lệ
    if (!dateOfBirth.getTime()) {
        return null;
    }

    // Tính tuổi
    let age = today.getFullYear() - dateOfBirth.getFullYear();

    // Điều chỉnh tuổi nếu ngày sinh chưa đến trong năm nay
    const birthMonth = dateOfBirth.getMonth();
    const birthDay = dateOfBirth.getDate();
    if (today.getMonth() < birthMonth ||
        (today.getMonth() === birthMonth && today.getDate() < birthDay)) {
        age--;
    }

    // Kiểm tra các điều kiện tuổi
    if (age < 18) {
        return { 'ageInvalid': true }; // Tuổi dưới 18
    }
    if (age >= 100) {
        return { 'ageTooHigh': true }; // Tuổi trên hoặc bằng 100
    }

    return null; // Tuổi hợp lệ
}



  // Hàm kiểm tra định dạng email
  validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  showDetail(khachHang: any) {
    this.newKhachHang = { ...khachHang }; // Sao chép thông tin của nhân viên vào newNhanVien
    this.newKhachHang.ngayThangNamSinh = this.formatDate(khachHang.ngayThangNamSinh); // Định dạng lại ngày sinh
    this.updateKhachHangData.id = khachHang.id; // Lưu ID của nhân viên cần cập nhật
    this.isUpdating = true; // Đặt biến là true khi đang cập nhật
    this.isAdding = false; // Đặt lại trạng thái về thêm
    this.khachHangForm.patchValue(this.newKhachHang);

        // Vô hiệu hóa trường mã khi cập nhật
        this.khachHangForm.get('ma')?.disable();
  }

  ///////////////////////////////////////////////////////////////////////////////////
  resetForm(): void {
    this.newKhachHang = {
      id: 0,
      ma: '',
      ten: '',
      gioiTinh: '0',
      ngayThangNamSinh: '',
      email: '',
      sdt: '',
      roles :'',
      anh: '',
      trangThai: 'Đang hoạt động',
    };
    this.isAdding = true; // Đặt lại trạng thái về thêm
    this.isUpdating = false; // Đặt lại trạng thái sau khi reset form
  }

  toggleStatus(id: number): void {
    const khachHang = this.customers.find(nv => nv.id === id);
    if (khachHang) {
      // Đổi trạng thái
      khachHang.trangThai = khachHang.trangThai === 'Đang hoạt động' ? 'Không hoạt động' : 'Đang hoạt động';

      // Gọi API để cập nhật trạng thái
      this.customerService.updateKhachHang(khachHang.id, khachHang).subscribe(response => {
        // Xử lý phản hồi từ API
        console.log('Cập nhật trạng thái thành công:', response);
      }, error => {
        console.error('Có lỗi khi cập nhật trạng thái:', error);
      });
    }
  }
  // //////////////////////////////////////////////////////////////////////////////////////////


  searchKhachHang(): void {
    // Nếu không có từ khóa tìm kiếm, tải lại danh sách khách hàng
    if (!this.searchKeyword || this.searchKeyword.trim() === '') {
      this.loadKhachHang(this.currentPage);
      return;
    }

    // Tìm kiếm khách hàng với từ khóa và phân trang
    this.customerService.searchKhachHang(this.currentPage, this.size, this.searchKeyword.trim()).subscribe((response) => {
      if (response.status) {
        this.customers = response.result.content.content; // Cập nhật danh sách khách hàng
        this.totalPages = response.result.content.totalPages; // Cập nhật tổng số trang
        console.log('Kết quả tìm kiếm:', response);
      } else {
        this.customers = []; // Nếu không có kết quả, set danh sách khách hàng rỗng
        this.totalPages = 0; // Reset tổng số trang
      }
    }, (error) => {
      console.error('Lỗi khi tìm kiếm khách hàng:', error);
    });
  }

  protected readonly document = document;
}
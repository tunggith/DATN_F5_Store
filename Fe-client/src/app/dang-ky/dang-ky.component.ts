import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DangNhapService } from '../dang-nhap/dang-nhap.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'app-dang-ky',
  templateUrl: './dang-ky.component.html',
  styleUrls: ['./dang-ky.component.css']
})
export class DangKyComponent implements OnInit {
  @Output() closePopup = new EventEmitter<void>();
  khachHangNew: any = {
    anh: '',
    hoTen: '',
    email: '',
    gioiTinh: 0,
    ngayThangNamSinh: '',
    sdt: ''
  }
  validationErrors: any = {};
  khachHangForm: FormGroup;
  constructor(private dangNhapService: DangNhapService, private router: Router, private datePipe: DatePipe, private fb: FormBuilder) {
    this.khachHangForm = this.fb.group({
      anh: [''],
      hoTen: ['', [Validators.required, Validators.pattern('^[a-zA-ZÀ-ỹà-ỹ\\s]+$')]],
      email: ['', [Validators.required, Validators.email]],
      gioiTinh: ['0'],
      ngayThangNamSinh: ['', [Validators.required, this.validateAge]],
      sdt: ['', [Validators.required, Validators.pattern('^[0-9]{10,11}$')]],
    })
  }
  ngOnInit(): void { }
  markAsTouched(controlName: string): void {
    const control = this.khachHangForm.get(controlName);
    if (control && !control.touched) {
      control.markAsTouched();
    }
  }
  close() {
    this.closePopup.emit();
  }
  addKhachHang(): void {
    // Kiểm tra xem form có hợp lệ không
    if (this.khachHangForm.invalid) {
      // Log ra thông tin chi tiết của các lỗi trong form
      console.log('Form không hợp lệ:', this.khachHangForm);

      // Log các lỗi cụ thể của từng trường trong form
      Object.keys(this.khachHangForm.controls).forEach(controlName => {
        const control = this.khachHangForm.get(controlName);
        if (control?.invalid) {
          console.log(`Lỗi ở trường ${controlName}:`, control.errors); // In ra lỗi của trường không hợp lệ
        }
      });

      this.khachHangForm.markAllAsTouched();
      this.showWarningMessage('Vui lòng điền đầy đủ và chính xác các thông tin.');
      return;
    }
    // Đồng bộ dữ liệu từ form vào đối tượng khachHangNew
    this.khachHangNew.hoTen = this.khachHangForm.get('hoTen')?.value;
    this.khachHangNew.email = this.khachHangForm.get('email')?.value;
    this.khachHangNew.gioiTinh = this.khachHangForm.get('gioiTinh')?.value;
    this.khachHangNew.ngayThangNamSinh = this.khachHangForm.get('ngayThangNamSinh')?.value;
    this.khachHangNew.sdt = this.khachHangForm.get('sdt')?.value;
    const khachHang = {
      anh: this.khachHangNew.anh,
      ten: this.khachHangNew.hoTen,
      email: this.khachHangNew.email,
      gioiTinh: this.khachHangNew.gioiTinh,
      ngayThangNamSinh: this.khachHangNew.ngayThangNamSinh,
      sdt: this.khachHangNew.sdt
    }
    console.log(khachHang);
    // Gửi dữ liệu đến dịch vụ để đăng ký
    this.dangNhapService.dangKy(khachHang).subscribe({
      next: () => {
        this.showSuccessMessage('Đăng ký thành công!');
        this.close();
      },
      error: (errors) => {
        this.validationErrors = errors.error;
        this.handleError(errors);
      }
    });
  }
  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.khachHangNew.anh = e.target.result; // Lưu URL ảnh vào đối tượng nhân viên
      };
      reader.readAsDataURL(file); // Đọc file và tạo URL
    }
  }
  // Phương thức để định dạng ngày sinh
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }

  validateAge(control: AbstractControl): { [key: string]: any } | null {
    const dateOfBirth = new Date(control.value);
    const today = new Date();

    // Kiểm tra nếu ngày sinh không hợp lệ
    if (!dateOfBirth.getTime()) {
      return null; // Nếu không hợp lệ, bỏ qua
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
    if (age <= 3) {
      return { 'ageTooYoung': true }; // Tuổi nhỏ hơn hoặc bằng 3
    }
    if (age >= 100) {
      return { 'ageTooHigh': true }; // Tuổi lớn hơn hoặc bằng 100
    }

    return null; // Tuổi hợp lệ
  }

  // Validator tùy chỉnh để kiểm tra email có phải là @fpt.edu.vn
  fptEmailValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }
    // Kiểm tra email có hợp lệ và kết thúc bằng @fpt.edu.vn
    const emailPattern = /^[a-zA-Z0-9._%+-]+@fpt\.edu\.vn$/;
    if (emailPattern.test(value)) {
      return null;  // Email hợp lệ
    } else {
      return { fptEmail: true };  // Nếu không đúng, trả về lỗi
    }
  }
  protected readonly document = document;
  // =================== Thông báo ===================

  showSuccessMessage(message: string) {
    Swal.fire({
      icon: 'success',
      title: 'Thành công!',
      text: message,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });
  }

  showErrorMessage(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Thất bại!',
      text: message,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });
  }

  showWarningMessage(message: string) {
    Swal.fire({
      icon: 'warning',
      title: 'Cảnh báo!',
      text: message,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });
  }
  // ================= Xử lý lỗi =================
  private handleError(error: any): void {
    let errorMessage = 'Có lỗi xảy ra';
    if (error.error instanceof ErrorEvent) {
      // Lỗi từ phía client
      errorMessage = `Lỗi: ${error.error.message}`;
    } else {
      // Lỗi từ phía server
      errorMessage = `${error.error}`;
    }
    this.showErrorMessage(errorMessage);
  }
}

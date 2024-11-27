import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DangNhapService } from '../dang-nhap/dang-nhap.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-doi-mat-khau',
  templateUrl: './doi-mat-khau.component.html',
  styleUrls: ['./doi-mat-khau.component.css']
})
export class DoiMatKhauComponent implements OnInit{
  @Output() closePopup = new EventEmitter<void>();
  passwordOld: string = '';
  passwordNew: string = '';
  passwordConfirm: string = '';
  errorMessages: any = {};

  constructor(private dangNhapService: DangNhapService) {}
  ngOnInit(): void {}

  onInputChange(field: 'passwordOld' | 'passwordNew' | 'passwordConfirm', event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this[field] = value; // Giờ TypeScript sẽ hiểu đây là các thuộc tính hợp lệ.
    this.validateField(field);
  }
  

  validateField(field: string): void {
    if (field === 'passwordOld' && this.passwordOld=='') {
      this.errorMessages.passwordOld = 'Mật khẩu cũ không được để trống.';
    }else if (field === 'passwordNew' && this.passwordNew =='') {
      this.errorMessages.passwordNew = 'Mật khẩu mới không được để trống.';
    } else if (field === 'passwordNew' && this.passwordNew.length < 7) {
      this.errorMessages.passwordNew = 'Mật khẩu mới phải lớn hơn 7 ký tự.';
    } else if (field === 'passwordConfirm' && this.passwordConfirm !== this.passwordNew) {
      this.errorMessages.passwordConfirm = 'Mật khẩu xác nhận không khớp.';
    } else {
      this.errorMessages[field] = null;
    }
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    // Kiểm tra toàn bộ form
    this.validateField('passwordOld');
    this.validateField('passwordNew');
    this.validateField('passwordConfirm');

    if (Object.values(this.errorMessages).every((msg) => !msg)) {
      this.doiMatKhau();
    }
  }
  close() {
    this.closePopup.emit();
  }
  doiMatKhau():void{
    const id = localStorage.getItem('id');
    this.dangNhapService.doiMatKhau(id||'',this.passwordOld,this.passwordNew).subscribe(
      response=>{
        this.showSuccessMessage('Đổi mật khẩu thành công!');
        this.close();
      },
      error=>{
        this.handleError(error);
      }
    )
  }
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

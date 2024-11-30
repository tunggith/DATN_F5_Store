import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { BanHangService } from 'app/ban-hang.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-popup',
  templateUrl: './customer-popup.component.html',
  styleUrls: ['./customer-popup.component.scss']
})
export class CustomerPopupComponent implements OnInit {
  @Output() closePopup = new EventEmitter<void>();
  @Output() customerSelected = new EventEmitter<any>();
  khachHang: any[] = [{
    gioiTinh: '0', 
  }];
  filteredCustomers: any[] = [];
  search: string = '';
  selectedCustomerId: number | null = null;
  customerForm: FormGroup;
  validationErrors: any = {};
  isSubmitting: boolean = false;

  constructor(
    private banHangService: BanHangService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  validateAge(control: AbstractControl): { [key: string]: any } | null {
    const dateOfBirth = new Date(control.value);
    const today = new Date();

    if (!dateOfBirth.getTime()) {
      return null;
    }

    let age = today.getFullYear() - dateOfBirth.getFullYear();

    const birthMonth = dateOfBirth.getMonth();
    const birthDay = dateOfBirth.getDate();
    if (today.getMonth() < birthMonth ||
        (today.getMonth() === birthMonth && today.getDate() < birthDay)) {
      age--;
    }

    if (age < 18) {
      return { 'ageInvalid': true };
    }
    if (age >= 100) {
      return { 'ageTooHigh': true };
    }

    return null;
  }

  initForm() {
    this.customerForm = this.formBuilder.group({
      ten: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(25),
        Validators.pattern(/^[a-zA-ZÀ-ỹ\s]*$/)
      ]],
      gioiTinh: ['Nam', Validators.required],
      ngayThangNamSinh: ['', [Validators.required, this.validateAge.bind(this)]], 
      email: ['', [Validators.required, Validators.email]],
      sdt: ['', [
        Validators.required,
        Validators.pattern(/^(0|84)(2(0[3-9]|1[0-6|8|9]|2[0-2|5-9]|3[2-9]|4[0-9]|5[1|2|4-9]|6[0-3|9]|7[0-7]|8[0-9]|9[0-4|6|7|9])|3[2-9]|5[5|6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])([0-9]{7})$/)
      ]]
    });
  }

  close() {
    this.closePopup.emit();
  }

  addCustomer(): void {
    if (this.isSubmitting) return;

    if (this.customerForm.valid) {
      this.isSubmitting = true;

      const khachHang = {
        ...this.customerForm.value,
        gioiTinh: parseInt(this.customerForm.value.gioiTinh, 10)
      };

      // Hiển thị loading ngay lập tức
      Swal.fire({
        title: 'Đang xử lý...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      this.banHangService.addKhachHang(khachHang).subscribe(
        (response) => {
          this.isSubmitting = false;
          Swal.fire({
            title: 'Thành công!',
            text: 'Thêm khách hàng thành công!',
            icon: 'success',
            confirmButtonText: 'OK',
            timer: 1500
          });
          const addedCustomerId = response.id;
          this.customerSelected.emit(addedCustomerId);
          this.close();
        },
        (error) => {
          this.isSubmitting = false;
          console.error('Lỗi khi thêm khách hàng', error);
          if (error.error.errors) {
            this.validationErrors = error.error.errors;
            Swal.fire({
              title: 'Lỗi!',
              text: 'Có lỗi xảy ra khi thêm khách hàng. Vui lòng kiểm tra lại thông tin.',
              icon: 'error',
              confirmButtonText: 'OK',
              timer: 1500
            });
          }
        }
      );
    } else {
      Object.keys(this.customerForm.controls).forEach(key => {
        const control = this.customerForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      
      Swal.fire({
        title: 'Lỗi!',
        text: 'Vui lòng điền đầy đủ thông tin và đúng định dạng.',
        icon: 'warning',
        confirmButtonText: 'OK',
        timer: 1500
      });
    }
  }
}

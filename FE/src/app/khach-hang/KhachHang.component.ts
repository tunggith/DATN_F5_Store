import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CustomerService } from './KhachHang.service';
import { DatePipe } from '@angular/common';

declare var $: any;
import Swal from 'sweetalert2';

@Component({
  selector: 'app-notifications',
  templateUrl: './KhachHang.component.html',
  styleUrls: ['./KhachHang.component.css'],
  providers: [DatePipe] // Thêm DatePipe vào providers

})
export class KhachHangComponent implements OnInit {
  //Khách hàng
  customers: any[] = [];
  addresses = [];
  searchKeyword: string = '';
  popup: boolean = false;
  idKhachHang: number = 0;

  newKhachHang: any = {
    gioiTinh: '1',
    trangThai: 'Đang hoạt động',
    anh: '',
  };
  updateKhachHangData: any = {
    gioiTinh: '1',
    trangThai: 'Đang hoạt động',
  };

  // Phân trang
  totalElements: number = 0;
  size: number = 10; // Cấu hình số lượng nhân viên mỗi trang
  currentPage: number = 0; // Trang hiện tại
  totalPages: number = 0; // Tổng số trang

  constructor(private customerService: CustomerService, private datePipe: DatePipe) { }
  ngOnInit() {
    this.loadKhachHang(this.currentPage);
  }
  openPopup(idKhachHang:number) {
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
  updateTrangThai(id:number){
    this.customerService.updateTrangThai(id).subscribe(
      response=>{
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
        this.newKhachHang.anh = e.target.result; // Lưu URL ảnh vào đối tượng nhân viên
      };
      reader.readAsDataURL(file); // Đọc file và tạo URL
    }
  }
  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page; // Cập nhật trang hiện tại
      this.loadKhachHang(this.currentPage); // Tải lại danh sách khách hàng
      this.searchKhachHang();
    }
  }
  createKhachHang(): void {
    if (!this.validateKhachHang(this.newKhachHang)) {
      return; // Ngừng lại nếu dữ liệu không hợp lệ
    }

    this.customerService.addKhachHang(this.newKhachHang).subscribe(
      (response) => {
        this.newKhachHang = {};
        Swal.fire({
          title: 'Thành công!',
          text: ' Khách hàng đã được thêm thành công.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.loadKhachHang(this.currentPage);
      },
      (error) => {
        Swal.fire({
          title: 'Lỗi!',
          text: 'Có lỗi xảy ra trong quá trình thêm mới khách hàng.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    );
  }

  updateKhachHang(id: number): void {
    if (!this.validateKhachHang(this.newKhachHang)) {
      return; // Ngừng lại nếu dữ liệu không hợp lệ
    }

    this.customerService.updateKhachHang(id, this.newKhachHang).subscribe(() => {
      Swal.fire({
        title: 'Thành công!',
        text: 'Khách hàng đã được cập nhật thành công.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      this.loadKhachHang(this.currentPage);
      this.updateKhachHangData = {};
    }, error => {
      Swal.fire({
        title: 'Lỗi!',
        text: 'Có lỗi xảy ra trong quá trình cập nhật khách hàng.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      console.log('Có lỗi trong quá trình cập nhật', error);
    });
  }

  // Hàm kiểm tra hợp lệ
  validateKhachHang(khachHang: any): boolean {
    // Kiểm tra trống
    if (!khachHang.ten || khachHang.ten.length < 3) {
      Swal.fire('Lỗi!', 'Tên khách hàng phải ít nhất 3 ký tự.', 'error');
      return false;
    }
    if (!khachHang.ngayThangNamSinh) {
      Swal.fire('Lỗi!', 'Ngày sinh không được để trống.', 'error');
      return false;
    }
    const ngaySinh = new Date(khachHang.ngayThangNamSinh);
    const ngayHienTai = new Date(); // Lấy ngày hiện tại
    if (ngaySinh > ngayHienTai) {
      Swal.fire('Lỗi!', 'Ngày sinh không được vượt quá ngày hiện tại.', 'error');
      return false;
    }
    if (!khachHang.email || !this.validateEmail(khachHang.email)) {
      Swal.fire('Lỗi!', 'Email không hợp lệ.', 'error');
      return false;
    }
    if (!khachHang.sdt || khachHang.sdt.length < 10 || khachHang.sdt.length > 11) {
      Swal.fire('Lỗi!', 'Số điện thoại phải từ 10 đến 11 ký tự.', 'error');
      return false;
    }
    if (!khachHang.userName) {
      Swal.fire('Lỗi!', 'Tên người dùng không được để trống.', 'error');
      return false;
    }
    if (!khachHang.password || khachHang.password.length < 6) {
      Swal.fire('Lỗi!', 'Mật khẩu phải ít nhất 6 ký tự.', 'error');
      return false;
    }

    return true; // Tất cả các kiểm tra đều hợp lệ
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
  }

  ///////////////////////////////////////////////////////////////////////////////////
  resetForm(): void {
    this.newKhachHang = {
      id: 0,
      ma: '',
      ten: '',
      gioiTinh: '',
      namSinh: '',
      email: '',
      sdt: '',
      anh: '',
      userName: '',
      password: '',
      trangThai: '',
      diaChiKhachHangId: null,
    };
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

}

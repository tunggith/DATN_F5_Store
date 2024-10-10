import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Import Router
import { DiaChiKhachHangService } from './dia-chi-khach-hang.service';
import Swal from 'sweetalert2';
import { error, log } from 'console';



@Component({
  selector: 'app-dia-chi-khach-hang',
  templateUrl: './dia-chi-khach-hang.component.html',
  styleUrls: ['./dia-chi-khach-hang.component.css']
})
export class DiaChiKhachHangComponent implements OnInit {
  //Địa chỉ khách hàng
  customersDiaChi: any[] = [];
  newDiaChiKhachHang: any = {
    loaiDiaChi: 'Nhà riêng',
    trangThai: 'Còn sử dụng',
  }
  updateDiaChiKhachHangData: any = {
    loaiDiaChi: 'Nhà riêng',
    trangThai: 'Còn sử dụng',
  }

  // Phân trang
  totalElements: number = 0;
  size: number = 10; // Cấu hình số lượng nhân viên mỗi trang
  currentPage: number = 0; // Trang hiện tại
  totalPages: number = 0; // Tổng số trang
  constructor(private diaChiKhachHangService: DiaChiKhachHangService,
    private router: Router // Inject Router

  ) { }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages) {
      return; // Kiểm tra nếu trang không hợp lệ
    }
    this.currentPage = page;
    // this.searchKhachHang();
    this.loadDiaChi(this.currentPage);
  }

  ngOnInit(): void {
    this.loadDiaChi(this.currentPage);
  }

  loadDiaChi(page: number): void {
    this.diaChiKhachHangService.getAllAddresses(this.currentPage, this.size).subscribe(
      (response: any) => {
        if (response.status) {
          this.customersDiaChi = response.result.content.content; // Lấy dữ liệu địa chỉ từ API
          this.totalPages = response.result.content.totalPages; // Cập nhật tổng số trang
          console.log('Dữ liệu địa chỉ:', response);
        }
      },
      (error) => {
        console.error('Lỗi khi gọi API địa chỉ:', error);
      }
    );
  }


  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page; // Cập nhật trang hiện tại
      this.loadDiaChi(this.currentPage);
    }
  }

  // Xem chi tiết địa chỉ khách 
  showDetailDiaChi(diaChiKhachHang: any) {
    this.newDiaChiKhachHang = { ...diaChiKhachHang }; // Sao chép thông tin của nhân viên vào newNhanVien
    this.updateDiaChiKhachHangData.id = diaChiKhachHang.id; // Lưu ID của nhân viên cần cập nhật
  }
  createDiaChiKhachHang(): void {
    console.log(this.newDiaChiKhachHang);

    if (!this.validateDiaChiKhachHang(this.newDiaChiKhachHang)) {
      return; // Ngừng lại nếu dữ liệu không hợp lệ
    }

    this.diaChiKhachHangService.addDiaChiKhachHang(this.newDiaChiKhachHang).subscribe(
      (response) => {
        console.log(response);
        if (response.status) { // Kiểm tra trạng thái HTTP
          console.log(response.status);

          Swal.fire({
            title: 'Thành công!',
            text: ' Địa chỉ khách hàng đã được thêm thành công.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.loadDiaChi(this.currentPage);
        } else {
          Swal.fire({
            title: 'Thất bại!',
            text: 'Có lỗi xảy ra trong quá trình thêm mới địa chỉ khách hàng.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      },
      (success) => {
        // console.error('Lỗi khi gọi API địa chỉ:', error);
        Swal.fire({
          title: 'Thành công!',
          text: 'Thêm địa chỉ khách hàng thành công!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.loadDiaChi(this.currentPage);
      }
    );
  }

  updateDiaChiKhachHang(id: number): void {
    if (!this.validateDiaChiKhachHang(this.newDiaChiKhachHang)) {
      return; // Ngừng lại nếu dữ liệu không hợp lệ
    }
    this.diaChiKhachHangService.updateDiaChiKhachHang(id, this.newDiaChiKhachHang).subscribe((response) => {

      console.log(response);
      if (response.status) { // Kiểm tra trạng thái HTTP
        console.log(response.status);

        Swal.fire({
          title: 'Thành công!',
          text: ' Địa chỉ khách hàng đã được thêm thành công.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.loadDiaChi(this.currentPage);
        this.updateDiaChiKhachHangData = {};
      } else {
        Swal.fire({
          title: 'Thất bại!',
          text: 'Có lỗi xảy ra trong quá trình thêm mới địa chỉ khách hàng.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    },
      (success) => {
        Swal.fire({
          title: 'Thành công!',
          text: 'Cập nhật địa chỉ khách hàng thành công!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.loadDiaChi(this.currentPage);
      }
    );
  }

  validateDiaChiKhachHang(diaChiKhachHang: any): boolean {
    // Kiểm tra các trường bắt buộc không được trống
    if (!diaChiKhachHang.hoTen || diaChiKhachHang.hoTen.trim() === '') {
      Swal.fire({
        title: 'Lỗi!',
        text: 'Họ tên không được để trống.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return false;
    }


    if (!diaChiKhachHang.soNha || diaChiKhachHang.soNha.trim() === '') {
      Swal.fire({
        title: 'Lỗi!',
        text: 'Số nhà không được để trống.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return false;
    }

    if (!diaChiKhachHang.duong || diaChiKhachHang.duong.trim() === '') {
      Swal.fire({
        title: 'Lỗi!',
        text: 'Đường không được để trống.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return false;
    }

    if (!diaChiKhachHang.phuongXa || diaChiKhachHang.phuongXa.trim() === '') {
      Swal.fire({
        title: 'Lỗi!',
        text: 'Phường/Xã không được để trống.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return false;
    }

    if (!diaChiKhachHang.quanHuyen || diaChiKhachHang.quanHuyen.trim() === '') {
      Swal.fire({
        title: 'Lỗi!',
        text: 'Quận/Huyện không được để trống.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return false;
    }

    if (!diaChiKhachHang.tinhThanh || diaChiKhachHang.tinhThanh.trim() === '') {
      Swal.fire({
        title: 'Lỗi!',
        text: 'Tỉnh/Thành không được để trống.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return false;
    }

    if (!diaChiKhachHang.quocGia || diaChiKhachHang.quocGia.trim() === '') {
      Swal.fire({
        title: 'Lỗi!',
        text: 'Quốc gia không được để trống.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return false;
    }

    return true;
  }


  resetFormDiaChiKhach(): void {
    this.newDiaChiKhachHang = {
      id: 0,
      hoTen: '',
      sdt: '',
      soNha: '',
      duong: '',
      phuongXa: '',
      quanHuyen: '',
      tinhThanh: '',
      quocGia: '',
      loaiDiaChi: '',
      trangThai: '',
    };
  }

}

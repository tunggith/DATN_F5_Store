import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DiaChiKhachHangService } from './dia-chi-khach-hang.service';
import Swal from 'sweetalert2';
import { error, log } from 'console';
import { GiaoHangNhanhService } from 'app/giao-hang-nhanh.service';


@Component({
  selector: 'app-dia-chi-khach-hang',
  templateUrl: './dia-chi-khach-hang.component.html',
  styleUrls: ['./dia-chi-khach-hang.component.css']
})
export class DiaChiKhachHangComponent implements OnInit {
  @Output() closePopup = new EventEmitter<void>();
  @Input() idKhachHang !: number;

  //Địa chỉ khách hàng
  customersDiaChi: any[] = [];
  phuongXa: string = '';
  quanHuyen: string = '';
  tinhThanh: string = '';
  provinces: any[] = [];
  districts: any[] = [];
  wards: any[] = [];
  selectedTinhThanh: string;
  selectedQuanHuyen: string;
  selectedPhuongXa: string;
  page: number = 0;
  size: number = 2;
  pagination: any = [];
  idDiaChi: number = 0;
  diaChiMoi: any = {
    soNha: '',
    duong: '',
    sdt: '',
    phuongXa: '',
    quanHuyen: '',
    tinhThanh: '',
    quocGia: '',
    loaiDiaChi: 'Nhà riêng',
    trangThai: 'Còn sử dụng'
  }

  constructor(private diaChiKhachHangService: DiaChiKhachHangService, private giaoHangNhanhService: GiaoHangNhanhService) { }
  ngOnInit(): void {
    this.loadDiaChi(this.idKhachHang);
    this.loadProvinces();

  }
  // =================== Thông báo ===================

  showSuccessMessage(message: string) {
    Swal.fire({
      icon: 'success',
      title: 'Thành công!',
      text: message,
      showConfirmButton: false,
      timer: 1500
    });
  }

  showErrorMessage(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Thất bại!',
      text: message,
      showConfirmButton: false,
      timer: 1500
    });
  }

  showWarningMessage(message: string) {
    Swal.fire({
      icon: 'warning',
      title: 'Thất bại!',
      text: message,
      showConfirmButton: false,
      timer: 1500
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
  close() {
    this.closePopup.emit();
  }
  changePage(newPage: number): void {
    this.page = newPage;
    this.loadDiaChi(this.idKhachHang);
  }
  loadDiaChi(id: number): void {
    this.diaChiKhachHangService.getAllAddresses(id, this.page, this.size).subscribe(
      (response: any) => {
        if (response.status) {
          this.customersDiaChi = response.result.content.content; // Lấy dữ liệu địa chỉ từ API
          this.pagination = response.result.pagination;
        }
      },
      (error) => {
        console.error('Lỗi khi gọi API địa chỉ:', error);
      }
    );
  }
  diaChiDetail(id: number): void {
    this.diaChiKhachHangService.chiTietDiaChi(id).subscribe(response => {
      this.diaChiMoi = response.result.content;
      // Tìm tỉnh thành tương ứng
      const province = this.provinces.find(p => p.ProvinceName === this.diaChiMoi.tinhThanh);
      this.selectedTinhThanh = province ? province.ProvinceID : null;

      // Kiểm tra tỉnh thành đã được chọn chưa
      if (this.selectedTinhThanh) {
        this.giaoHangNhanhService.getDistricts(Number(this.selectedTinhThanh)).subscribe(
          data => {
            this.districts = data['data'];

            // Tìm quận huyện tương ứng
            const district = this.districts.find(d => d.DistrictName === this.diaChiMoi.quanHuyen);
            this.selectedQuanHuyen = district ? district.DistrictID : null;

            // Kiểm tra quận huyện đã được chọn chưa
            if (this.selectedQuanHuyen) {
              this.giaoHangNhanhService.getWards(Number(this.selectedQuanHuyen)).subscribe(
                data => {
                  this.wards = data['data'];

                  // Tìm phường/xã tương ứng
                  const ward = this.wards.find(w => w.WardName === this.diaChiMoi.phuongXa);
                  this.selectedPhuongXa = ward ? ward.WardCode : null;
                },
                error => {
                  console.error('Lỗi khi tải danh sách phường/xã:', error);
                }
              );
            } else {
              console.warn('Không tìm thấy quận huyện tương ứng với tên:', this.diaChiMoi.quanHuyen);
            }
          },
          error => {
            console.error('Lỗi khi tải danh sách quận huyện:', error);
          }
        );
      } else {
        console.warn('Không tìm thấy tỉnh thành tương ứng với tên:', this.diaChiMoi.tinhThanh);
      }
    }, error => {
      console.error('Error fetching address details:', error);
    });
  }


  createDiaChi(): void {
    this.diaChiMoi.phuongXa = this.phuongXa;
    this.diaChiMoi.quanHuyen = this.quanHuyen;
    this.diaChiMoi.tinhThanh = this.tinhThanh;
    const diaChiData = {
      idKhachHang: this.idKhachHang,
      soNha: this.diaChiMoi.soNha,
      duong: this.diaChiMoi.duong,
      sdt: this.diaChiMoi.sdt,
      phuongXa: this.diaChiMoi.phuongXa,
      quanHuyen: this.diaChiMoi.quanHuyen,
      tinhThanh: this.diaChiMoi.tinhThanh,
      quocGia: this.diaChiMoi.quocGia,
      loaiDiaChi: this.diaChiMoi.loaiDiaChi,
      trangThai: this.diaChiMoi.trangThai
    };
    this.diaChiKhachHangService.addDiaChiKhachHang(diaChiData).subscribe(
      response => {
        this.showSuccessMessage("Add thành công!");
        this.loadDiaChi(this.idKhachHang);
      },
      error => {
        this.handleError(error);
      }
    )
  }
  updateDiaChi(): void {
    this.diaChiMoi.phuongXa = this.phuongXa;
    this.diaChiMoi.quanHuyen = this.quanHuyen;
    this.diaChiMoi.tinhThanh = this.tinhThanh;
    console.log(this.diaChiMoi.phuongXa);
    const diaChiData = {
      idKhachHang: this.idKhachHang,
      soNha: this.diaChiMoi.soNha,
      duong: this.diaChiMoi.duong,
      sdt: this.diaChiMoi.sdt,
      phuongXa: this.diaChiMoi.phuongXa,
      quanHuyen: this.diaChiMoi.quanHuyen,
      tinhThanh: this.diaChiMoi.tinhThanh,
      quocGia: this.diaChiMoi.quocGia,
      loaiDiaChi: this.diaChiMoi.loaiDiaChi,
      trangThai: this.diaChiMoi.trangThai
    };
    this.diaChiKhachHangService.updateDiaChiKhachHang(this.idKhachHang, diaChiData).subscribe(
      response => {
        this.showSuccessMessage("Cập nhật thành công!");
        this.loadDiaChi(this.idKhachHang);
      },
      error => {
        this.handleError(error);
      }
    )
  }

  loadProvinces(): void {
    this.giaoHangNhanhService.getProvinces().subscribe(
      data => {
        this.provinces = data['data'];  // Gán dữ liệu vào 'provinces'
      },
      error => {
        console.error('Lỗi khi tải danh sách tỉnh/thành:', error);
      }
    );
  }

  // Xử lý khi thay đổi tỉnh/thành
  onTinhThanhChange(event: any): void {
    const provinceId = event.target.value;
    this.selectedTinhThanh = provinceId;  // Lưu ID tỉnh/thành
    console.log(this.selectedTinhThanh);
    this.tinhThanh = this.provinces.find(p => p.ProvinceID === Number(provinceId))?.ProvinceName || '';  // Gán tên tỉnh/thành

    this.giaoHangNhanhService.getDistricts(provinceId).subscribe(
      data => {
        this.districts = data['data'];  // Gán dữ liệu vào 'districts'
        this.wards = [];  // Xóa danh sách phường/xã khi chọn tỉnh/thành mới
        this.selectedQuanHuyen = '';  // Reset quận/huyện
        this.selectedPhuongXa = '';  // Reset phường/xã
        this.quanHuyen = '';  // Reset tên quận/huyện
        this.phuongXa = '';  // Reset tên phường/xã
      },
      error => {
        console.error('Lỗi khi tải danh sách quận/huyện:', error);
      }
    );
  }

  // Xử lý khi thay đổi quận/huyện
  onQuanHuyenChange(event: any): void {
    const districtId = event.target.value;
    this.selectedQuanHuyen = districtId;  // Lưu ID quận/huyện
    console.log(this.selectedQuanHuyen);
    this.quanHuyen = this.districts.find(d => d.DistrictID === Number(districtId))?.DistrictName || '';  // Gán tên quận/huyện

    this.giaoHangNhanhService.getWards(districtId).subscribe(
      data => {
        this.wards = data['data'];  // Gán dữ liệu vào 'wards'
      },
      error => {
        console.error('Lỗi khi tải danh sách phường/xã:', error);
      }
    );
  }

  // Xử lý khi thay đổi phường/xã
  onPhuongXaChange(event: any): void {
    const wardCode = event.target.value; // Lấy mã phường/xã từ sự kiện
    this.selectedPhuongXa = wardCode; // Lưu mã phường/xã

    // Tìm tên phường/xã tương ứng
    const foundWard = this.wards.find(w => w.WardCode === wardCode); // So sánh trực tiếp với wardCode

    if (foundWard) {
      this.phuongXa = foundWard.WardName; // Gán tên phường/xã
    } else {
      this.phuongXa = ''; // Nếu không tìm thấy, gán rỗng
    }
  }

  // Thêm các phương thức validation
  hasWhitespace(value: string): boolean {
    return value && value.includes(' ');
  }

  hasNumbers(value: string): boolean {
    return /\d/.test(value);
  }

  hasSpecialCharacters(value: string): boolean {
    const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    return specialChars.test(value);
  }

  validatePhoneLength(value: string): boolean {
    return value && (value.length < 10 || value.length > 11);
  }

  hasMultipleSpaces(str: string): boolean {
    return /\s{2,}/.test(str);
  }

  startsWithSpace(str: string): boolean {
    return /^\s/.test(str);
  }


  validatePhoneNumber(phone: string): boolean {
    if (!phone) return false;
    // Loại bỏ khoảng trắng và kiểm tra định dạng số điện thoại
    const cleanPhone = phone.trim();
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(cleanPhone);
  }

  onSoNhaInput(event: any) {
    const value = event.target.value;
    this.diaChiMoi.soNha = value.replace(/[^0-9]/g, '');
  }

  resetForm() {
    // Reset form về giá trị mặc định
    this.diaChiMoi = {
      soNha: '',
      duong: '',
      sdt: '',
      tinhThanh: '',
      quanHuyen: '',
      phuongXa: '',
      quocGia: 'Việt Nam', // Giá trị mặc định cho quốc gia
      loaiDiaChi: 'Nhà riêng', // Giá trị mặc định cho loại địa chỉ
      trangThai: 'Còn sử dụng' // Giá trị mặc định cho trạng thái
    };

    // Reset các select dropdown
    this.selectedTinhThanh = '';
    this.selectedQuanHuyen = '';
    this.selectedPhuongXa = '';
    
    // Clear districts và wards khi reset form
    this.districts = [];
    this.wards = [];

  
  }

}

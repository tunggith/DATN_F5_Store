import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/auth.service';
import { BanHangService } from 'app/ban-hang.service';
import { GiaoHangNhanhService } from 'app/giao-hang-nhanh.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-thong-tin-don-hang',
  templateUrl: './thong-tin-don-hang.component.html',
  styleUrls: ['./thong-tin-don-hang.component.scss']
})
export class ThongTinDonHangComponent implements OnInit {
  id: number | null;
  trangThaiHoaDon: string = '';
  isHidden: boolean = false;
  hinhThucThanhToan: string = '';
  idGiaoHang: number = 0;
  idKhachHanghd: number = 1;
  hoaDonChoId: number = 0;
  maHoaDonCho: string = '';
  diaChiNhanHang: string = '';
  phiVanChuyen: number = 0;
  editGioHang: boolean = false;
  editDiaChi: boolean = false;
  popupSanPham: boolean = false;
  detailHoaDon: any[] = [];
  tongTien: number = 0;
  tongTienBanDau: number = 0;
  idNhanVien: string = '';
  provinces: any[] = [];
  districts: any[] = [];
  wards: any[] = [];
  selectedTinhThanh: string;
  selectedQuanHuyen: string;
  selectedPhuongXa: string;
  hoTenNguoiNhan: string = '';
  email: string = '';
  soDienThoai: string = '';
  soNha: string = '';
  duong: string = '';
  phuongXa: string = '';
  quanHuyen: string = '';
  tinhThanh: string = '';
  giaTriGiam: number = 0;
  constructor(
    private banHangService: BanHangService,
    private authServie: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private giaoHangNhanhService: GiaoHangNhanhService
  ) { };
  ngOnInit(): void {
    this.getNhanVien();
    this.loadProvinces();
    this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.getIdThongTinDonHang(this.id);
    });
  }
  rollback(): void {
    this.router.navigate(['/ban-hang'], {
      queryParams: { activeTab: 'danhSachHoaDon' }
    });
  }
  openEditGioHang(): void {
    this.editGioHang = true;
    this.editDiaChi = false;
  }
  closeEditGioHang(): void {
    this.editGioHang = false;
    this.banHangService.huyUpdateHoaDon(this.id).subscribe();
  }
  openEditDiaChi(): void {
    this.editDiaChi = true;
    this.editGioHang = false;
    console.log(this.provinces);
    this.showdiaChi();
  }
  closeEditDiaChi(): void {
    this.editDiaChi = false;
  }
  openPopupSanPham(): void {
    this.popupSanPham = true;
  }
  closePopupSanPham() {
    this.popupSanPham = false;
    this.detailChiTietHoaDon(this.id);
    this.getIdThongTinDonHang(this.id);
  }
  addNote() {
    const note = window.prompt('Nhập ghi chú:', '');  // 'Nhập ghi chú:' là thông điệp hiển thị trong prompt, còn '' là giá trị mặc định.

    if (note !== null) {
      // Người dùng đã nhập ghi chú
      console.log('Ghi chú:', note);
      // Gọi API hoặc thực hiện hành động khác với ghi chú
      this.banHangService.addNote(this.id, note).subscribe(response => {
        this.showSuccessMessage('Thêm ghi chú thành công!');
      });
    } else {
      // Người dùng đã hủy bỏ
      console.log('Người dùng đã hủy bỏ việc nhập ghi chú');
    }
  }
  //================= chi tiết thông tin đơn hàng==================
  getIdThongTinDonHang(id: number): void {
    this.banHangService.getDetailHoaDonCho(id).subscribe(
      data => {
        this.trangThaiHoaDon = data.result.content.trangThai;
        this.hinhThucThanhToan = data.result.content.hinhThucThanhToan;
        if (this.trangThaiHoaDon != 'Đã hủy') {
          this.isHidden = false;
        } else {
          this.isHidden = true;
        }
        this.idGiaoHang = data.result.content.giaoHang;
        this.idKhachHanghd = data.result.content.khachHang.id;
        this.hoaDonChoId = data.result.content.id;
        this.maHoaDonCho = data.result.content.ma;
        this.diaChiNhanHang = data.result.content.diaChiNhanHang;
        this.tongTienBanDau = data.result.content.tongTienBanDau;
        this.tongTien = data.result.content.tongTienSauVoucher;
        this.phiVanChuyen = data.result.content.phiShip;
        this.hoTenNguoiNhan = data.result.content.tenNguoiNhan;
        this.email = data.result.content.emailNguoiNhan;
        this.soDienThoai = data.result.content.sdtNguoiNhan;
        this.giaTriGiam = data.result.content.giaTriGiam;
        this.detailChiTietHoaDon(id);
      }
    )
  }
  showdiaChi() {
    const [soNha, duong, phuongXa, quanHuyen, tinhThanh] = this.diaChiNhanHang.split(",").map(part => part.trim());
    this.soNha = soNha;
    this.duong = duong;
    const privince = this.provinces.find(p => p.ProvinceName === tinhThanh);
    this.selectedTinhThanh = privince ? privince.ProvinceID : null;
    if (this.selectedTinhThanh) {
      this.giaoHangNhanhService.getDistricts(Number(this.selectedTinhThanh)).subscribe(
        data => {
          this.districts = data['data'];
          const district = this.districts.find(d => d.DistrictName === quanHuyen);
          this.selectedQuanHuyen = district ? district.DistrictID : null;
          if (this.selectedQuanHuyen) {
            this.giaoHangNhanhService.getWards(Number(this.selectedQuanHuyen)).subscribe(
              data => {
                this.wards = data['data'];
                const ward = this.wards.find(w => w.WardName === phuongXa);
                this.selectedPhuongXa = ward ? ward.WardCode : null;
              }
            );
          }
        }
      );
    }
  }
  updateTrangThaiHoaDon(id: number): void {
    if (this.diaChiNhanHang == null && this.trangThaiHoaDon == 'đã xác nhận' && this.idGiaoHang === 1) {
      this.showWarningMessage("Hóa đơn chưa có địa chỉ nhận hàng, vui lòng nhập");
    } else {
      this.banHangService.updateTrangThaiHoaDon(id).subscribe(
        response => {
          this.showSuccessMessage('Cập nhật thành công!');
          this.getIdThongTinDonHang(this.hoaDonChoId);
        }
      )
    }
  }
  detailChiTietHoaDon(id: number) {
    this.banHangService.getChiTietHoaDon(id).subscribe(
      data => {
        this.detailHoaDon = data.result.content;
      },
      error => {
        this.handleError(error);
      }
    );
  }
  increaseQuantityhd(idSanPham: number): void {
    const selectedProduct = {
      hoaDon: this.hoaDonChoId,
      chiTietSanPham: idSanPham,
      soLuong: 1,
      giaSpctHienTai: 0,
    };

    // Gọi service để chọn sản phẩm với số lượng đã nhập
    this.banHangService.selectProduct(idSanPham, selectedProduct).subscribe(
      response => {
        this.detailChiTietHoaDon(this.hoaDonChoId);
        this.getIdThongTinDonHang(this.id);
      },
      error => {
        console.log('lỗi thêm sản phẩm!');
      }
    );
  }
  decreaseQuantityhd(idChiTietHoaDon: number): void {
    this.banHangService.removeSoLuongHoaDonChiTiet(idChiTietHoaDon).subscribe(
      response => {
        this.detailChiTietHoaDon(this.hoaDonChoId);
        this.getIdThongTinDonHang(this.id);
      },
      error => {
        this.handleError(error);
      }
    )
  }
  removeHoaDonChiTiet(idHoaDonChiTiet: number) {
    if (confirm('bạn có chắc muốn xóa sản phẩm này không?')) {
      this.banHangService.removeHoaDonChiTiet(idHoaDonChiTiet).subscribe(
        response => {
          this.showSuccessMessage('Xóa thành công!');
          this.getIdThongTinDonHang(this.hoaDonChoId);
        },
        error => {
          this.showErrorMessage('Xóa sản phẩm thất bại!');
          console.log('lỗi xóa hóa đơn chi tiết', error);
        }
      )
    }
  }
  //==============export hóa đơn=================
  downloadPdf(id: number) { // ID của PDF bạn muốn tải về
    this.banHangService.downloadPdf(id).subscribe(blob => {
      // Tạo URL từ Blob
      const url = window.URL.createObjectURL(blob);
      // Tạo link để tải xuống
      const a = document.createElement('a');
      a.href = url;
      a.download = `hoa_don_${this.hoaDonChoId}.pdf`; // Tên tệp bạn muốn
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url); // Giải phóng URL
    }, error => {
      console.error('Error downloading PDF', error);
    });
  }

  removeHoaDon(idHoaDon: number): void {
    if (confirm('Bạn có chắc chắn muốn hủy hóa đơn này không?')) {
      this.banHangService.removeHoaDon(idHoaDon).subscribe(
        response => {
          this.showSuccessMessage('Hủy hóa đơn thành công');
          this.getIdThongTinDonHang(this.id);
        },
        this.handleError
      );
    }
  }
  updateHoaDon(): void {
    this.banHangService.updateHoaDon(this.id, this.tongTienBanDau, this.idNhanVien).subscribe(
      response => {
        this.showSuccessMessage('Cập nhật thành công!');
        this.editGioHang = false;
        this.getIdThongTinDonHang(this.id);
      },
      error => {
        this.handleError(error);
      }
    )
  }
  //=======lấy id nhân viên==========
  getNhanVien(): void {
    this.banHangService.getNhanVien(this.authServie.getUsername()).subscribe(
      data => {
        this.idNhanVien = data.result.content.id;
      }
    )
  }
  //=======cập nhật địa chỉ giao hàng=============
  submitAddress() {
    if (this.hoTenNguoiNhan && this.soDienThoai && this.soNha && this.duong && this.phuongXa && this.quanHuyen && this.tinhThanh) {
      this.diaChiNhanHang = `${this.soNha}, ${this.duong}, ${this.phuongXa}, ${this.quanHuyen}, ${this.tinhThanh}`;

      console.log(this.phiVanChuyen);
      // Tạo object hóa đơn với địa chỉ nhận hàng
      const hoaDon = {
        tenNguoiNhan: this.hoTenNguoiNhan,
        sdtNguoiNhan: this.soDienThoai,
        emailNguoiNhan: this.email,
        diaChiNhanHang: this.diaChiNhanHang,
        phiShip: this.phiVanChuyen
      };
      // Gọi API để cập nhật địa chỉ nhận hàng
      this.banHangService.updateDiaChiNhanHang(this.id, hoaDon).subscribe(
        response => {
          this.showSuccessMessage('Cập nhật địa chỉ thành công');
          this.editDiaChi = false;
          this.getIdThongTinDonHang(this.id);
        },
        error => {
          console.error('Cập nhật địa chỉ thất bại:', error);
          alert('Cập nhật địa chỉ thất bại. Vui lòng thử lại.');
        }
      );
    } else {
      alert('Vui lòng điền đầy đủ thông tin địa chỉ.');
    }
  }
  // Tải danh sách tỉnh/thành
  loadProvinces(): void {
    this.giaoHangNhanhService.getProvinces().subscribe(
      data => {
        this.provinces = data['data'];
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
      this.getShippingFee();
    } else {
      this.phuongXa = ''; // Nếu không tìm thấy, gán rỗng
    }
  }
  getShippingFee() {
    const shippingFeeData = {
      "from_province_id": 201,          // Mã tỉnh gửi hàng
      "from_district_id": 1482,         // Mã quận gửi hàng
      "to_province_id": Number(this.selectedTinhThanh),  // Mã tỉnh nhận hàng
      "to_district_id": Number(this.selectedQuanHuyen),   // Mã quận nhận hàng
      "to_ward_code": this.selectedPhuongXa,     // Mã phường nhận hàng (chuyển đổi thành chuỗi)
      "weight": 800,                     // Trọng lượng gói hàng (gram)
      "length": 50,                      // Chiều dài gói hàng (cm)
      "width": 30,                       // Chiều rộng gói hàng (cm)
      "height": 15,                      // Chiều cao gói hàng (cm)
      "service_id": 53321,              // ID loại dịch vụ
      "insurance_value": null,           // Giá trị bảo hiểm (nếu có, có thể để null)
      "cod_failed_amount": null,         // Số tiền thu hộ (nếu có, có thể để null)
      "coupon": null                     // Mã giảm giá (nếu có, có thể để null)
    };

    this.giaoHangNhanhService.createShippingOder(shippingFeeData).subscribe(
      response => {
        // Xử lý phí vận chuyển ở đây
        this.phiVanChuyen = response.data.total;
      },
      error => {
        console.error('Lỗi khi lấy phí vận chuyển:', error);
      }
    );
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
}

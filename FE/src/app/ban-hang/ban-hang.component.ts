import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BanHangService } from 'app/ban-hang.service';
import { GiaoHangNhanhService } from 'app/giao-hang-nhanh.service';
import { error } from 'console';
import { response } from 'express';
import { data } from 'jquery';
import { map, Observable, startWith, switchMap } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ban-hang',
  templateUrl: './ban-hang.component.html',
  styleUrls: ['./ban-hang.component.css']
})
export class BanHangComponent implements OnInit {
  product: any[] = [];
  pagination: any = [];
  paginationHd: any = [];
  searchTerm: string = '';
  hoaDon: any[] = [];
  chitietHoaDon: any[] = [];
  hasError: boolean = false;
  activeInvoidID: number | null = null;
  tongTienBanDau: number = 0;
  tongTienSauVoucher: number = 0;
  tenKhachHang: string = '';
  tienKhachDua: number = 0;
  tienTraLai: number = 0;
  tienKhachDuaInvalid: boolean = false;
  voucher: any[] = [];
  phuongThucThanhToan: any[] = [];
  icon: string = 'toggle_on';
  checkHoaDon: boolean = false;
  selectedVoucherId: number | null = null;
  idThanhToan: number = 0;
  idGiaoHang: number = 0;
  popup: boolean = false;
  popupHs: boolean = false;
  popupHd: boolean = false;
  idKhachHang: number = 1;
  activeTab: string = 'taoMoi';
  hoaDonCho: any[] = [];
  hoaDonChoId: number = 0;
  trangThaiHoaDon: string = '';
  maHoaDonCho: string = '';
  keywork: string = '';
  pageHoaDonCt: number = 0;
  sizeHoaDonCt: number = 5;
  isHidden: boolean = false;
  diaChiNhanHang: string = '';
  hoTenNguoiNhan: string = '';
  email: string = '';
  soDienThoai: string = '';
  soNha: string = '';
  duong: string = '';
  phuongXa: string = '';
  quanHuyen: string = '';
  tinhThanh: string = '';
  myControl = new FormControl('');
  options: any[] = [];
  filteredOptions: Observable<string[]>;
  provinces: any[] = [];
  districts: any[] = [];
  wards: any[] = [];
  selectedTinhThanh: string;
  selectedQuanHuyen: string;
  selectedPhuongXa: string;
  phiVanChuyen: String;
  hoaDonMoi: any = {
    idKhachHang: 0,
    idNhanVien: 0
  };

  hoaDonChiTietMoi: any = {
    hoaDon: 0,
    chiTietSanPham: 0,
    ma: '',
    soLuong: 0,
    giaSpctHienTai: 0,
    trangThai: ''
  };

  constructor(private banHangService: BanHangService, private giaoHangNhanhService: GiaoHangNhanhService) { }

  ngOnInit() {
    this.getSanPham();
    this.getHoaDon();
    this.getVoucher();
    this.getPhuongThucThanhToan();
    this.toggleIcon();
    this.getByTrangThai();
    this.loadKhachHang();
    this.loadProvinces();
  }
  //chuyển tab
  selectTab(tabName: string) {
    this.activeTab = tabName;
  }
  toggleIcon() {
    this.icon = this.icon === 'toggle_on' ? 'toggle_off' : 'toggle_on';
    this.idGiaoHang = this.icon === 'toggle_on' ? 1 : 0;
  }

  // ====================== Lấy dữ liệu bán hàng ====================

  getSanPham(pageSize: number = 0, pageNumber: number = 5, keyword: string = ''): void {
    this.banHangService.getSanPham(pageSize, pageNumber, keyword).subscribe(
      data => {
        this.product = data.result.content.content;
        this.pagination = data.result.pagination;
      },
      this.handleError // Xử lý lỗi dùng phương thức riêng
    );
  }
  searchProduct(): void {
    this.getSanPham(0, 5, this.searchTerm);
  }

  getHoaDon(): void {
    this.banHangService.getHoaDon().subscribe(
      data => {
        this.hoaDon = data.result.content;
        if (this.hoaDon.length > 0) {
          this.getChiTietHoaDon(this.hoaDon[0].id);
          this.tenKhachHang = this.hoaDon[0].id;
          this.checkHoaDon = false;
        } else {
          this.checkHoaDon = true;
        }
      },
      this.handleError
    );
  }

  getChiTietHoaDon(id: number): void {
    this.banHangService.getChiTietHoaDon(id).subscribe(
      data => {
        this.chitietHoaDon = data.result.content;
        this.activeInvoidID = id;

        if (this.chitietHoaDon.length > 0) {
          const hoaDonData = data.result.content[0].hoaDon;
          this.tongTienBanDau = hoaDonData.tongTienBanDau;
          this.tongTienSauVoucher = hoaDonData.tongTienBanDau;
          this.tienKhachDua = this.tongTienSauVoucher;
          this.tenKhachHang = hoaDonData.khachHang.ten;
          this.hasError = false;  // Có sản phẩm, không có lỗi
        } else {
          this.resetHoaDonData();
          this.hasError = true;  // Không có sản phẩm, báo lỗi
        }
      },
      error => {
        this.handleError(error);
        this.hasError = true;  // Nếu có lỗi xảy ra khi gọi API, báo lỗi
      }
    );
  }

  getVoucher(): void {
    this.banHangService.getVoucher().subscribe(
      data => this.voucher = data.result.content,
      this.handleError
    );
  }

  getPhuongThucThanhToan(): void {
    this.banHangService.getPhuongThucThanhToan().subscribe(
      data => this.phuongThucThanhToan = data.result.content,
      this.handleError
    );
  }

  getTienTraLai(tienKhachDua: number): void {
    if (isNaN(tienKhachDua) || tienKhachDua <= 0) {
      this.tienKhachDuaInvalid = true;
      this.tienTraLai = 0;
    } else {
      this.tienKhachDuaInvalid = false;
      this.tienTraLai = Math.max(0, tienKhachDua - this.tongTienSauVoucher);
    }
  }

  onInputChange(event: any): void {
    const selectedValue = event.target.value;
    const selectedVoucher = this.voucher.find(v => v.ten === selectedValue);
    this.selectedVoucherId = selectedVoucher ? selectedVoucher.id : null;

    if (selectedVoucher) {
      let discountValue: number;

      // Kiểm tra kiểu giảm giá của voucher
      if (selectedVoucher.kieuGiamGia === '%') {
        // Nếu là phần trăm, tính giá trị giảm dựa trên phần trăm
        discountValue = this.tongTienBanDau * (selectedVoucher.giaTriVoucher / 100);
      } else {
        // Nếu là giảm tiền trực tiếp, lấy giá trị của voucher
        discountValue = selectedVoucher.giaTriVoucher;
      }

      // Đảm bảo giảm giá không vượt quá giá trị tối đa mà voucher cho phép
      const finalDiscount = Math.min(discountValue, selectedVoucher.giaTriGiamToiDa);

      // Kiểm tra điều kiện áp dụng voucher (nếu cần)
      if (this.tongTienBanDau >= selectedVoucher.giaTriHoaDonToiThieu) {
        // Tính tổng tiền sau khi áp dụng voucher
        this.tongTienSauVoucher = this.tongTienBanDau - finalDiscount;
      } else {
        // Nếu không đạt điều kiện, tổng tiền không thay đổi
        this.tongTienSauVoucher = this.tongTienBanDau;
      }
    } else {
      // Nếu không có voucher được chọn, tổng tiền sau voucher bằng tổng tiền ban đầu
      this.tongTienSauVoucher = this.tongTienBanDau;
    }
  }
  //lấy phương thức thanh toán
  getIdThanhToan(idThanhToan: number): void {
    this.idThanhToan = idThanhToan;
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

  // ================= Tạo và hủy hóa đơn =================

  createHoaDon(): void {
    const hoaDonData = {
      idKhachHang: 0,
      idNhanVien: 1,
      idVoucher: this.selectedVoucherId || 0,
      idThanhToan: this.idThanhToan || 2,
      ma: '',
      tongTienBanDau: 0,
      phiShip: 0,
      tongTienSauVoucher: 0,
      tenNguoiNhan: '',
      sdtNguoiNhan: '',
      emailNguoiNhan: '',
      diaChiNhanHang: '',
      ngayNhanDuKien: '',
      thoiGianTao: '',
      giaoHang: 0,
      ghiChu: '',
      trangThai: ''
    };
    this.banHangService.createHoaDon(hoaDonData).subscribe(
      response => {
        this.showSuccessMessage('Tạo hóa đơn thành công!');
        this.getHoaDon();
      },
      error => {
        this.handleError(error);
      }
    );
  }

  removeHoaDon(idHoaDon: number): void {
    if (confirm('bạn có chắc chắn muốn hủy hóa đơn này không?')) {
      this.banHangService.removeHoaDon(idHoaDon).subscribe(
        response => {
          this.showSuccessMessage('Hủy hóa đơn thành công');
          this.getHoaDon();
          this.getSanPham();
          this.getByTrangThai();
          this.getIdThongTinDonHang(idHoaDon);
        },
        this.handleError
      );
    }
  }

  // ================= Chọn sản phẩm =================

  selectProduct(idSanPham: number): void {
    // Hiển thị hộp thoại để nhập số lượng
    const soLuongNhap = window.prompt('Nhập số lượng sản phẩm:', '1');

    // Kiểm tra nếu người dùng đã nhập số lượng
    if (soLuongNhap !== null) {
      const soLuong = Number(soLuongNhap);

      if (!isNaN(soLuong) && soLuong > 0) {  // Kiểm tra số lượng hợp lệ
        const selectedProduct = {
          hoaDon: this.activeInvoidID,
          chiTietSanPham: idSanPham,
          ma: '',
          soLuong: soLuong,
          giaSpctHienTai: 0,
          trangThai: 'Đang xử lý'
        };

        // Gọi service để chọn sản phẩm với số lượng đã nhập
        this.banHangService.selectProduct(idSanPham, selectedProduct).subscribe(
          response => {
            this.showSuccessMessage('Chọn sản phẩm thành công!');
            this.getHoaDon();  // Cập nhật lại hóa đơn sau khi chọn sản phẩm
            this.getSanPham();
          },
          error => {
            this.handleError(error);
          }
        );
      } else {
        this.showErrorMessage('Số lượng không hợp lệ! Vui lòng nhập lại.');
      }
    }
  }
  increaseQuantity(idSanPham: number): void {
    const selectedProduct = {
      hoaDon: this.activeInvoidID,
      chiTietSanPham: idSanPham,
      ma: '',
      soLuong: 1,
      giaSpctHienTai: 0,
      trangThai: 'Đang xử lý'
    };

    // Gọi service để chọn sản phẩm với số lượng đã nhập
    this.banHangService.selectProduct(idSanPham, selectedProduct).subscribe(
      response => {
        this.getHoaDon();
        this.getSanPham();
      },
      error => {
        console.log('lỗi thêm sản phẩm!');
      }
    );
  }
  decreaseQuantity(idChiTietHoaDon: number): void {
    this.banHangService.removeSoLuongHoaDonChiTiet(idChiTietHoaDon).subscribe(
      response => {
        this.getHoaDon();
        this.getSanPham();

      },
      error => {
        this.handleError(error);
      }
    )
  }

  //==================xóa hóa đơn chi tiết==================
  removeHoaDonChiTiet(idHoaDonChiTiet: number) {
    if (confirm('bạn có chắc muốn xóa sản phẩm này không?')) {
      this.banHangService.removeHoaDonChiTiet(idHoaDonChiTiet).subscribe(
        response => {
          this.showSuccessMessage('xóa thành công!');
          this.getHoaDon();
          this.getSanPham();
        },
        error => {
          this.showErrorMessage('xóa sản phẩm thất bại!');
          console.log('lỗi xóa hóa đơn chi tiết', error);
        }
      )
    }
  }
  //==================đóng mở popup=============
  openPopup() {
    this.popup = true;
  }
  openPopupHs(hoaDonId: number): void {
    this.hoaDonChoId = hoaDonId;
    this.popupHs = true;  // Mở popup
  }
  openPopupHd(hoaDonId: number): void {
    this.hoaDonChoId = hoaDonId;
    this.popupHd = true;  // Mở popup
  }

  closePopup() {
    this.popup = false;
    this.loadKhachHang();
  }
  closePopupHs() {
    this.popupHs = false;
  }
  closePopupHd() {
    this.popupHd = false;
  }
  onCustomerSelected(customer: any) {
    if (customer) {
      this.tenKhachHang = customer.ten;
      this.idKhachHang = customer.id;
      this.updateKhachHang(this.activeInvoidID, this.idKhachHang)
    }
  }
  updateKhachHang(idHoaDon: number, idKhachHang: number) {
    this.banHangService.updateKhachHang(idHoaDon, idKhachHang).subscribe();
  }
  //==================Thanh toán hóa đơn==================
  
  thanhtoanHoaDon(idHoaDon: number): void {
    if (this.tienKhachDua < this.tongTienSauVoucher) {
      this.showErrorMessage('Số tiền khách đưa không đủ!');
      return;
    }

    // Nếu idGiaoHang là 1 thì mới gọi submitAddress và kiểm tra địa chỉ
    if (this.idGiaoHang === 1) {
      this.submitAddress();

      if (this.diaChiNhanHang === null||this.diaChiNhanHang==='') {
        return; // Ngừng lại nếu địa chỉ nhận hàng không hợp lệ
      }
    }

    // Cập nhật thông tin hóa đơn để thanh toán
    const hoaDonData = {
      idKhachHang: this.idKhachHang || 1,
      idNhanVien: 1,
      idVoucher: this.selectedVoucherId || null,
      idThanhToan: this.idThanhToan || 2,
      ma: this.hoaDonChiTietMoi.hoaDon.ma,
      tongTienBanDau: this.tongTienBanDau,
      tongTienSauVoucher: 0,
      tenNguoiNhan: this.tenKhachHang,
      giaoHang: this.idGiaoHang || 0, // Trạng thái giao hàng
      diaChiNhanHang: this.diaChiNhanHang
    };

    // Gọi service để thanh toán hóa đơn
    this.banHangService.thanhToanHoaDOn(idHoaDon, hoaDonData).subscribe(
      response => {
        this.showSuccessMessage('Thanh toán hóa đơn thành công!');
        this.getHoaDon(); // Cập nhật lại danh sách hóa đơn sau khi thanh toán
        this.getSanPham(); // Cập nhật lại danh sách sản phẩm
        this.getByTrangThai();
        this.icon='toggle_off';
      },
      error => {
        this.handleError(error); // Xử lý lỗi nếu có
        this.showErrorMessage('Thanh toán thất bại! Vui lòng thử lại.');
      }
    );
  }

  onKeyworkChange(event: Event): void {
    const input = event.target as HTMLInputElement; // Lấy giá trị từ event
    this.keywork = input.value; // Gán giá trị vào keywork
    this.pageHoaDonCt = 0;
    this.getByTrangThai(); // Gọi hàm tìm kiếm nếu cần
  }
  //================== danh sách hóa đơn ==================
  changePage(newPage: number): void {
    // Cập nhật số trang
    this.pageHoaDonCt = newPage;
    // Gọi lại hàm để lấy dữ liệu mới
    this.getByTrangThai();
  }
  getByTrangThai(): void {
    this.banHangService.getByTrangThai(this.pageHoaDonCt, this.sizeHoaDonCt, this.keywork).subscribe(
      data => {
        this.hoaDonCho = data.result.content.content;
        this.paginationHd = data.result.pagination;
      }
    )
  }
  //================= chi tiết thông tin đơn hàng==================
  getIdThongTinDonHang(id: number): void {
    this.banHangService.getDetailHoaDonCho(id).subscribe(
      data => {
        this.trangThaiHoaDon = data.result.content.trangThai;
        if (this.trangThaiHoaDon != 'Đã hủy') {
          this.isHidden = false;
        } else {
          this.isHidden = true;
        }
        this.idGiaoHang = data.result.content.giaoHang;
        this.hoaDonChoId = data.result.content.id;
        this.maHoaDonCho = data.result.content.ma;
        this.diaChiNhanHang = data.result.content.diaChiNhanHang;
        this.phiVanChuyen = data.result.content.phiShip;
        console.log(this.idGiaoHang);
      }
    )
  }
  updateTrangThaiHoaDon(id: number): void {
    if (this.diaChiNhanHang == null && this.trangThaiHoaDon == 'đã xác nhận' && this.idGiaoHang === 1) {
      this.showWarningMessage("hóa đơn chưa có địa chỉ nhận hàng, vui lòng nhập");
    } else {
      this.banHangService.updateTrangThaiHoaDon(id).subscribe(
        response => {
          this.showSuccessMessage('cập nhật thành công!');
          this.activeTab = 'danhSachHoaDon';
          this.getIdThongTinDonHang(this.hoaDonChoId);
          this.getByTrangThai();
        }
      )
    }
  }
  //==============export hóa đơn=================
  downloadPdf() { // ID của PDF bạn muốn tải về
    this.banHangService.downloadPdf(this.hoaDonChoId).subscribe(blob => {
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
  //===============api giao hàng nhanh===============
  // Tải danh sách tỉnh/thành
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
        console.log('Phí vận chuyển:', response);
        // Xử lý phí vận chuyển ở đây
        this.phiVanChuyen = response.data.total;
      },
      error => {
        console.error('Lỗi khi lấy phí vận chuyển:', error);
      }
    );
  }

  //=======cập nhật địa chỉ giao hàng=============
  submitAddress() {
    if (this.hoTenNguoiNhan && this.soDienThoai && this.soNha && this.duong && this.phuongXa && this.quanHuyen && this.tinhThanh) {
      this.diaChiNhanHang = `${this.soNha}, ${this.duong}, ${this.phuongXa}, ${this.quanHuyen}, ${this.tinhThanh}`;

      // Tạo object hóa đơn với địa chỉ nhận hàng
      const hoaDon = {
        tenNguoiNhan: this.hoTenNguoiNhan,
        sdtNguoiNhan: this.soDienThoai,
        emailNguoiNhan: this.email,
        diaChiNhanHang: this.diaChiNhanHang,
        phiShip: this.phiVanChuyen
      };
      console.log(this.phiVanChuyen);
      console.log(this.activeInvoidID);
      // Gọi API để cập nhật địa chỉ nhận hàng
      this.banHangService.updateDiaChiNhanHang(this.activeInvoidID, hoaDon).subscribe(
        response => {
          //this.showSuccessMessage('cập nhật địa chỉ thành công');
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
  //===================gọi khách hàng================
  loadKhachHang() {
    // Gọi API lấy danh sách khách hàng
    this.banHangService.getKhachHang().subscribe(
      data => {
        this.options = data.result.content;
        // Xử lý filteredOptions với giá trị ban đầu
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value || '')),
        );
      },
      error => {
        console.error('Lỗi khi lấy dữ liệu khách hàng', error);
      }
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    // Lọc các đối tượng dựa trên thuộc tính 'ten'
    return this.options.filter(option =>
      (option.ten && option.ten.toLowerCase().includes(filterValue)) ||
      (option.sdt && option.sdt.toLowerCase().includes(filterValue)) ||
      (option.email && option.email.toLowerCase().includes(filterValue))
    );
  }
  onOptionSelected(event: any) {
    const selectedTen = event.option.value; // Lấy giá trị 'ten' từ lựa chọn

    // Tìm khách hàng tương ứng từ danh sách options dựa trên 'ten'
    const selectedKhachHang = this.options.find(option => option.ten === selectedTen);

    if (selectedKhachHang) {
      this.idKhachHang = selectedKhachHang.id; // Gán id cho idKhachHang
      console.log('ID Khách Hàng:', this.idKhachHang); // Kiểm tra ID Khách Hàng
    }
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

  resetHoaDonData(): void {
    this.tongTienBanDau = 0;
    this.tongTienSauVoucher = 0;
    this.tenKhachHang = '';
    this.tienKhachDua = 0;
    this.tienTraLai = 0;
    this.hasError = true;
  }
}

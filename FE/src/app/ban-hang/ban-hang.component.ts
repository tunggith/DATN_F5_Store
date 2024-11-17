import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/auth.service';
import { BanHangService } from 'app/ban-hang.service';
import { DiaChiKhachHangService } from 'app/dia-chi-khach-hang/dia-chi-khach-hang.service';
import { GiaoHangNhanhService } from 'app/giao-hang-nhanh.service';
import { map, Observable, startWith } from 'rxjs';
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
  giaTriGiam: number = 0;
  tongTienSauVoucher: number = 0;
  tenKhachHang: string = '';
  tienKhachDua: number = 0;
  tienTraLai: number = 0;
  tienKhachDuaInvalid: boolean = false;
  voucher: any[] = [];
  voucherControl = new FormControl('');
  filteredVoucher: Observable<string[]>;
  phuongThucThanhToan: any[] = [];
  icon: string = 'toggle_on';
  checkHoaDon: boolean = false;
  selectedVoucherId: number | null = null;
  idThanhToan: number = 1;
  idGiaoHang: number = 0;
  popup: boolean = false;
  popupHs: boolean = false;
  popupHd: boolean = false;
  popupCho: boolean = false;
  popupSanPham: boolean = false;
  idKhachHang: number = 1;
  idKhachHanghd: number = 1;
  activeTab: string = 'taoMoi';
  hoaDonCho: any[] = [];
  hoaDonChoId: number = 0;
  maHoaDonCho: string = '';
  keywork: string = '';
  pageHoaDonCt: number = 0;
  sizeHoaDonCt: number = 5;
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
  phiVanChuyen: number;
  hoaDonMoi: any = {
    idKhachHang: 0,
    idNhanVien: 0
  };
  userName: string = '';
  idNhanVien: string = '';
  hoaDonChiTietMoi: any = {
    hoaDon: 0,
    chiTietSanPham: 0,
    ma: '',
    soLuong: 0,
    giaSpctHienTai: 0,
    trangThai: ''
  };
  sizeId: string = '';
  mauSacId: string = '';
  thuongHieuId: string = '';
  xuatXuId: string = '';
  gioiTinhId: string = '';
  token: string = '';
  role: string = '';
  trangThaiCho: any[] = [];
  editGioHang: boolean = false;
  editDiaChi: boolean = false;
  vnpTransactionStatus: string | null = null;
  constructor(
    private banHangService: BanHangService,
    private giaoHangNhanhService: GiaoHangNhanhService,
    private authServie: AuthService,
    private diaChiKhachHangService: DiaChiKhachHangService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.token = this.authServie.getToken();
    this.role = this.authServie.getRole();
    this.getHoaDon();
    this.getVoucher();
    this.getPhuongThucThanhToan();
    this.toggleIcon();
    this.getByTrangThai();
    this.loadKhachHang();
    this.loadProvinces();
    this.getNhanVien();
    this.getHoaDonTrangThai();
    this.route.queryParams.subscribe(params => {
      const activeTab = params['activeTab'];
      if (activeTab) {
        this.activeTab = activeTab;
      }
    });
    this.route.queryParams.subscribe(params => {
      this.vnpTransactionStatus = params['vnp_TransactionStatus'];
    });
  }
  //chuyển tab
  selectTab(tabName: string) {
    this.activeTab = tabName;

    if (tabName === 'taoMoi') {
      // Xóa query params 'activeTab' khỏi URL
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { activeTab: null }, // Đặt giá trị null để xóa
        queryParamsHandling: 'merge', // Giữ các query params khác (nếu có)
      });
    }
  }
  toggleIcon() {
    this.icon = this.icon === 'toggle_on' ? 'toggle_off' : 'toggle_on';
    this.idGiaoHang = this.icon === 'toggle_on' ? 1 : 0;
    if (this.icon === 'toggle_off') {
      this.resetFormDiaChi();
    }
  }
  getHoaDon(): void {
    this.banHangService.getHoaDon().subscribe(
      data => {
        this.hoaDon = data.result.content;
        if (this.hoaDon.length > 0) {
          this.getChiTietHoaDon(this.hoaDon[0].id);
          this.tenKhachHang = this.hoaDon[0].id;
          this.checkHoaDon = false;
          this.getHoaDonTrangThai();
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
          this.giaTriGiam = hoaDonData.giaTriGiam;
          this.tongTienSauVoucher = hoaDonData.tongTienBanDau;
          this.tienKhachDua = this.tongTienSauVoucher + this.phiVanChuyen;
          this.tenKhachHang = hoaDonData.khachHang.ten;
          this.hasError = false;  // Có sản phẩm, không có lỗi
          if (this.vnpTransactionStatus === '00') {
            this.thanhtoanHoaDonSauCk(id);
          }else{
            this.router.navigate(['/ban-hang']);
          }
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
      idNhanVien: this.idNhanVien,
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
  //==================xóa hóa đơn chi tiết==================
  removeHoaDonChiTiet(idHoaDonChiTiet: number) {
    if (confirm('bạn có chắc muốn xóa sản phẩm này không?')) {
      this.banHangService.removeHoaDonChiTiet(idHoaDonChiTiet).subscribe(
        response => {
          this.showSuccessMessage('xóa thành công!');
          this.getHoaDon();
        },
        error => {
          this.showErrorMessage('xóa sản phẩm thất bại!');
          console.log('lỗi xóa hóa đơn chi tiết', error);
        }
      )
    }
  }
  getHoaDonTrangThai() {
    this.banHangService.getTrangThaiCho().subscribe(
      data => {
        this.trangThaiCho = data.result.content;
      }
    )
  }
  //==================đóng mở popup=============
  openEditGioHang() {
    this.editGioHang = true;
    this.editDiaChi = false;
  }
  openEditDiaChi() {
    this.editDiaChi = true;
    this.loadDiaChi(this.idKhachHanghd);
    this.editGioHang = false;
  }
  closeEditGioHang() {
    this.editGioHang = false;
  }
  closeEditDiaChi() {
    this.editDiaChi = false;
  }
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
  openPopupCho(): void {
    this.popupCho = true;
  }
  openPopupSanPham(): void {
    this.popupSanPham = true;
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
  closePopupCho() {
    this.popupCho = false;
    this.getHoaDon();
  }
  closePopupSanPham() {
    this.popupSanPham = false;
    this.getChiTietHoaDon(this.activeInvoidID);
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
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn thanh toán hóa đơn này không?");
    if (!isConfirmed) {
      return; // Nếu người dùng nhấn "Cancel", dừng lại
    }
    if (this.tienKhachDua < this.tongTienSauVoucher) {
      this.showErrorMessage('Số tiền khách đưa không đủ!');
      return;
    }

    // Nếu idGiaoHang là 1 thì mới gọi submitAddress và kiểm tra địa chỉ
    if (this.idGiaoHang === 1) {
      this.submitAddress();

      if (this.diaChiNhanHang === null || this.diaChiNhanHang === '') {
        return; // Ngừng lại nếu địa chỉ nhận hàng không hợp lệ
      }
    }
    // Cập nhật thông tin hóa đơn để thanh toán
    const hoaDonData = {
      idKhachHang: this.idKhachHang || 1,
      idNhanVien: this.idNhanVien,
      idVoucher: this.selectedVoucherId || null,
      idThanhToan: this.idThanhToan || 1,
      ma: this.hoaDonChiTietMoi.hoaDon.ma,
      tongTienBanDau: this.tongTienBanDau,
      phiShip: this.phiVanChuyen,
      hinhThucThanhToan: 0,
      tongTienSauVoucher: 0,
      tenNguoiNhan: this.hoTenNguoiNhan,
      sdtNguoiNhan: this.soDienThoai,
      emailNguoiNhan: this.email,
      giaoHang: this.idGiaoHang || 0, // Trạng thái giao hàng
      diaChiNhanHang: this.diaChiNhanHang
    };
    if (this.idThanhToan == 2) {
      this.banHangService.vnPay(this.tongTienSauVoucher+this.giaTriGiam+this.phiVanChuyen).subscribe(
        (response: any) => {
          const paymentUrl = response.paymentUrl;
          if (paymentUrl) {
            window.location.href = paymentUrl;
          }
        },
        (error) => {
          this.handleError(error); // Xử lý lỗi nếu có
          this.showErrorMessage('Gọi API thanh toán VNPay thất bại! Vui lòng thử lại.');
        }
      );
    } else {
      // Gọi service để thanh toán hóa đơn
      this.banHangService.thanhToanHoaDOn(idHoaDon, hoaDonData).subscribe(
        response => {
          this.showSuccessMessage('Thanh toán hóa đơn thành công!');
          this.getHoaDon();
          this.getByTrangThai();
          this.icon = 'toggle_off';
          // Hiển thị hộp thoại xác nhận in hóa đơn
          const printConfirm = window.confirm("Bạn có muốn in hóa đơn không?");
          if (printConfirm) {
            this.downloadPdf(idHoaDon);
          }
        },
        error => {
          this.handleError(error); // Xử lý lỗi nếu có
          this.showErrorMessage('Thanh toán thất bại! Vui lòng thử lại.');
        }
      );
    }
  }
  thanhtoanHoaDonSauCk(idHoaDon: number): void {
    const hoaDonData = {
      idKhachHang: this.idKhachHang || 1,
      idNhanVien: this.idNhanVien,
      idVoucher: this.selectedVoucherId || null,
      idThanhToan: this.idThanhToan || 1,
      ma: this.hoaDonChiTietMoi.hoaDon.ma,
      tongTienBanDau: this.tongTienBanDau,
      phiShip: this.phiVanChuyen,
      hinhThucThanhToan: 0,
      tongTienSauVoucher: 0,
      tenNguoiNhan: this.hoTenNguoiNhan,
      sdtNguoiNhan: this.soDienThoai,
      emailNguoiNhan: this.email,
      giaoHang: this.idGiaoHang || 0, // Trạng thái giao hàng
      diaChiNhanHang: this.diaChiNhanHang
    };
    this.banHangService.thanhToanHoaDOn(idHoaDon, hoaDonData).subscribe(
      response => {
        this.showSuccessMessage('Thanh toán hóa đơn thành công!');
        this.getHoaDon();
        this.getByTrangThai();
        this.icon = 'toggle_off';
        // Hiển thị hộp thoại xác nhận in hóa đơn
        const printConfirm = window.confirm("Bạn có muốn in hóa đơn không?");
        if (printConfirm) {
          this.downloadPdf(idHoaDon);
          this.router.navigate(['/ban-hang']);
        }
      },
      error => {
        this.handleError(error); // Xử lý lỗi nếu có
        this.showErrorMessage('Thanh toán thất bại! Vui lòng thử lại.');
      }
    );
  }
  //==============load địa chỉ khách hàng nếu khách hàng có địa chỉ=====================
  loadDiaChi(id: number): void {
    this.diaChiKhachHangService.getAllAddresses(id, 0, 10).subscribe(
      (response: any) => {
        if (response.status) {
          const diaChi = response.result.content.content[0];
          this.soNha = diaChi.soNha;
          this.duong = diaChi.duong;
          this.phuongXa = diaChi.phuongXa;
          this.quanHuyen = diaChi.quanHuyen;
          this.tinhThanh = diaChi.tinhThanh;
          this.diaChiDetail(diaChi.id);
        }
      },
      (error) => {
        console.error('Lỗi khi gọi API địa chỉ:', error);
      }
    );
  }
  diaChiDetail(id: number): void {
    this.diaChiKhachHangService.chiTietDiaChi(id).subscribe(response => {
      console.log(response);
      this.hoTenNguoiNhan = response.result.content.khackHang.ten;
      this.soDienThoai = response.result.content.khackHang.sdt;
      this.email = response.result.content.khackHang.email;
      // Tìm tỉnh thành tương ứng
      const province = this.provinces.find(p => p.ProvinceName === this.tinhThanh);
      this.selectedTinhThanh = province ? province.ProvinceID : null;

      // Kiểm tra tỉnh thành đã được chọn chưa
      if (this.selectedTinhThanh) {
        this.giaoHangNhanhService.getDistricts(Number(this.selectedTinhThanh)).subscribe(
          data => {
            this.districts = data['data'];

            // Tìm quận huyện tương ứng
            const district = this.districts.find(d => d.DistrictName === this.quanHuyen);
            this.selectedQuanHuyen = district ? district.DistrictID : null;

            // Kiểm tra quận huyện đã được chọn chưa
            if (this.selectedQuanHuyen) {
              this.giaoHangNhanhService.getWards(Number(this.selectedQuanHuyen)).subscribe(
                data => {
                  this.wards = data['data'];

                  // Tìm phường/xã tương ứng
                  const ward = this.wards.find(w => w.WardName === this.phuongXa);
                  this.selectedPhuongXa = ward ? ward.WardCode : null;
                  this.getShippingFee();
                },
                error => {
                  console.error('Lỗi khi tải danh sách phường/xã:', error);
                }
              );
            } else {
              console.warn('Không tìm thấy quận huyện tương ứng với tên:', this.quanHuyen);
            }
          },
          error => {
            console.error('Lỗi khi tải danh sách quận huyện:', error);
          }
        );
      } else {
        console.warn('Không tìm thấy tỉnh thành tương ứng với tên:', this.tinhThanh);
      }
    }, error => {
      console.error('Error fetching address details:', error);
    });
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
  //================ tăng giảm số lượng=======================
  increaseQuantity(idSanPham: number): void {
    const selectedProduct = {
      hoaDon: this.activeInvoidID,
      chiTietSanPham: idSanPham,
      soLuong: 1,
      giaSpctHienTai: 0,
    };

    // Gọi service để chọn sản phẩm với số lượng đã nhập
    this.banHangService.selectProduct(idSanPham, selectedProduct).subscribe(
      response => {
        this.getChiTietHoaDon(this.activeInvoidID);
      },
      error => {
        console.log('lỗi thêm sản phẩm!');
      }
    );
  }
  decreaseQuantity(idChiTietHoaDon: number): void {
    this.banHangService.removeSoLuongHoaDonChiTiet(idChiTietHoaDon).subscribe(
      response => {
        this.getChiTietHoaDon(this.activeInvoidID);
      },
      error => {
        this.handleError(error);
      }
    )
  }
  //==============export hóa đơn=================
  downloadPdf(id: number) { // ID của PDF bạn muốn tải về
    this.banHangService.downloadPdf(id).subscribe(blob => {
      // Tạo URL từ Blob
      const url = window.URL.createObjectURL(blob);
      // Tạo link để tải xuống
      const a = document.createElement('a');
      a.href = url;
      a.download = `hoa_don_${id}.pdf`; // Tên tệp bạn muốn
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
        this.tienKhachDua = this.tienKhachDua + this.phiVanChuyen;
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

      console.log(this.phiVanChuyen);
      // Tạo object hóa đơn với địa chỉ nhận hàng
      const hoaDon = {
        tenNguoiNhan: this.hoTenNguoiNhan,
        sdtNguoiNhan: this.soDienThoai,
        emailNguoiNhan: this.email,
        diaChiNhanHang: this.diaChiNhanHang,
        phiShip: this.phiVanChuyen
      };
      let id = 0;
      if (this.activeTab === 'taoMoi') {
        id = this.activeInvoidID;
      } else {
        id = this.hoaDonChoId;
      }
      // Gọi API để cập nhật địa chỉ nhận hàng
      this.banHangService.updateDiaChiNhanHang(id, hoaDon).subscribe(
        response => {
          if (this.activeTab === 'danhSachHoaDon') {
            this.showSuccessMessage('cập nhật địa chỉ thành công');
            this.editDiaChi = false;
          }
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
      this.tenKhachHang = selectedKhachHang.ten;
      this.loadDiaChi(this.idKhachHang);
    }
  }
  //========load voucher===========
  getVoucher(): void {
    this.banHangService.getVoucher().subscribe(
      data => {
        this.voucher = data.result.content;
        this.filteredVoucher = this.voucherControl.valueChanges.pipe(
          startWith(''),
          map(voucher => this._filterVoucher(voucher || '')),
        );
      },
      error => {
        console.log('lỗi khi lấy dữ liệu voucher', error);
      }
    );
  }
  private _filterVoucher(value: string): string[] {
    const filterVoucher = value.toLocaleLowerCase();
    return this.voucher.filter(voucher => (voucher.ten && voucher.ten.toLowerCase().includes(filterVoucher)))
  }
  onChangeVoucher(event: any) {
    const selectedTen = event.option.value;
    const selectedVoucher = this.voucher.find(voucher => voucher.ten === selectedTen);

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
        this.selectedVoucherId = selectedVoucher.id;
        // Tính tổng tiền sau khi áp dụng voucher
        this.tongTienSauVoucher = this.tongTienBanDau - finalDiscount;
        this.tienKhachDua = this.tongTienBanDau - finalDiscount;
      } else {
        // Nếu không đạt điều kiện, tổng tiền không thay đổi
        this.tongTienSauVoucher = this.tongTienBanDau;
        this.voucherControl.reset();
        this.showErrorMessage('Không thể áp dụng voucher này cho hóa đơn này!');
      }
    } else {
      // Nếu không có voucher được chọn, tổng tiền sau voucher bằng tổng tiền ban đầu
      this.tongTienSauVoucher = this.tongTienBanDau;
    }
  }
  getIdThongTinDonHang(id: number): void {
    this.router.navigate(['/thong-tin-don-hang', id]);
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
    this.myControl.reset();
    this.voucherControl.reset();
    this.hasError = true;
    this.hoTenNguoiNhan = '';
    this.soDienThoai = '';
    this.email = '';
    this.soNha = '';
    this.duong = '';
    this.phiVanChuyen = 0;
    this.selectedTinhThanh = '';
    this.selectedQuanHuyen = '';
    this.selectedPhuongXa = '';
    this.districts = []; // Xóa danh sách quận
    this.wards = [];     // Xóa danh sách phường
  }
  resetFormDiaChi(): void {
    this.hoTenNguoiNhan = '';
    this.soDienThoai = '';
    this.email = '';
    this.soNha = '';
    this.duong = '';
    this.phiVanChuyen = 0;
    this.selectedTinhThanh = '';
    this.selectedQuanHuyen = '';
    this.selectedPhuongXa = '';
    this.districts = [];
    this.wards = [];
  }
  //=======lấy id nhân viên==========
  getNhanVien(): void {
    this.banHangService.getNhanVien(this.authServie.getUsername()).subscribe(
      data => {
        this.idNhanVien = data.result.content.id;
      }
    )
  }
}

import { Component, OnInit } from '@angular/core';
import { GioHangService } from 'src/app/gio-hang/gio-hang-service.component';
import { SanPhamService } from 'src/app/san-pham/san-pham-service.component';
import { GiaoHangNhanhService } from 'src/app/dia-chi/giao-hang-nhanh.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-gio-hang',
  templateUrl: './gio-hang.component.html',
  styleUrls: ['./gio-hang.component.css']
})
export class GioHangComponent implements OnInit {
  chiTietGioHang: any[] = [];
  idKhachHang: string = '';
  urlAnh: string = '';
  tongTien: number = 0;
  giaTriGiam: number = 0;
  phiVanChuyen: number = 0;
  canThanhToan: number = 0;
  phiShip: number = 0;
  tenNguoiNhan: string = '';
  sdtNguoiNhan: string = '';
  emailNguoiNhan: string = '';
  diaChiNhanHang: string = '';
  selectedVoucherId: string = '';
  voucher: any[] = [];
  diaChis: any[] = [];
  selectedAddressId: number = 0;
  selectedPhuongXaName: string = '';
  selectedQuanHuyenName: string = '';
  selectedTinhThanhName: string = '';
  idThanhToan: string | number = '';
  soLuong: string = '';
  // địa chỉ kh
  provinces: any[] = []; // Danh sách tỉnh/thành
  districts: any[] = []; // Danh sách quận/huyện
  wards: any[] = []; // Danh sách phường/xã
  selectedTinhThanh: number = 0; // ID tỉnh/thành đã chọn
  selectedQuanHuyen: number = 0; // ID quận/huyện đã chọn
  selectedPhuongXa: number = 0; // Mã phường/xã đã chọn
  soNha: string = '';
  duong: string = '';
  vnpTransactionStatus: string | null = null;
  popup: boolean = false;
  errors: {
    tenNguoiNhan?: string;
    soNha?: string;
    duong?: string;
    selectedTinhThanh?: string;
    selectedQuanHuyen?: string;
    selectedPhuongXa?: string;
    emailNguoiNhan?: string;
    sdtNguoiNhan?: string;
  } = {};


  // Giả sử bạn sẽ lấy chi tiết giỏ hàng từ API và lưu lại vào đây
  idChiTietGioHang: number[] = [];

  constructor(private gioHangService: GioHangService,
    private sanPhamService: SanPhamService,
    private giaoHangNhanhService: GiaoHangNhanhService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.getdataAdress();
    this.onAddressInput();
    this.loadProvinces();
    this.loadvoucher();
    this.loadDiaChi();

    // Lấy idKhachHang từ localStorage khi component được khởi tạo
    this.idKhachHang = localStorage.getItem('id') || '';

    // Kiểm tra nếu có idKhachHang, gọi API để lấy giỏ hàng
    if (this.idKhachHang) {
      this.getAllGioHang(); // Lấy giỏ hàng từ API
    } else {
      this.getKhachHangLocal();
    }
    this.tinhTongTienSauVoucher(); // Tính tổng tiền sau khi áp dụng voucher
    // Xử lý queryParams từ VNPay
    this.route.queryParams.subscribe(params => {
      this.vnpTransactionStatus = params['vnp_TransactionStatus'];
      if (this.vnpTransactionStatus == '00' && !this.idKhachHang) {
        const request = this.thongTinThanhToan();
        this.xuLyThanhToanBinhThuong(request);
      }
    });
  }
  getKhachHangLocal(): void {
    // Nếu không có idKhachHang, lấy giỏ hàng từ localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    this.chiTietGioHang = cart.map((item: any) => ({
      ...item,
      checked: true
    }));
    this.updateTotalAmount();
    console.log('Giỏ hàng từ localStorage:', this.chiTietGioHang);
  }

  // Lấy tất cả giỏ hàng từ dịch vụ (dành cho khách hàng có idKhachHang)
  getAllGioHang(): void {
    if (this.idKhachHang) {
      this.gioHangService.getAllGioHang(this.idKhachHang).subscribe({
        next: (response) => {
          this.chiTietGioHang = response.result.content.map((item: any) => ({
            ...item
          }));
          this.updateTotalAmount();
          console.log('chi tiết giỏ hàng:', this.chiTietGioHang);
        },
        error: (err) => {
          console.error('Lỗi khi lấy giỏ hàng:', err);
        }
      });
    }
  }
  onChangCheck(id: number) {
    const idKh = localStorage.getItem('id');
    if (!idKh) {
      // Lấy giỏ hàng từ localStorage
      let cart = JSON.parse(localStorage.getItem('cart') || '[]');
      // Tìm sản phẩm trong giỏ hàng dựa vào id
      const itemIndex = cart.findIndex((item: any) => item.id === id);

      if (itemIndex !== -1) {
        // Nếu sản phẩm đã có trong giỏ hàng, đổi trạng thái 'trangThai'
        const item = cart[itemIndex];

        // Đổi trạng thái trangThai từ 'active' thành 'unactive' và ngược lại
        item.trangThai = item.trangThai === 'active' ? 'unactive' : 'active';

        // Lưu lại giỏ hàng vào localStorage sau khi thay đổi trạng thái
        localStorage.setItem('cart', JSON.stringify(cart));
      }
      this.getKhachHangLocal();
    } else {
      // Tiến hành gọi API để đồng bộ dữ liệu với máy chủ (nếu cần)
      this.gioHangService.changeCheck(id).subscribe(
        response => {
          this.getAllGioHang();
        },
        error => {
          console.log('Thất bại');
        }
      );

    }
  }

  // Hàm tính toán tổng tiền
  updateTotalAmount(): void {
    // Lọc các sản phẩm có trạng thái 'active'
    const activeItems = this.chiTietGioHang.filter(item => item.trangThai == 'active');

    // Kiểm tra nếu có ít nhất một sản phẩm có trạng thái 'active' và vnpTransactionStatus == '00'
    if (activeItems.length > 0) {
      this.tongTien = activeItems.reduce((total, item) => {
        this.idChiTietGioHang.push(item.id); // Thêm id vào mảng nếu sản phẩm có trạng thái 'active'
        return total + item.chiTietSanPham.donGia * item.soLuong;
      }, 0);

      this.canThanhToan = this.tongTien; // Cập nhật tổng tiền có thể thanh toán
      // Thực hiện thanh toán nếu thỏa mãn các điều kiện
      const request = this.thongTinThanhToan();
      if (this.vnpTransactionStatus == '00' && request) {
        this.xuLyThanhToanBinhThuong(request);
      }
    } else {
      console.log('Không có sản phẩm "active" hoặc trạng thái giao dịch không hợp lệ.');
    }
  }
  tinhTongTienSauVoucher(): number {
    return this.tongTien - this.giaTriGiam;
  }
  thongTinThanhToan(): any {
    this.onchangeAddressInput();
    // Ghép địa chỉ nhận hàng
    this.diaChiNhanHang =
      `${this.soNha || ''}, ${this.duong || ''}, ${this.selectedPhuongXaName || ''}, 
         ${this.selectedQuanHuyenName || ''}, ${this.selectedTinhThanhName || ''}`.trim();
    let gioHangRequests;
    const idKhString = localStorage.getItem('id');

    // Chuẩn bị dữ liệu cho giỏ hàng: chỉ lấy những mục được chọn
    if (idKhString) {
      gioHangRequests = this.chiTietGioHang
        .filter((item: any) => item.trangThai == 'active') // Lọc các mục đã chọn
        .map((item: any) => ({
          id: item.id,
          idChiTietSanPham: item.chiTietSanPham.id,
          soLuong: item.soLuong,
        }));
    } else {
      gioHangRequests = this.idChiTietGioHang.map((id: number) => ({
        id: 0,
        idChiTietSanPham: id,
        soLuong: this.getSoLuongById(id),
      }));
    }

    // Kiểm tra nếu không có mục nào được chọn
    if (!gioHangRequests || gioHangRequests.length === 0) {
      this.showErrorMessage('Vui lòng chọn ít nhất một sản phẩm để thanh toán!');
      return null;
    }

    // Chuẩn bị dữ liệu cho thanh toán
    const thanhToanRequest = {
      hoaDonRequest: {
        id: 0,
        idKhachHang: this.idKhachHang || 1,
        idNhanVien: 0,
        idVoucher: this.selectedVoucherId || null,
        idThanhToan: this.idThanhToan || 1,
        hinhThucThanhToan: 1,
        tongTienBanDau: this.tinhTongTienSauVoucher(),
        phiShip: this.phiVanChuyen || 0,
        giaTriGiam: this.giaTriGiam || 0,
        tongTienSauVoucher: this.tinhTongTienSauVoucher(),
        tenNguoiNhan: this.tenNguoiNhan || '',
        sdtNguoiNhan: this.sdtNguoiNhan || '',
        emailNguoiNhan: this.emailNguoiNhan || '',
        diaChiNhanHang: this.diaChiNhanHang || '',
        ngayNhanDuKien: new Date().toISOString(),
        thoiGianTao: new Date().toISOString(),
        giaoHang: 1,
        ghiChu: '',
        trangThai: '',
      },
      idChiTietGioHang: gioHangRequests.map((req: any) => req.idChiTietSanPham),
    };
    return {
      gioHangRequests,
      thanhToanRequest,
    };
  }
  validateForm(): boolean {
    let isValid = true;

    // Reset thông báo lỗi
    this.errors = {};

    // Biểu thức chính quy để kiểm tra ký tự đặc biệt hoặc số
    const specialCharOrNumberRegex = /[^a-zA-Z\u00C0-\u017F\s]/;

    // Validate tên người nhận
    if (!this.tenNguoiNhan || this.tenNguoiNhan.trim() === '') {
      this.errors.tenNguoiNhan = 'Vui lòng nhập tên người nhận.';
      isValid = false;
    } else if (specialCharOrNumberRegex.test(this.tenNguoiNhan)) {
      this.errors.tenNguoiNhan = 'Tên người nhận không được chứa ký tự đặc biệt hoặc số.';
      isValid = false;
    }

    const numberRegex = /^[0-9]+$/;

    // Validate số nhà
    if (!this.soNha || this.soNha.trim() === '') {
      this.errors.soNha = 'Vui lòng nhập số nhà.';
      isValid = false;
    } else if (!numberRegex.test(this.soNha)) {
      this.errors.soNha = 'Số nhà phải là một giá trị số.';
      isValid = false;
    }

    // Validate đường
    if (!this.duong || this.duong.trim() === '') {
      this.errors.duong = 'Vui lòng nhập tên đường.';
      isValid = false;
    }

    // Validate tỉnh/thành
    if (!this.selectedTinhThanh) {
      this.errors.selectedTinhThanh = 'Vui lòng chọn tỉnh/thành.';
      isValid = false;
    }
    // Validate quận/huyện
    if (!this.selectedQuanHuyen) {
      this.errors.selectedQuanHuyen = 'Vui lòng chọn quận/huyện.';
      isValid = false;
    }
    // Validate phường/xã
    if (!this.selectedPhuongXa) {
      this.errors.selectedPhuongXa = 'Vui lòng chọn phường/xã.';
      isValid = false;
    }

    // Validate email
    if (!this.emailNguoiNhan || !this.isValidEmail(this.emailNguoiNhan)) {
      this.errors.emailNguoiNhan = 'Email không hợp lệ.';
      isValid = false;
    }

    // Validate số điện thoại
    if (!this.sdtNguoiNhan || !this.isValidPhoneNumber(this.sdtNguoiNhan)) {
      this.errors.sdtNguoiNhan = 'Số điện thoại không hợp lệ.';
      isValid = false;
    }

    return isValid;
  }

  // Hàm kiểm tra định dạng email
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Hàm kiểm tra định dạng số điện thoại
  isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone);
  }

  getdataAdress() {
    this.tenNguoiNhan = localStorage.getItem('tenNguoiNhan') || '';
    this.soNha = localStorage.getItem('soNha') || '';
    this.duong = localStorage.getItem('duong') || '';
    this.selectedTinhThanhName = localStorage.getItem('selectedTinhThanh') || '';
    this.selectedQuanHuyenName = localStorage.getItem('selectedQuanHuyen') || '';
    this.selectedPhuongXaName = localStorage.getItem('selectedPhuongXa') || '';
    this.emailNguoiNhan = localStorage.getItem('emailNguoiNhan') || '';
    this.sdtNguoiNhan = localStorage.getItem('sdtNguoiNhan') || '';
    this.idThanhToan = localStorage.getItem('idThanhToan') || '1';
    this.phiVanChuyen = Number(localStorage.getItem('phiVanChuyen') || '');
    this.selectedVoucherId = localStorage.getItem('selectedVoucherId') || '';
    this.giaTriGiam = Number(localStorage.getItem('giaTriGiam') || '');
  }
  onchangeAddressInput() {
    // Lưu các trường vào localStorage
    localStorage.setItem('tenNguoiNhan', this.tenNguoiNhan);
    localStorage.setItem('soNha', this.soNha);
    localStorage.setItem('duong', this.duong);
    localStorage.setItem('selectedTinhThanh', this.selectedTinhThanhName);
    localStorage.setItem('selectedQuanHuyen', this.selectedQuanHuyenName);
    localStorage.setItem('selectedPhuongXa', this.selectedPhuongXaName);
    localStorage.setItem('emailNguoiNhan', this.emailNguoiNhan);
    localStorage.setItem('sdtNguoiNhan', this.sdtNguoiNhan);
    localStorage.setItem('idThanhToan', this.idThanhToan.toString());
    localStorage.setItem('phiVanChuyen', this.phiVanChuyen.toString());
    localStorage.setItem('selectedVoucherId', this.selectedVoucherId);
    localStorage.setItem('giaTriGiam', this.giaTriGiam.toString());
  }
  tienHanhXuLy(): void {
    // Gọi hàm validate
    if (!this.validateForm()) {
      this.showErrorMessage('Form không hợp lệ. Vui lòng kiểm tra lại!');
      return;
    }
    const title =
      'Bạn chắc chắn muốn đặt hóa đơn này chứ?\n' +
      '- Nếu bạn muốn đổi trả hoặc sản phẩm có vấn đề\n' +
      'vui lòng liên hệ cho chúng tôi: 09871234456';
    const isConfirmed = window.confirm(title);
    if (!isConfirmed) {
      return;
    }

    // Lấy thông tin thanh toán
    const request = this.thongTinThanhToan();
    if (!request) {
      return; // Dừng nếu không có sản phẩm được chọn
    }

    // Kiểm tra hình thức thanh toán
    if (this.idThanhToan == 2) {
      // Gọi API VNPay để lấy link thanh toán
      this.gioHangService.vnPay(this.tinhTongTienSauVoucher() + this.phiVanChuyen).subscribe({
        next: (response: any) => {
          const paymentUrl = response.paymentUrl;
          if (paymentUrl) {
            // Chuyển hướng người dùng tới VNPay
            window.location.href = paymentUrl;
          } else {
            this.showErrorMessage('Không lấy được URL thanh toán VNPay!');
          }
        },
        error: (error) => {
          console.error(error);
          this.showErrorMessage('Call API thanh toán VNPay thất bại');
        },
      });
      return;
    }

    // Nếu không thanh toán qua VNPay, xử lý thanh toán bình thường
    this.xuLyThanhToanBinhThuong(request);
  }


  xuLyThanhToanBinhThuong(request: any): void {
    this.gioHangService.xuly(request).subscribe({
      next: (response) => {
        this.showSuccessMessage('Thanh toán thành công!');

        // Lấy giỏ hàng hiện tại từ localStorage
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');

        // Danh sách các sản phẩm đã thanh toán (dựa trên idChiTietSanPham)
        const paidProductIds = request.gioHangRequests.map((item: any) => item.idChiTietSanPham);

        // Lọc giỏ hàng: Giữ lại các sản phẩm chưa thanh toán (loại bỏ sản phẩm đã thanh toán)
        const updatedCart = cart.filter((product: any) => !paidProductIds.includes(product.idChiTietSanPham));

        // Cập nhật lại localStorage với giỏ hàng mới
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        this.getAllGioHang();
        this.getKhachHangLocal();
        this.resetForm();
        this.removeAdressLocal();
      },
      error: (err) => {
        console.error(err);
        this.showErrorMessage('Xử lý thất bại! Vui lòng thử lại.');
      },
    });
  }
  removeAdressLocal() {
    // Xóa các mục đã lưu trong localStorage sau khi thanh toán thành công
    localStorage.removeItem('tenNguoiNhan');
    localStorage.removeItem('soNha');
    localStorage.removeItem('duong');
    localStorage.removeItem('selectedTinhThanh');
    localStorage.removeItem('selectedQuanHuyen');
    localStorage.removeItem('selectedPhuongXa');
    localStorage.removeItem('emailNguoiNhan');
    localStorage.removeItem('sdtNguoiNhan');
    localStorage.removeItem('idThanhToan');
    localStorage.removeItem('phiVanChuyen');
    localStorage.removeItem('selectedVoucherId');
    localStorage.removeItem('giaTriGiam');
  }
  // Hàm lấy số lượng sản phẩm theo id
  getSoLuongById(id: number): number {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    // Tìm item trong giỏ hàng của localStorage
    const item = cart.find((c: any) => c.idChiTietSanPham === id);

    // Log giỏ hàng từ localStorage
    console.log('Giỏ hàng trong localStorage:', JSON.stringify(cart, null, 2));

    if (item) {
      console.log('Sản phẩm tìm thấy trong localStorage:', item);
      return item.soLuong;
    }

    // Log chi tiết giỏ hàng từ API (this.chiTietGioHang)
    console.log('Chi tiết giỏ hàng:', this.chiTietGioHang);

    // Tìm item trong this.chiTietGioHang (dữ liệu từ API)
    const chiTietItem = this.chiTietGioHang.find((c: any) => c.id === id);

    // Kiểm tra lại item tìm được
    console.log('Sản phẩm tìm thấy trong this.chiTietGioHang:', chiTietItem);

    return chiTietItem ? chiTietItem.soLuong : 0;
  }



  themSanPham(id: number): void {
    const idKhString = localStorage.getItem('id'); // Lấy id dưới dạng chuỗi

    if (!idKhString) {
      // Nếu không có ID khách hàng, thao tác với giỏ hàng trong localStorage
      let cart = JSON.parse(localStorage.getItem('cart') || '[]'); // Giỏ hàng từ localStorage, nếu không có thì khởi tạo mảng rỗng

      // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      const existingProductIndex = cart.findIndex((item: any) => item.idChiTietSanPham === id);

      if (existingProductIndex !== -1) {
        // Nếu sản phẩm đã có trong giỏ hàng, cộng dồn số lượng
        cart[existingProductIndex].soLuong += 1; // Cộng thêm 1 số lượng sản phẩm
      } else {
        // Nếu sản phẩm chưa có trong giỏ hàng, thêm sản phẩm mới vào giỏ
        const newProduct = {
          id: 0, // ID của sản phẩm có thể để là 0 hoặc lấy từ dữ liệu sản phẩm khác
          idGioHang: 0, // ID giỏ hàng, có thể để mặc định là 0 hoặc lấy từ giỏ hàng
          idChiTietSanPham: id,
          soLuong: 1, // Số lượng ban đầu là 1
          urlAnh: '' // Đường dẫn ảnh sản phẩm có thể để rỗng hoặc lấy từ dữ liệu
        };
        cart.push(newProduct);
      }
      // Lưu lại giỏ hàng vào localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
      this.getKhachHangLocal();
    } else {
      // Nếu có ID khách hàng, gọi API để thêm sản phẩm vào giỏ hàng
      const idKh = Number(idKhString);
      if (isNaN(idKh)) {
        console.error('ID khách hàng không hợp lệ!');
        return;
      }

      const request = {
        id: 0,
        idGioHang: 0,
        idChiTietSanPham: id,
        soLuong: 1 // Đảm bảo số lượng mặc định là 1 nếu không có giá trị
      };

      // Gọi API thêm sản phẩm vào giỏ hàng của khách hàng
      this.gioHangService.themSanPham(idKh, request).subscribe(
        response => {
          this.getAllGioHang(); // Cập nhật giỏ hàng từ API nếu có
        },
        error => {
          this.handleError(error);
        }
      );
    }
  }

  xoaSanPham(id: number): void {
    const idKhString = localStorage.getItem('id'); // Lấy id khách hàng từ localStorage

    if (!idKhString) {
      // Nếu không có ID khách hàng, thao tác với giỏ hàng trong localStorage
      let cart = JSON.parse(localStorage.getItem('cart') || '[]'); // Giỏ hàng từ localStorage, nếu không có thì khởi tạo mảng rỗng

      // Tìm sản phẩm trong giỏ hàng
      const productIndex = cart.findIndex((item: any) => item.idChiTietSanPham === id);

      if (productIndex !== -1) {
        // Nếu sản phẩm có trong giỏ hàng, giảm số lượng đi 1
        if (cart[productIndex].soLuong > 1) {
          cart[productIndex].soLuong -= 1; // Giảm số lượng đi 1
        } else {
          // Nếu số lượng còn lại là 1, xóa sản phẩm khỏi giỏ hàng
          cart.splice(productIndex, 1);
        }
      }

      // Lưu lại giỏ hàng đã cập nhật vào localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
      this.getKhachHangLocal(); // Cập nhật lại giỏ hàng sau khi thay đổi
    } else {
      // Nếu có ID khách hàng, gọi API để xóa sản phẩm khỏi giỏ hàng
      const idKh = Number(idKhString);
      if (isNaN(idKh)) {
        console.error('ID khách hàng không hợp lệ!');
        return;
      }

      // Gọi API xóa sản phẩm khỏi giỏ hàng của khách hàng
      this.gioHangService.xoaSanPham(id).subscribe(
        response => {
          this.getAllGioHang(); // Cập nhật giỏ hàng từ API nếu có
        },
        error => {
          this.handleError(error); // Xử lý lỗi nếu có
        }
      );
    }
  }


  remove(id: number): void {
    // Hiển thị hộp thoại xác nhận trước khi xóa
    const isConfirmed = window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?');

    // Nếu người dùng xác nhận (nhấn "OK"), tiếp tục thực hiện xóa
    if (isConfirmed) {
      const idKhString = localStorage.getItem('id'); // Lấy id khách hàng từ localStorage

      if (!idKhString) {
        // Nếu không có ID khách hàng, thao tác với giỏ hàng trong localStorage
        let cart = JSON.parse(localStorage.getItem('cart') || '[]'); // Giỏ hàng từ localStorage, nếu không có thì khởi tạo mảng rỗng

        // Tìm và xóa sản phẩm khỏi giỏ hàng
        cart = cart.filter((item: any) => item.idChiTietSanPham !== id);

        // Lưu lại giỏ hàng đã cập nhật vào localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Hiển thị thông báo thành công
        this.showSuccessMessage('Sản phẩm đã được xóa khỏi giỏ hàng!');
        this.getKhachHangLocal();
      } else {
        // Nếu có ID khách hàng, gọi API để xóa sản phẩm khỏi giỏ hàng
        const idKh = Number(idKhString);
        if (isNaN(idKh)) {
          console.error('ID khách hàng không hợp lệ!');
          return;
        }

        // Gọi API xóa sản phẩm khỏi giỏ hàng của khách hàng
        this.gioHangService.remove(id).subscribe(
          response => {
            this.getAllGioHang(); // Cập nhật giỏ hàng từ API nếu có
          },
          error => {
            this.handleError(error); // Xử lý lỗi nếu có
          }
        );
      }
    }
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

  async confirmMessage(message: string): Promise<boolean> {
    const result = await Swal.fire({
      title: 'Thành Công',
      text: message,
      icon: 'warning',
      showCancelButton: false,
      confirmButtonText: 'QUay lại',
    });

    return result.isConfirmed;
  }

  loadvoucher(): void {

    this.gioHangService.getvoucher()
      .subscribe(
        (Response: any) => {
          //  console.log("phản hồi voucher từ api là",Response)
          this.voucher = Response.result.content;
          //  console.log("voucher: " ,this.voucher);
        }
      )
  }
  onChangeVoucher(event: any) {
    this.selectedVoucherId = event.target.value;
    console.log(this.voucher);

    const selectedVoucher = this.voucher.find(voucher => voucher.id == Number(this.selectedVoucherId));
    console.log(selectedVoucher);

    if (selectedVoucher) {
      let discountValue: number;

      // Kiểm tra kiểu giảm giá của voucher
      if (selectedVoucher.kieuGiamGia === '%') {
        // Nếu là phần trăm, tính giá trị giảm dựa trên phần trăm
        discountValue = this.tongTien * (selectedVoucher.giaTriVoucher / 100);
      } else {
        // Nếu là giảm tiền trực tiếp, lấy giá trị của voucher
        discountValue = selectedVoucher.giaTriVoucher;
      }

      // Đảm bảo giảm giá không vượt quá giá trị tối đa mà voucher cho phép
      const finalDiscount = Math.min(discountValue, selectedVoucher.giaTriGiamToiDa);

      // Kiểm tra điều kiện áp dụng voucher (nếu cần)
      if (this.tongTien >= selectedVoucher.giaTriHoaDonToiThieu) {
        this.selectedVoucherId = selectedVoucher.id;
        // Tính tổng tiền sau khi áp dụng voucher
        this.canThanhToan = this.tongTien - finalDiscount;
        this.giaTriGiam = finalDiscount;
      } else {
        // Nếu không đạt điều kiện, tổng tiền không thay đổi
        this.canThanhToan = this.tongTien;
        this.showErrorMessage('Không thể áp dụng voucher này cho hóa đơn này!');
      }
    } else {
      // Nếu không có voucher được chọn, tổng tiền sau voucher bằng tổng tiền ban đầu
      this.canThanhToan = this.tongTien;
    }
  }
  loadDiaChi(): void {

    this.gioHangService.getdiaChi()
      .subscribe(
        (Response: any) => {
          //  console.log("phản hồi voucher từ api là",Response)
          this.diaChis = Response.result.content.content;
          //  console.log("voucher: " ,this.voucher);
        }
      )
  }

  onPaymentMethodChange(event: any): void {
    this.idThanhToan = event.target.value; // Lấy giá trị của option được chọn
    console.log('idThanhToan:', this.idThanhToan); // In ra để kiểm tra
  }
  updateCanThanhToan(): void {
    this.canThanhToan = this.tongTien - this.giaTriGiam + this.phiVanChuyen;
  }



  // Xử lý khi tải danh sách tỉnh/thành
  loadProvinces(): void {
    this.giaoHangNhanhService.getProvinces().subscribe(
      (data: any) => {  // Sử dụng any cho dữ liệu trả về
        if (data && Array.isArray(data['data'])) {
          this.provinces = data['data'];  // Gán danh sách tỉnh/thành
        } else {
          console.error('Dữ liệu tỉnh/thành không đúng định dạng', data);
        }
      },
      error => {
        console.error('Lỗi khi tải danh sách tỉnh/thành:', error);
      }
    );
  }

  // Xử lý khi chọn tỉnh/thành
  onTinhThanhChange(event: any): void {
    const provinceId = Number(event.target.value);
    this.selectedTinhThanh = provinceId;

    // Lấy tên của tỉnh thành đã chọn từ danh sách tỉnh
    const selectedProvince = this.provinces.find(province => province.ProvinceID === provinceId);
    if (selectedProvince) {
      this.selectedTinhThanhName = selectedProvince.ProvinceName;
    }

    console.log('Selected Tỉnh Thành:', this.selectedTinhThanhName);  // Kiểm tra tên tỉnh thành

    this.giaoHangNhanhService.getDistricts(provinceId).subscribe(
      (data: any) => {
        if (data && Array.isArray(data['data'])) {
          this.districts = data['data'];
          this.wards = [];
          this.selectedQuanHuyen = 0;
          this.selectedPhuongXa = 0;
        } else {
          console.error('Dữ liệu quận/huyện không đúng định dạng', data);
          this.districts = [];
        }
      },
      error => {
        console.error('Lỗi khi tải danh sách quận/huyện:', error);
      }
    );
  }


  // Xử lý khi chọn quận/huyện
  onQuanHuyenChange(event: any): void {
    const districtId = Number(event.target.value);
    this.selectedQuanHuyen = districtId;

    // Lấy tên của quận huyện đã chọn từ danh sách quận
    const selectedDistrict = this.districts.find(district => district.DistrictID === districtId);
    if (selectedDistrict) {
      this.selectedQuanHuyenName = selectedDistrict.DistrictName;
    }

    console.log('Selected Quận Huyện:', this.selectedQuanHuyenName);  // Kiểm tra tên quận huyện đã chọn

    this.giaoHangNhanhService.getWards(districtId).subscribe(
      (data: any) => {
        if (data && Array.isArray(data['data'])) {
          this.wards = data['data'];
          this.selectedPhuongXa = 0;
        } else {
          console.error('Dữ liệu phường/xã không đúng định dạng', data);
          this.wards = [];
        }
      },
      error => {
        console.error('Lỗi khi tải danh sách phường/xã:', error);
      }
    );
  }


  // Xử lý khi chọn phường/xã
  onPhuongXaChange(event: any): void {
    const wardCode = event.target.value;
    this.selectedPhuongXa = wardCode;

    // Lấy tên của phường xã đã chọn từ danh sách phường/xã
    const selectedWard = this.wards.find(ward => ward.WardCode === wardCode);
    if (selectedWard) {
      this.selectedPhuongXaName = selectedWard.WardName;
    }

    console.log('Selected Phường Xã:', this.selectedPhuongXaName);  // Kiểm tra tên phường xã đã chọn

    this.calculateShippingFee();  // Ví dụ tính phí vận chuyển
  }




  // Tính phí vận chuyển
  calculateShippingFee(): void {
    if (this.selectedTinhThanh && this.selectedQuanHuyen && this.selectedPhuongXa && this.soNha && this.duong) {
      const shippingFeeData = {
        from_province_id: 201,
        from_district_id: 1482,
        to_province_id: Number(this.selectedTinhThanh),
        to_district_id: Number(this.selectedQuanHuyen),
        to_ward_code: this.selectedPhuongXa,
        weight: 800,
        length: 50,
        width: 30,
        height: 15,
        service_id: 53321,
        insurance_value: null,
        cod_failed_amount: null,
        coupon: null
      };
      console.log('Shipping Fee Data:', shippingFeeData);  // Kiểm tra dữ liệu gửi đi

      this.giaoHangNhanhService.createShippingOder(shippingFeeData).subscribe(
        response => {
          console.log('Phản hồi API:', response);
          this.phiVanChuyen = response.data?.total || 0;
        },
        error => {
          console.error('Lỗi khi tính phí vận chuyển:', error);
        }
      );
    }
  }



  // Xử lý khi nhập số nhà và đường
  onAddressInput(): void {
    this.calculateShippingFee(); // Tính phí vận chuyển khi thay đổi địa chỉ
  }



  //
  onAddressChange(event: any): void {
    const selectedAddressId = event.target.value;
    console.log('Selected Address ID:', selectedAddressId);

    const selectedAddress = this.diaChis.find(item => item.id === Number(selectedAddressId));
    console.log('Selected Address:', selectedAddress);

    if (selectedAddress) {
      const provinceName = selectedAddress.tinhThanh;
      console.log('Province Name:', provinceName); // Kiểm tra giá trị của provinceName
      const districtName = selectedAddress.quanHuyen;
      const wardName = selectedAddress.phuongXa;

      console.log('District Name:', districtName);
      console.log('Ward Name:', wardName);

      const province = this.giaoHangNhanhService.getProvinceIdByName(provinceName);
      province.subscribe(id => {
        console.log('ID Tỉnh: ', id); // Kiểm tra giá trị id trả về
        if (id) {
          console.log('Tìm thấy tỉnh thành');
        } else {
          console.log('Không tìm thấy tỉnh thành');
        }
      });
    }
  }


  calculateShippingFee2(provinceId: number, districtId: number, wardCode: string): void {
    if (provinceId && districtId && wardCode) {
      const shippingFeeData = {
        from_province_id: 201,  // Ví dụ: ID của tỉnh gửi
        from_district_id: 1482,  // Ví dụ: ID của quận gửi
        to_province_id: provinceId,  // ID tỉnh chọn
        to_district_id: districtId,  // ID quận chọn
        to_ward_code: wardCode,  // Mã phường xã
        weight: 800,
        length: 50,
        width: 30,
        height: 15,
        service_id: 53321,
        insurance_value: null,
        cod_failed_amount: null,
        coupon: null
      };

      this.giaoHangNhanhService.createShippingOder(shippingFeeData).subscribe(
        response => {
          this.phiVanChuyen = response.data?.total || 0;
        },
        error => {
          console.error('Lỗi khi tính phí vận chuyển:', error);
        }
      );
    }
  }

  // Hàm tra cứu ID tỉnh từ tên tỉnh
  getProvince(name: string): any {
    console.log('Received Province name:', name);  // In giá trị name nhận vào

    if (!name || typeof name !== 'string') {
      console.log('Province name is invalid or not a string:', name);
      return null; // Trả về null nếu không hợp lệ
    }

    const normalizedName = name.trim().toLowerCase();  // Gọi trim() sau khi kiểm tra
    const province = this.provinces.find(p => p.name.trim().toLowerCase() === normalizedName);

    if (!province) {
      console.log('Không tìm thấy tỉnh thành với tên:', name);
    }

    return province;
  }

  // Hàm tra cứu ID quận từ tên quận
  getDistrict(province: any, districtName: string): any {
    console.log('Received District name:', districtName);  // In giá trị districtName nhận vào

    if (!districtName || typeof districtName !== 'string') {
      console.log('District name is invalid or not a string:', districtName);
      return null;
    }

    const district = province.districts.find((d: any) => d.name.trim().toLowerCase() === districtName.trim().toLowerCase());

    if (!district) {
      console.log('Không tìm thấy quận với tên:', districtName);
    }

    return district;
  }

  // Hàm tra cứu ID phường từ tên phường
  getWard(district: any, wardName: string): any {
    console.log('Received Ward name:', wardName);  // In giá trị wardName nhận vào

    if (!wardName || typeof wardName !== 'string') {
      console.log('Ward name is invalid or not a string:', wardName);
      return null;
    }

    const ward = district.wards.find((w: any) => w.name.trim().toLowerCase() === wardName.trim().toLowerCase());

    if (!ward) {
      console.log('Không tìm thấy phường với tên:', wardName);
    }

    return ward;
  }

  resetForm() {
    // Reset giỏ hàng
    this.chiTietGioHang.forEach(gioHang => {
      gioHang.checked = false; // Hoặc giá trị mặc định khác
    });

    // Reset thông tin đơn hàng
    this.tenNguoiNhan = '';
    this.soNha = '';
    this.duong = '';
    this.selectedTinhThanh = 0;
    this.selectedQuanHuyen = 0;
    this.selectedPhuongXa = 0;
    this.emailNguoiNhan = '';
    this.sdtNguoiNhan = '';

    // Reset các thông tin giảm giá và vận chuyển
    this.tongTien = 0;
    this.giaTriGiam = 0;
    this.phiVanChuyen = 0;
    this.canThanhToan = 0;

    // Reset voucher
    this.selectedVoucherId = '';

    // Reset phương thức thanh toán
    this.idThanhToan = 1;

    // Nếu có các biến hoặc điều kiện cần reset khác, bạn có thể thêm vào đây.
  }

}

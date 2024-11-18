import { Component, OnInit } from '@angular/core';
import { GioHangService } from 'src/app/gio-hang/gio-hang-service.component';
import { SanPhamService } from 'src/app/san-pham/san-pham-service.component';
import Swal from 'sweetalert2';

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

  // Giả sử bạn sẽ lấy chi tiết giỏ hàng từ API và lưu lại vào đây
  idChiTietGioHang: number[] = [];

  constructor(private gioHangService: GioHangService,
    private sanPhamService: SanPhamService) { }

  ngOnInit(): void {
    // Lấy idKhachHang từ localStorage khi component được khởi tạo
    this.idKhachHang = localStorage.getItem('id') || '';

    // Kiểm tra nếu có idKhachHang, gọi API để lấy giỏ hàng
    if (this.idKhachHang) {
      this.getAllGioHang(); // Lấy giỏ hàng từ API
    } else {
      this.getKhachHangLocal();
    }

    this.tinhTongTienSauVoucher(); // Tính tổng tiền sau khi áp dụng voucher
  }
  getKhachHangLocal(): void {
    // Nếu không có idKhachHang, lấy giỏ hàng từ localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    this.chiTietGioHang = cart.map((item: any) => ({
      ...item,
      checked: false
    }));
    console.log('Giỏ hàng từ localStorage:', this.chiTietGioHang);
  }

  // Lấy tất cả giỏ hàng từ dịch vụ (dành cho khách hàng có idKhachHang)
  getAllGioHang(): void {
    if (this.idKhachHang) {
      this.gioHangService.getAllGioHang(this.idKhachHang).subscribe({
        next: (response) => {
          this.chiTietGioHang = response.result.content.map((item: any) => ({
            ...item,
            checked: false
          }));
        },
        error: (err) => {
          console.error('Lỗi khi lấy giỏ hàng:', err);
        }
      });
    }
  }

  onCheckboxChange(gioHang: any): void {
    if (gioHang.checked) {
      // Nếu checkbox được chọn, thêm ID và cộng tiền
      this.idChiTietGioHang.push(gioHang.id);
      this.tongTien += gioHang.chiTietSanPham.donGia * gioHang.soLuong;
      this.canThanhToan = this.tongTien;
    } else {
      // Nếu bỏ chọn, xóa ID và trừ tiền
      const index = this.idChiTietGioHang.indexOf(gioHang.id);
      if (index > -1) {
        this.idChiTietGioHang.splice(index, 1);
      }
      this.tongTien -= gioHang.chiTietSanPham.donGia * gioHang.soLuong;
    }
  }
  tinhTongTienSauVoucher(): number {
    return this.tongTien - this.giaTriGiam + this.phiShip;
  }

  luuKhachHang(): void {
    // Lấy dữ liệu giỏ hàng từ localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    if (cart.length > 0) {
      this.gioHangService.luuLocalStogate(cart).subscribe({
        next: (response) => {
          console.log('Lưu giỏ hàng thành công:', response);
        },
        error: (err) => {
          console.error('Lỗi khi lưu giỏ hàng:', err);
        },
      });
    } else {
      this.showWarningMessage('Giỏ hàng trống, không thể lưu!');
    }
  }
  // Xử lý khi người dùng gửi đơn hàng (thanh toán)
  onSubmit(): void {
    if (!this.idKhachHang) {
      // Nếu idKhachHang không tồn tại, gọi hàm lưu giỏ hàng và tiếp tục thanh toán sau khi lưu xong
      this.luuKhachHang();
      this.tienHanhThanhToan();
    }

    // Nếu idKhachHang tồn tại, tiến hành thanh toán ngay
    this.tienHanhThanhToan();
  }
  tienHanhThanhToan(): void {
    // Kiểm tra nếu chi tiết giỏ hàng và idChiTietGioHang hợp lệ
    if (this.idChiTietGioHang.length > 0) {
      const request = {
        hoaDonRequest: {
          id: 0,
          idKhachHang: this.idKhachHang || 1,
          idNhanVien: 0,
          idVoucher: 0,
          idThanhToan: 1,
          hinhThucThanhToan: 1,
          tongTienBanDau: this.tongTien || 0,
          phiShip: this.phiShip || 0,
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
        idChiTietGioHang: this.idChiTietGioHang || [0],
      };

      this.gioHangService.thanhToan(request).subscribe({
        next: (response) => {
          this.showSuccessMessage('Thanh toán thành công!');
          this.getAllGioHang();
          // Xóa giỏ hàng khỏi localStorage
          localStorage.removeItem('cart');
          console.log('Giỏ hàng đã được xóa khỏi localStorage.');
          this.getKhachHangLocal();
        },
        error: (err) => {
          this.showErrorMessage('Thanh toán thất bại!');
          console.error(err);
        },
      });
    } else {
      this.showWarningMessage('Vui lòng kiểm tra lại giỏ hàng và thông tin thanh toán!');
    }
  }

  tienHanhXuLy(): void {
    const gioHangRequests = this.idChiTietGioHang.map((id: number) => ({
      idChiTietSanPham: id,
      soLuong: this.getSoLuongById(id), // Hàm lấy số lượng sản phẩm
    }));

    const thanhToanRequest = {
      hoaDonRequest: {
        id: 0,
        idKhachHang: this.idKhachHang || 1,
        idNhanVien: 0,
        idVoucher: 0,
        idThanhToan: 1,
        hinhThucThanhToan: 1,
        tongTienBanDau: this.tongTien || 0,
        phiShip: this.phiShip || 0,
        giaTriGiam: this.giaTriGiam || 0,
        tongTienSauVoucher: this.tinhTongTienSauVoucher(),
        tenNguoiNhan: this.tenNguoiNhan || '',
        sdtNguoiNhan: this.sdtNguoiNhan || '',
        emailNguoiNhan: this.emailNguoiNhan || 'hatung18102004@gmail.com',
        diaChiNhanHang: this.diaChiNhanHang || '',
        ngayNhanDuKien: new Date().toISOString(),
        thoiGianTao: new Date().toISOString(),
        giaoHang: 1,
        ghiChu: '',
        trangThai: '',
      },
      idChiTietGioHang: this.idChiTietGioHang || [0],
    };

    const request = {
      gioHangRequests,
      thanhToanRequest,
    };

    // Gọi service để xử lý
    this.gioHangService.xuly(request).subscribe({
      next: (response) => {
        this.showSuccessMessage('Thanh toán thành công!');
        this.getAllGioHang();
        localStorage.removeItem('cart');
        this.getKhachHangLocal();
      },
      error: (err) => {
        this.showErrorMessage('Xử lý thất bại! Vui lòng thử lại.');
        console.error(err);
      },
    });
  }

  // Hàm lấy số lượng sản phẩm theo id (giả sử cart là mảng object lưu trong localStorage)
  getSoLuongById(id: number): number {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const item = cart.find((c: any) => c.idChiTietSanPham === id);
    return item ? item.soLuong : 0;
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
 }

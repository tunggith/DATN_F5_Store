import { Component, OnInit } from '@angular/core';
import { GioHangService } from 'src/app/gio-hang/gio-hang-service.component';
import { SanPhamService } from 'src/app/san-pham/san-pham-service.component';
import {GiaoHangNhanhService} from 'src/app/dia-chi/giao-hang-nhanh.service';
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
  voucher: any[] = [];
  diaChis:any[] = [];
  selectedAddressId: number = 0;

  // địa chỉ kh
    provinces: any[] = []; // Danh sách tỉnh/thành
  districts: any[] = []; // Danh sách quận/huyện
  wards: any[] = []; // Danh sách phường/xã
  selectedTinhThanh: number=0; // ID tỉnh/thành đã chọn
  selectedQuanHuyen: number=0; // ID quận/huyện đã chọn
  selectedPhuongXa: number=0; // Mã phường/xã đã chọn
  soNha: string = '';
  duong: string = '';


  // Giả sử bạn sẽ lấy chi tiết giỏ hàng từ API và lưu lại vào đây
  idChiTietGioHang: number[] = [];

  constructor(private gioHangService: GioHangService,
    private sanPhamService: SanPhamService,
  private giaoHangNhanhService:GiaoHangNhanhService) { }

  ngOnInit(): void {
    
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

  // Xử lý khi người dùng gửi đơn hàng (thanh toán)
  onSubmit(): void {
    // Kiểm tra nếu chi tiết giỏ hàng và idChiTietGioHang hợp lệ
    if (this.idChiTietGioHang.length > 0) {
      const request = {
        hoaDonRequest: {
          id: 0,
          idKhachHang: this.idKhachHang || 0,
          idNhanVien: 0,
          idVoucher: 0,
          idThanhToan: 0,
          hinhThucThanhToan: 2,
          ma: '',
          tongTienBanDau: this.tongTien || 0,
          phiShip: this.phiShip || 0,
          giaTriGiam: this.giaTriGiam || 0,
          tongTienSauVoucher: this.tinhTongTienSauVoucher(),
          tenNguoiNhan: this.tenNguoiNhan || "string",
          sdtNguoiNhan: this.sdtNguoiNhan || "string",
          emailNguoiNhan: this.emailNguoiNhan || "string",
          diaChiNhanHang: this.diaChiNhanHang || "string",
          ngayNhanDuKien: new Date().toISOString(),
          thoiGianTao: new Date().toISOString(),
          giaoHang: 1,
          ghiChu: '',
          trangThai: ''
        },
        idChiTietGioHang: this.idChiTietGioHang || [0]
      };

      this.gioHangService.thanhToan(request).subscribe({
        next: (response) => {
          this.showSuccessMessage('Thanh toán thành công!');
          this.getAllGioHang();
        },
        error: (err) => {
          this.showErrorMessage('Thanh toán thất bại!');
          console.error(err);
        }
      });
    } else {
      this.showWarningMessage('Vui lòng kiểm tra lại giỏ hàng và thông tin thanh toán!');
    }
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
  console.log('Selected Tỉnh Thành:', this.selectedTinhThanh);  // Kiểm tra giá trị tỉnh thành đã chọn

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
  console.log('Selected Quận Huyện:', this.selectedQuanHuyen);  // Kiểm tra giá trị quận huyện đã chọn

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
  this.selectedPhuongXa = event.target.value;
  console.log('Selected Phường Xã:', this.selectedPhuongXa);  // Kiểm tra giá trị phường xã đã chọn
  this.calculateShippingFee();
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





}

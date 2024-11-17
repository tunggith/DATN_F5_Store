import { Component, OnInit } from '@angular/core';
import { SanPhamService } from 'src/app/san-pham/san-pham-service.component';
import { GioHangService } from 'src/app/gio-hang/gio-hang-service.component';
import { CartItem } from 'src/app/san-pham/cart-item.model';

@Component({
  selector: 'app-san-pham',
  templateUrl: './san-pham.component.html',
  styleUrls: ['./san-pham.component.css']
})
export class SanPhamComponent implements OnInit {
  ThuongHieuList: any[] = [];
  xuatXuList: any[] = [];
  sizeList: any[] = [];
  mauSacList: any[] = [];
  gioiTinhList: any[] = [];
  sanPhamPage: any[] = [];
  totalPages: number[] = []; // Mảng chứa các số trang
  totalElements: number = 0; // Tổng số sản phẩm
  // Khai báo page và size trước
  page: number = 0;
  size: number = 10;

  // khai báo biến chọn màu
  selectedColors: string = "";
  selectedSizes: string = "";
  selectedGioiTinhs: string = "";
  selectedXuatXu: string = "";
  selectThuongHieu: string = "";
// Biến để kiểm soát trạng thái mở rộng/thu lại
  isOpen: boolean = false;
  isSizeOpen: boolean = false;
  isGioiTinhOpen: boolean = false;
  isXuatXuOpen: boolean = false;
  isthuongHieuOpen: boolean = false;



  // gio hang
  idgh: number = 0;


  constructor(private sanPhamService: SanPhamService,
    private GioHangService : GioHangService
  ) { }
//====================== hàm chạy ========================
  ngOnInit(): void {
    this.loadData();
  }
//===================== hàm chạy end========================

  //==================== hàm loadata ================
      loadData() :void{
        this.loadXuatXu();
        this.loadSize();
        this.loadMauSac();
        this.loadGioiTinh();
        this.loadSanPhamPhanTrang();
        this.loadThuongHieu();
        this.loadSanPham2()
      }
  // ============= hàm loadata end===============

  loadXuatXu(): void {
    this.sanPhamService.getXuatXu().subscribe(
      (response: any) => {
        console.log('Phản hồi API Xuat Xu:', response);
        this.xuatXuList = response.result.content;
        console.log('Danh sách Xuất Xứ đã tải:', this.xuatXuList);
      },
      (error) => {
        console.error('Lỗi khi tải danh sách Xuất Xứ:', error);
      }
    );
  }

  loadThuongHieu(): void {
    this.sanPhamService.getThuongHieu().subscribe(
      (response: any) => {
        console.log('Phản hồi API thương hiệu:', response);
        this.ThuongHieuList = response.result.content;
        console.log('Danh sách thương hiệu đã tải:', this.ThuongHieuList);
      },
      (error) => {
        console.error('Lỗi khi tải danh sách thương hiệu:', error);
      }
    );
  }
  loadSize(): void {
    this.sanPhamService.getSize().subscribe(
      (response: any) => {
        console.log('Phản hồi API Size:', response);
        this.sizeList = response.result.content;
        console.log('Danh sách Size đã tải:', this.sizeList);
      },
      (error) => {
        console.error('Lỗi khi tải danh sách Size:', error);
      }
    );
  }

  loadMauSac(): void {
    this.sanPhamService.getMauSac().subscribe(
      (response: any) => {
        console.log('Phản hồi API Mau Sac:', response);
        this.mauSacList = response.result.content;
        console.log('Danh sách Màu Sắc đã tải:', this.mauSacList);
      },
      (error) => {
        console.error('Lỗi khi tải danh sách Màu Sắc:', error);
      }
    );
  }

  loadGioiTinh(): void {
    this.sanPhamService.getGioiTinh().subscribe(
      (response: any) => {
        console.log('Phản hồi API Gioi Tinh:', response);
        this.gioiTinhList = response.result.content;
        console.log('Danh sách Giới Tính đã tải:', this.gioiTinhList);
      },
      (error) => {
        console.error('Lỗi khi tải danh sách Giới Tính:', error);
      }
    );
  }

  loadSanPhamPhanTrang(): void {
    this.sanPhamService.getSanPhamPhanTrang(this.page, this.size).subscribe(
      (response: any) => {
        console.log('Phản hồi API Sản Phẩm Phân Trang:', response);
        if (response && response.content) {
          this.sanPhamPage = response.content;
          this.totalElements = response.totalElements;
          this.calculateTotalPages(); // Tính tổng số trang sau khi nhận dữ liệu
        } else {
          console.log('Không có dữ liệu trong response.content');
        }
      },
      (error) => {
        console.error('Lỗi khi tải danh sách Sản Phẩm Phân Trang:', error);
      }
    );
  }

  changePage(page: number, event: MouseEvent) {
    event.preventDefault(); // Ngừng hành động mặc định của thẻ <a>
  
    // Kiểm tra xem trang có hợp lệ không
    if (page >= 0 && page < this.totalPages.length) {
      console.log('Chuyển trang:', page);
      this.page = page;
      this.loadSanPham2(); // Gọi lại hàm loadSanPham2 để cập nhật sản phẩm theo trang
    }
  }
  
  calculateTotalPages(): void {
    // Tính tổng số trang dựa trên tổng số sản phẩm và kích thước trang
    const totalPages = Math.ceil(this.totalElements / this.size);
    this.totalPages = Array.from({ length: totalPages }, (_, i) => i); // Tạo mảng số trang [0, 1, 2, ...]
  }
  

  sanPhamList: any[] =[]
  giaMin: number = 0;
  giaMax: number = 9999999;
  loadSanPham2(): void {
    // Chuyển các giá trị về kiểu string, nếu không có giá trị thì trả về chuỗi rỗng
    const gioiTinh = this.selectedGioiTinhs || '';
    const thuongHieu = this.selectThuongHieu || '';
    const xuatXu = this.selectedXuatXu || '';
    const mauSac = this.selectedColors || '';
    const kichThuoc = this.selectedSizes || '';
  
    // Gọi API với các tham số đã chuyển đổi thành string
    this.sanPhamService.getSanPhamloc(
      gioiTinh,
      thuongHieu,
      xuatXu,
      this.giaMin,
      this.giaMax,
      mauSac,
      kichThuoc,
      this.page,
      this.size
    ).subscribe(response => {
      console.log("Sản phẩm lọc: ", response);
      this.sanPhamList = response.content;  // Chỉ gán `content` vào `sanPhamList`
      this.totalElements = response.totalElements;  // Cập nhật tổng số sản phẩm
      this.calculateTotalPages();  // Cập nhật số trang nếu cần
      console.log("Sản phẩm lọc đã cập nhật: ", this.sanPhamList);
    });
  }
  
  
  
  

// ==============================================================================================================
//                                     XỬ LÝ MỞ RỘNG/THU GỌN VÀ CHỌN THUỘC TÍNH
// ==============================================================================================================
//
// Các hàm để quản lý việc mở rộng/thu gọn danh sách và xử lý lựa chọn của người dùng cho các thuộc tính sản phẩm
// (màu sắc, kích thước, xuất xứ, giới tính).
// Mỗi hàm toggle kiểm soát trạng thái mở/thu gọn của một danh sách thuộc tính cụ thể,
// trong khi mỗi hàm xử lý thay đổi sẽ quản lý việc chọn và bỏ chọn các thuộc tính riêng lẻ,
// đồng thời ghi lại các giá trị đã chọn để kiểm tra.
//
// --------------------------------------------------------------------------------------------------------------
//
// Hàm Toggle cho Danh sách Thuộc tính
// --------------------------------------------------------------------------------------------------------------

  // Hàm xử lý khi nhấn vào tiêu đề để mở rộng/thu lại
  toggleColorList(): void {
    this.isOpen = !this.isOpen; // Đổi trạng thái mở rộng/thu lại
  }

  // Hàm xử lý khi nhấn vào tiêu đề để mở rộng/thu lại phần kích thước
  toggleSizeList(): void {
    this.isSizeOpen = !this.isSizeOpen; // Đổi trạng thái mở rộng/thu lại
  }

  toggleXuatXuList(): void {
    this.isXuatXuOpen = !this.isXuatXuOpen; // Đổi trạng thái mở rộng/thu lại
  }

  toggleGioiTinhList(): void {
    this.isGioiTinhOpen = !this.isGioiTinhOpen; // Đổi trạng thái mở rộng/thu lại
  }

  togglethuonghieuList(): void {
    this.isthuongHieuOpen = !this.isthuongHieuOpen; // Đổi trạng thái mở rộng/thu lại
  }

  onColorChange(color: any): void {
    if (this.selectedColors === color.id) {
      this.selectedColors = "";  // Bỏ chọn nếu đã chọn lại
    } else {
      this.selectedColors = color.id;  // Chọn mới
    }

    console.log('Màu sắc đã chọn:', this.selectedColors);
    this.loadSanPham2();
  }
  
  onthuongHieuChage(ThuongHieu: any): void {
    if (this.selectThuongHieu === ThuongHieu.id) {
      this.selectThuongHieu = "";  // Bỏ chọn nếu đã chọn lại
    } else {
      this.selectThuongHieu = ThuongHieu.id;  // Chọn mới
       
    }
    console.log('Thương hiệu đã chọn:', this.selectThuongHieu);
    this.loadSanPham2();
  }
  
  onSizeChange(size: any): void {
    if (this.selectedSizes === size.id) {
      this.selectedSizes = "";  // Bỏ chọn nếu đã chọn lại
    } else {
      this.selectedSizes = size.id;  // Chọn mới
     
    }
    console.log('Kích thước đã chọn:', this.selectedSizes);
    this.loadSanPham2();
  }
  
  onGioiTinhChange(GioiTinh: any): void {
    if (this.selectedGioiTinhs === GioiTinh.id) {
      this.selectedGioiTinhs = "";  // Bỏ chọn nếu đã chọn lại
    } else {
      this.selectedGioiTinhs = GioiTinh.id;  // Chọn mới
   
    }
    console.log('Giới tính đã chọn:', this.selectedGioiTinhs);
    this.loadSanPham2();
  }
  
  onXuatXuChange(XuatXu: any): void {
    if (this.selectedXuatXu === XuatXu.id) {
      this.selectedXuatXu = "";  // Bỏ chọn nếu đã chọn lại
    } else {
      this.selectedXuatXu = XuatXu.id;  // Chọn mới
      
    }
    console.log('Xuất xứ đã chọn:', this.selectedXuatXu);
    this.loadSanPham2();
  }


  clearColor(): void {
    this.selectedColors = "";  // Bỏ chọn màu sắc
    console.log('Đã bỏ chọn màu sắc');
  }
  
  clearThuongHieu(): void {
    this.selectThuongHieu = "";  // Bỏ chọn thương hiệu
    console.log('Đã bỏ chọn thương hiệu');
     
  }
  
  clearSize(): void {
    this.selectedSizes = "";  // Bỏ chọn kích thước
    console.log('Đã bỏ chọn kích thước');
  }
  
  clearGioiTinh(): void {
    this.selectedGioiTinhs = "";  // Bỏ chọn giới tính
    console.log('Đã bỏ chọn giới tính');
  }
  
  clearXuatXu(): void {
    this.selectedXuatXu = "";  // Bỏ chọn xuất xứ
    console.log('Đã bỏ chọn xuất xứ');
  }



formattedgiaMin: string = ''; // Giá trị hiển thị đã định dạng của giaMin
formattedgiaMax: string = ''; // Giá trị hiển thị đã định dạng của giaMax

errorMsg: string = ''; // Thông báo lỗi

// Hàm xử lý khi người dùng nhập giá trị min
// Hàm xử lý khi người dùng nhập giá trị min
// Hàm xử lý khi người dùng nhập giá trị min
onGiaMin(event: any): void {
  const rawValue = event.target.value.replace(/\D/g, ''); // Loại bỏ tất cả ký tự không phải số
  let inputValue = parseInt(rawValue, 10) || 0; // Chuyển đổi sang số nguyên

  // Xử lý khi trường nhập bị xóa
  if (event.target.value.trim() === '') {
    this.giaMin = 0; // Gán giá trị mặc định
    this.formattedgiaMin = ''; // Hiển thị trống
    this.errorMsg = ''; // Không hiển thị lỗi
    this.loadSanPham2(); // Cập nhật sản phẩm
    return;
  }

  // Kiểm tra điều kiện
  if (inputValue > this.giaMax) {
    this.errorMsg = 'Giá trị tối thiểu không được lớn hơn giá trị tối đa.';
    inputValue = this.giaMax; // Không cho phép min lớn hơn max
  } else if (inputValue < 0) {
    inputValue = 0; // Không cho phép số âm
    this.errorMsg = 'Giá trị tối thiểu không được nhỏ hơn 0.';
  } else if (inputValue > 999000000) {
    inputValue = 999000000; // Giới hạn số lớn nhất là 999 triệu
    this.errorMsg = 'Giá trị tối thiểu không được lớn hơn 999 triệu.';
  } else {
    this.errorMsg = ''; // Xóa thông báo lỗi nếu hợp lệ
  }

  this.giaMin = inputValue; // Gán giá trị hợp lệ
  this.formattedgiaMin = this.formatNumber(this.giaMin); // Cập nhật hiển thị
  event.target.value = this.formattedgiaMin; // Hiển thị giá trị đã định dạng trong input
  this.loadSanPham2(); // Gọi API tự động tìm kiếm
}

// Hàm xử lý khi người dùng nhập giá trị max
onGiaMax(event: any): void {
  const rawValue = event.target.value.replace(/\D/g, ''); // Loại bỏ tất cả ký tự không phải số
  let inputValue = parseInt(rawValue, 10) || 0; // Chuyển đổi sang số nguyên

  // Xử lý khi trường nhập bị xóa
  if (event.target.value.trim() === '') {
    this.giaMax = 999000000; // Gán giá trị mặc định
    this.formattedgiaMax = ''; // Hiển thị trống
    this.errorMsg = ''; // Không hiển thị lỗi
    this.loadSanPham2(); // Cập nhật sản phẩm
    return;
  }

  // Kiểm tra điều kiện
  if (inputValue < this.giaMin) {
    this.errorMsg = 'Giá trị tối đa không được nhỏ hơn giá trị tối thiểu.';
    inputValue = this.giaMin; // Không cho phép max nhỏ hơn min
  } else if (inputValue < 0) {
    inputValue = 0; // Không cho phép số âm
    this.errorMsg = 'Giá trị tối đa không được nhỏ hơn 0.';
  } else if (inputValue > 999000000) {
    inputValue = 999000000; // Giới hạn số lớn nhất là 999 triệu
    this.errorMsg = 'Giá trị tối đa không được lớn hơn 999 triệu.';
  } else {
    this.errorMsg = ''; // Xóa thông báo lỗi nếu hợp lệ
  }

  this.giaMax = inputValue; // Gán giá trị hợp lệ
  this.formattedgiaMax = this.formatNumber(this.giaMax); // Cập nhật hiển thị
  event.target.value = this.formattedgiaMax; // Hiển thị giá trị đã định dạng trong input
  this.loadSanPham2(); // Gọi API tự động tìm kiếm
}

// Hàm định dạng số có dấu chấm
formatNumber(value: number): string {
  return value.toLocaleString('vi-VN'); // Định dạng số kiểu Việt Nam
}
// ==============================================================================================================
//                                    KẾT THÚC XỬ LÝ MỞ RỘNG/THU GỌN VÀ CHỌN THUỘC TÍNH
// ==============================================================================================================



// add sản phẩm vào giỏ hàng 

  // thêm sản phẩm vào giỏ hàng
  addToCart(productId: number): void {
    console.log('id sản phẩm được thêm', productId);
    const soLuongMoi = 1;
    const id = localStorage.getItem('id') || ''; // Lấy ID khách hàng từ localStorage
  
    if (id !== '') {
      // Nếu có ID khách hàng
      this.GioHangService.getHoaDonByKhachHang(id).subscribe({
        next: (response) => {
          if (response && response.status) {
            const hoaDons = response.result.content.content; // Danh sách hóa đơn
            if (hoaDons && hoaDons.length > 0) {
              this.idgh = hoaDons[0].id; // Lấy ID hóa đơn đầu tiên
              this.addToCartWithHoaDon(productId, this.idgh, soLuongMoi); // Thêm sản phẩm vào giỏ hàng
            } else {
              this.createHoaDon(productId, soLuongMoi);
            }
          } else {
            alert('Không tìm thấy khách hàng');
          }
        },
        error: (error) => console.error('Lỗi khi gọi API lấy hóa đơn:', error),
      });
    } else {
      // Nếu không có ID khách hàng, lưu vào localStorage
      this.addToLocalCart(productId, soLuongMoi);
    }
  }
  


// tạo mới hóa đơn
createHoaDon(productId: number, soLuongMoi: number) {
  const khachHangId = localStorage.getItem('id') || ''; // Lấy ID khách hàng từ localStorage
  if (!khachHangId) {
    console.error('Không tìm thấy ID khách hàng trong localStorage.');
    alert('Bạn cần đăng nhập để thực hiện thao tác này.');
    return;
  }
  const newGioHang = {
    khachHang: { id: khachHangId }, // Định dạng dữ liệu phù hợp với BE
    thoiGianTao: new Date(),
  };
  this.GioHangService.createGioHang(newGioHang).subscribe({
    next: (response) => {
      if (response && response.status) {
        this.idgh = response.result.id; // Lấy ID giỏ hàng vừa tạo
        console.log('Giỏ hàng mới được tạo:', this.idgh);
        this.addToCartWithHoaDon(productId, this.idgh, soLuongMoi); // Thêm sản phẩm vào giỏ hàng
      } else {
        console.error('Không thể tạo giỏ hàng mới.');
      }
    },
    error: (error) => {
      console.error('Lỗi khi tạo giỏ hàng mới:', error);
      alert('Không thể tạo giỏ hàng mới.');
    },
  });
}


addToCartWithHoaDon(productId: number, hoaDonId: number, soLuongMoi: number) {
  this.GioHangService.getByGh(hoaDonId).subscribe({
    next: (response) => {
      if (response && response.status) {
        const cart: CartItem[] = response.result.content.content;
        const productInCart = cart.find((item: CartItem) => item.id === productId);
        let soLuong = soLuongMoi;
        if (productInCart) {
          soLuong = productInCart.soLuong + soLuongMoi;
        }
        this.GioHangService.addToCart2(hoaDonId, productId, soLuong).subscribe({
          next: (response) => {
            alert('Sản phẩm đã được thêm vào giỏ hàng!');
          },
          error: (error) => {
            alert('Số lượng sản phẩm trong giỏ hàng đã lớn hơn số lượng hiện tại sản phẩm đang có');
          },
        });
      } 
    },
    error: (error) => {
      alert('Giỏ hàng đã được tạo thành công !');
    },
  });
}

addToLocalCart(productId: number, soLuongMoi: number): void {
  // Kiểm tra xem có idGiỏHàng trong localStorage chưa
  let idGioHang = localStorage.getItem('idGioHang');
  if (!idGioHang) {
    // Nếu chưa có idGiỏHàng, tạo mới một số ngẫu nhiên từ 1 đến 9 và lưu vào localStorage
    idGioHang = (Math.floor(Math.random() * 9) + 1).toString(); // Tạo ID giỏ hàng ngẫu nhiên từ 1 đến 9
    localStorage.setItem('idGioHang', idGioHang);
  }

  // Lấy giỏ hàng hiện tại từ localStorage
  const localCart = JSON.parse(localStorage.getItem('localCart') || '[]');

  // Kiểm tra sản phẩm đã tồn tại trong giỏ chưa
  const productIndex = localCart.findIndex((item: any) => item.productId === productId);
  if (productIndex > -1) {
    // Nếu đã tồn tại, tăng số lượng
    localCart[productIndex].soLuong += soLuongMoi;
  } else {
    // Nếu chưa, thêm sản phẩm mới
    localCart.push({ productId, soLuong: soLuongMoi });
  }

  // Lưu lại giỏ hàng vào localStorage
  localStorage.setItem('localCart', JSON.stringify(localCart));

  // Lưu thời gian hết hạn (sau 1 ngày)
  const expiration = new Date();
  expiration.setDate(expiration.getDate() + 1); // Thêm 1 ngày
  localStorage.setItem('localCartExpiration', expiration.toISOString());

  alert('Sản phẩm đã được thêm vào giỏ hàng tạm thời!');
}


checkAndClearExpiredLocalCart(): void {
  const expiration = localStorage.getItem('localCartExpiration');
  if (expiration) {
    const now = new Date();
    const expirationDate = new Date(expiration);

    if (now > expirationDate) {
      // Xóa giỏ hàng tạm thời nếu đã hết hạn
      localStorage.removeItem('localCart');
      localStorage.removeItem('localCartExpiration');
      console.log('Dữ liệu giỏ hàng tạm thời đã được xóa vì hết hạn.');
    }
  }
}
}

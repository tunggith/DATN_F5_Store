import { Component, OnInit } from '@angular/core';
import { SanPhamService } from 'src/app/san-pham/san-pham-service.component';
import { TrangChuServiceComponent } from 'src/app/trang-chu/trang-chu.service.component';
import { GioHangService } from 'src/app/gio-hang/gio-hang-service.component';
import { CartItem } from 'src/app/san-pham/cart-item.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-san-pham',
  templateUrl: './san-pham.component.html',
  styleUrls: ['./san-pham.component.css']
})
export class SanPhamComponent implements OnInit {
  ThuongHieuList: any[] = [];
  xuatXuList: any[] = [];
  sizeList: any[] = [];
  sizeListSp: any[] = [];
  mauSacList: any[] = [];
  mauSacListsp: any[] = [];
  gioiTinhList: any[] = [];
  sanPhamPage: any[] = [];
  totalPages: number[] = []; // Mảng chứa các số trang
  totalElements: number = 0; // Tổng số sản phẩm
  // Khai báo page và size trước
  page: number = 0;
  size: number = 10;
  idCTSP: number = 0;

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





  constructor(private sanPhamService: SanPhamService, private trangChuService: TrangChuServiceComponent, private GioHangService: GioHangService) { }
  //====================== hàm chạy ========================
  ngOnInit(): void {
    this.loadData();
  }
  //===================== hàm chạy end========================

  //==================== hàm loadata ================
  loadData(): void {
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


  sanPhamList: any[] = []
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


  // /===================================================modal=======================================================================
  // ===============================================================================================================================
  // sử lý modal
  isPopupVisible: boolean = false; // Trạng thái hiển thị popup
  quantity: number = 0; // Số lượng sản phẩm
  // thuộc tính sản phẩm click
  sanPhamClick: any[] = [];
  idSsanPham: string = '';
  tenSanPham: string = '';
  maSanPham: string = ''
  ThuongHieu: string = ''
  XuatXu: string = ''
  gioiTinh: string = ''
  kichThuoc:string = ''
  mauSac:string=''
  selectedColor: any = null; // Lưu màu sắc được chọn
  selectedSize: any = null; // Lưu kích thước được chọ
  anhChiTietSanPham: any[] = []; // Lưu danh sách ảnh chi tiết sản phẩm
  chitietSanPham: any[] = [];
  currentImage: string = ''; // Ảnh chính mặc định
  soLuongCTSP: number = 0;
  donGiaDau: number = 0;
  donGia: Number = 0;
  selectedProductId: number = 0;
  // ======================== //





  // hàm kiểm tra và sử lý  chọn màu với size

  checkSelection(): void {
    //  nếu chọn 2
    if (this.selectedColor !== null && this.selectedSize !== null) {
      console.log('Đã được chọn:');
      console.log("id sản phẩm là ", this.idSsanPham)
      console.log('Màu sắc:', this.selectedColor);
      console.log('Kích thước:', this.selectedSize);
      this.loadAnhChiTietSanPham(this.selectedColor.id, this.selectedSize.id, this.idSsanPham)


    }
    //  nếu chọn 1
    if (this.selectedColor !== null || this.selectedSize !== null) {
      if (this.selectedColor !== null) {
        console.log('Đã 1 được chọn:');
        console.log("id sản phẩm là ", this.idSsanPham)
        console.log('Màu sắc:', this.selectedColor);
      } else {
        console.log("id sản phẩm là ", this.idSsanPham)
        console.log('Đã 1 được chọn:');
        console.log('Kích thước:', this.selectedSize);
      }


    }
  }




  // load ảnh khi chọn size và màu
  loadAnhChiTietSanPham(selectedColor: any, selectedSize: any, idSanPham: string): void {
    const idSanPhamNumber = Number(idSanPham); // Chuyển đổi idSanPham từ string sang number

    if (isNaN(idSanPhamNumber)) {
      console.error('ID sản phẩm không hợp lệ:', idSanPham);
      return;
    }

    this.trangChuService.getAnhByIdCtsp(selectedColor, selectedSize, idSanPhamNumber).subscribe(
      (response) => {
        if (response && response.length > 0) {
          this.anhChiTietSanPham = response;
          const chiTiet = response[0]?.chiTietSanPham;
          if (chiTiet) {
            this.soLuongCTSP = chiTiet.soLuong || 0;
            this.donGiaDau = chiTiet.donGia || 0;
            this.donGia = this.donGiaDau;
            this.currentImage = response[0]?.urlAnh || '';
            this.idCTSP = response[0]?.chiTietSanPham.id;
            this.kichThuoc = response[0]?.chiTietSanPham.size.ten;
            this.mauSac = response[0]?.chiTietSanPham.mauSac.ten;
            console.log('id laf ', this.idCTSP)
            this.quantity = 0
          } else {
            console.warn('Không tìm thấy chi tiết sản phẩm trong phần tử đầu tiên của danh sách ảnh.');
          }
        } else {
          console.warn('API trả về danh sách ảnh rỗng.');
          this.anhChiTietSanPham = [];

          this.getctsp(this.selectedColor.id, this.selectedSize.id, this.idSsanPham);

          this.currentImage = '';
        }
      },
      (error) => {
        console.error('Lỗi khi tải danh sách ảnh:', error);
        this.anhChiTietSanPham = [];
        this.soLuongCTSP = 0;

        this.currentImage = '';
      }
    );

  }
  getctsp(selectedColor: any, selectedSize: any, idSanPham: string): void {
    const idSanPhamNumber = Number(idSanPham); // Chuyển đổi idSanPham từ string sang number

    if (isNaN(idSanPhamNumber)) {
      console.error('ID sản phẩm không hợp lệ:', idSanPham);
      return;
    }

    this.trangChuService.getCtsp(selectedColor, selectedSize, idSanPhamNumber).subscribe(
      (response) => {
        if (response && response.length > 0) {
          this.chitietSanPham = response;
          console.log("chi tiết sản phẩm lấy đc là :", this.chitietSanPham)
          const chiTietsp = response[0];
          console.log("chiTietsp sản phẩm lấy đc là :", chiTietsp)
          this.soLuongCTSP = chiTietsp.soLuong || 0;
          this.donGiaDau = chiTietsp.donGia || 0;
          this.donGia = this.donGiaDau;
          this.idCTSP = chiTietsp.id;
          console.log('id la ctsp ', this.idCTSP)
          this.quantity = 0
        }

      });

  }




  // đổi ảnh
  changeImage(url: string): void {
    this.currentImage = url;
    console.log('Ảnh hiện tại:', this.currentImage);
  }

  // chọn size
  selectColor(color: any): void {
    this.selectedColor = color;
    console.log('Selected Color:', this.selectedColor);
    this.checkSelection();
  }

  // chọn kích thước
  selectSize(size: any): void {
    this.selectedSize = size;
    console.log('Selected Size:', this.selectedSize);
    this.checkSelection();
  }

  // chọn sản phẩm
  getSanPham(id: number) {
    this.trangChuService.findBySanPhamId(id)
      .subscribe(
        (response: any) => {
          console.log('Phản hồi API sản phẩm click:', response);

          // Giả sử dữ liệu sản phẩm có cấu trúc như trong phản hồi bạn gửi
          const product = response[0]; // Nếu phản hồi là một mảng, chọn phần tử đầu tiên
          console.log(product);
          // Lấy id và tên sản phẩm
          this.idSsanPham = product.id;
          this.tenSanPham = product.ten;
          this.maSanPham = product.ma;
          this.ThuongHieu = product.thuongHieu.ten;
          this.XuatXu = product.xuatXu.ten;
          this.gioiTinh = product.gioiTinh.ten;

          console.log('ID sản phẩm:', this.idSsanPham);
          console.log('Tên sản phẩm:', this.tenSanPham);
          console.log('thuonghieu sản phẩm:', this.ThuongHieu);
          console.log('XuatXu sản phẩm:', this.XuatXu);
          console.log('gioiTinh sản phẩm:', this.gioiTinh);


          // Lưu thông tin sản phẩm vào biến để sử dụng sau này
          this.sanPhamClick = product;
        },
        (error) => {
          console.error('Lỗi khi tải sản phẩm:', error);
        }
      );
  }


  loadSizes(id: number): void {
    this.trangChuService.getSizes(id).subscribe(
      (response: any[]) => {
        console.log("size theo id sp", response)
        this.sizeListSp = response;
        console.log('sizeList:', this.sizeListSp);
      },
      (error) => {
        console.error('Error loading sizes:', error);
      }
    );
  }


  loadColors(id: number): void {
    this.trangChuService.getMau(id).subscribe(
      (response: any[]) => {
        console.log("màu theo id sp", response)
        this.mauSacListsp = response;
        console.log('mauSacList:', this.mauSacListsp);
      },
      (error) => {
        console.error('Error loading mauSacList:', error);
      }
    );
  }


  openPopup(productId: number) {
    this.idCTSP = productId;
    // gọi hàm thực thi 
    this.loadSizes(productId)
    this.loadColors(productId)
    this.getSanPham(productId)
    this.quantity = 0
    this.isPopupVisible = true;
    this.selectedProductId = productId; // Gán id sản phẩm được chọn
    console.log('ID sản phẩm:', productId); // Hiển thị id sản phẩm trên console (kiểm tra)
    // Thực hiện logic khác tại đây nếu cần

    setTimeout(() => {
      if (this.mauSacList.length >= 0) {
        this.selectedColor = this.mauSacList[0]; // Chọn màu đầu tiên
        console.log('Màu sắc mặc định:', this.selectedColor);
      }
      if (this.sizeList.length >= 0) {
        this.selectedSize = this.sizeList[0]; // Chọn kích thước đầu tiên
        console.log('Kích thước mặc định:', this.selectedSize);
      }

      // Kiểm tra và tải hình ảnh theo lựa chọn mặc định
      if (this.selectedColor && this.selectedSize) {
        this.checkSelection(); // Gọi lại kiểm tra lựa chọn
      }
    }, 100);
  }
  closePopup() {
    this.soLuongCTSP = 0;
    this.isPopupVisible = false; // Đóng popup
  }







  // sử lý số lượng ===========================



  err2: string = ''; // Biến để hiển thị thông báo lỗi

  // Xử lý khi người dùng thay đổi số lượng
  onQuantityChange(event: any): void {
    // Lấy giá trị từ input và loại bỏ khoảng trắng
    let value = event.target?.value?.toString().trim();

    // Loại bỏ tất cả các ký tự không phải là số
    value = value.replace(/[^0-9]/g, '');

    // Nếu giá trị sau khi làm sạch là rỗng, đặt về 0
    if (!value) {
      this.quantity = 0;
      event.target.value = ''; // Cập nhật giá trị input thành rỗng
      return;
    }

    // Chuyển đổi giá trị sang số nguyên
    const numericValue = parseInt(value, 10);

    // Kiểm tra số lượng nhỏ hơn 1
    if (numericValue < 0) {
      this.quantity = 0;
      event.target.value = '0'; // Cập nhật lại input
      return;
    }

    // Kiểm tra số lượng vượt quá giới hạn trong kho
    if (numericValue > this.soLuongCTSP) {
      this.quantity = this.soLuongCTSP;
      event.target.value = this.soLuongCTSP.toString(); // Cập nhật lại input
      return;
    }

    // Giá trị hợp lệ
    this.err2 = ''; // Xóa lỗi
    this.quantity = numericValue; // Gán số lượng hợp lệ
    event.target.value = numericValue.toString(); // Đảm bảo input chỉ chứa số hợp lệ
  }

  themSanPham(): void {
    const idKhString = localStorage.getItem('id'); // Lấy id dưới dạng chuỗi
    console.log("id ctsp hien tai ",this.idCTSP)
    // Kiểm tra xem ID khách hàng có tồn tại trong localStorage hay không
    if (!idKhString) {
        // Nếu không có khách hàng, tạo một đối tượng request mới
        const request = {
            id: this.idSsanPham,
            idGioHang: 0,
            idChiTietSanPham: this.idCTSP,
            soLuong: this.quantity || 1, // Đảm bảo số lượng mặc định là 1 nếu không có giá trị
            urlAnh:{
              urlAnh:this.currentImage
            },
            trangThai:'unactive',
            chiTietSanPham:{
              id:this.idCTSP,
              sanPham:{
                ten:this.tenSanPham
              },
              size:{
                ten:this.kichThuoc
              },
              mauSac:{
                ten:this.mauSac
              },
              donGia:this.donGia
            },
        };

        // Lấy hoặc tạo một giỏ hàng từ localStorage
        let cart = JSON.parse(localStorage.getItem('cart') || '[]'); // Giỏ hàng mặc định là mảng rỗng

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng hay chưa
        const existingProductIndex = cart.findIndex((item: any) => item.idChiTietSanPham === request.idChiTietSanPham);

        if (existingProductIndex !== -1) {
            // Nếu sản phẩm đã tồn tại trong giỏ hàng, cộng dồn số lượng
            cart[existingProductIndex].soLuong += request.soLuong;
        } else {
            // Nếu sản phẩm chưa có trong giỏ hàng, thêm sản phẩm mới
            cart.push(request);
        }

        // Lưu giỏ hàng vào localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        this.showSuccessMessage('Thêm sản phẩm vào giỏ thành công!');
    } else {
        // Nếu có ID khách hàng, gọi API để thêm sản phẩm vào giỏ hàng
        const idKh = Number(idKhString);
        if (isNaN(idKh)) {
            console.error('ID khách hàng không hợp lệ!');
            return; // Nếu ID không hợp lệ, dừng lại
        }

        const request = {
            id: 0,
            idGioHang: 0,
            idChiTietSanPham: this.idCTSP,
            soLuong: this.quantity || 1 // Đảm bảo số lượng mặc định là 1 nếu không có giá trị
        };

        // Gọi API thêm sản phẩm vào giỏ hàng của khách hàng
        this.GioHangService.themSanPham(idKh, request).subscribe(
            response => {
                // Sau khi thêm sản phẩm vào giỏ hàng, có thể cập nhật thông tin bổ sung
                this.showSuccessMessage('Thêm sản phẩm vào giỏ thành công!');
            },
            error => {
                this.handleError(error);
            }
        );
    }
}

  

  // Xử lý khi người dùng giảm số lượng
  decreaseQuantity(): void {
    if (this.quantity > 0) {
      this.quantity--;
      this.err2 = ''; // Xóa lỗi nếu giá trị hợp lệ
    }
  }

  // Xử lý khi người dùng tăng số lượng
  increaseQuantity(): void {
    if (this.quantity < this.soLuongCTSP) {
      this.quantity++;
      this.err2 = ''; // Xóa lỗi nếu giá trị hợp lệ
    }
  }

  // Xử lý khi người dùng dán dữ liệu (ngăn dán dữ liệu không hợp lệ)
  onPaste(event: ClipboardEvent): void {
    const clipboardData = event.clipboardData?.getData('text') || '';
    if (!/^\d+$/.test(clipboardData.trim())) {
      event.preventDefault(); // Ngăn không cho dán giá trị không hợp lệ
      this.err2 = 'Dữ liệu dán không hợp lệ. Vui lòng chỉ nhập số nguyên dương.';
    }
  }

  formatTien(value: any): string {
    const numValue = Number(value); // Chuyển đổi giá trị sang kiểu `number`
    if (isNaN(numValue)) return '0'; // Xử lý trường hợp không phải số
    return numValue.toLocaleString('de-DE'); // Định dạng dấu chấm làm phân cách hàng nghìn
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

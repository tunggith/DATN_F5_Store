import { Component, OnInit } from '@angular/core';
import { TrangChuServiceComponent } from 'src/app/trang-chu/trang-chu.service.component';
import { GioHangService } from '../gio-hang/gio-hang-service.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'pp-trang-chu',
  templateUrl: './trang-chu.component.html',
  styleUrls: ['./trang-chu.component.css']
})
export class TrangChuComponent implements OnInit {
  // khai báo biến
  newSanPham: any[] = []; // Khởi tạo với mảng rỗng để tránh lỗi

  HotSanPham: any[] = []; // khởi tạo biến lưu sản phẩm hot

  listIdSPCt: any[] = []; // khởi tạo biến lưu danh sách id sản phẩm ;

  anhMauSpnew: String = '';
  anhMauSpHot: String = '';
  idCTSP: number = 0;


  voucher: any[] = [];


  sizeList: any[] = [];
  mauSacList: any[] = [];
  currentIndex = 0;
  interval: any;

  khoangGia: string = ''; // Lưu khoảng giá
  errorMessage: string = ''; // Thông báo lỗi
  donGia: Number = 0;
  selectedProductId: number = 0;
  sliderImages = [
    'https://imgur.com/owuXyW7.jpg',
    'https://imgur.com/mkWZrwI.jpg',
    'https://imgur.com/yFD2QA4.jpg'
  ];

  constructor(private trangChuService: TrangChuServiceComponent, private gioHangService: GioHangService) { }





  ngOnInit(): void {
    this.loaddata();
  }

  loaddata() {
    console.log('Load data method called');
    this.loadNewProducts();
    this.loadHotProduct();
    this.startSlider();
    this.loadvoucher()
  }

  // load giá theo id 





  // load khoản giá 
  loadKhoangGia(idSanPham: number) {
    this.trangChuService.getKhoangGia(idSanPham).subscribe(
      (response: any) => {
        console.log("khoản giá api ", response)
        this.khoangGia = response;

      },
      (error) => {
        this.errorMessage = 'Lỗi khi tải dữ liệu.';
        console.error('Error:', error);
      }
    )
  }

  // HÀM LẤY SẢN PHẨM MỚI
  loadNewProducts(): void {
    this.trangChuService.getSanPhamNew()
      .subscribe(
        (response: any) => {
          console.log('Phản hồi API:', response); // Log toàn bộ phản hồi
          this.newSanPham = response;
          // console.log('Sản phẩm đã tải:', this.newSanPham);
        },
        (error) => {
          console.error('Lỗi khi tải sản phẩm:', error);
        }
      );
  }

  loadvoucher(): void {

    this.trangChuService.getvoucher()
      .subscribe(
        (Response: any) => {
          //  console.log("phản hồi voucher từ api là",Response)
          this.voucher = Response.result.content;
          //  console.log("voucher: " ,this.voucher);
        }
      )
  }


  // sản phẩm hót
  loadHotProduct(): void {
    this.trangChuService.getTop10MostSoldProducts()
      .subscribe(
        (response: any[]) => {
          // console.log("Phản hồi từ API sản phẩm hot", response);

          // Lấy tất cả ID_CHI_TIET_SAN_PHAM từ các phần tử trong mảng phản hồi
          this.listIdSPCt = response.map(item => item.ID_CHI_TIET_SAN_PHAM);

          // console.log("ID chi tiết sản phẩm lấy được là: ", this.listIdSPCt);

          // Khởi tạo hoặc làm trống HotSanPham trước khi thêm dữ liệu mới
          this.HotSanPham = [];

          // Lặp qua từng ID và gọi API để lấy chi tiết sản phẩm
          this.listIdSPCt.forEach(id => {
            this.trangChuService.findByChiTietSanPhamId(id, 0, 10).subscribe(
              (res: any) => {
                // console.log(`Phản hồi từ API cho chi tiết sản phẩm với ID ${id}`, res);
                // Thêm kết quả vào mảng HotSanPham
                this.HotSanPham.push(...res.content); // Giả sử `content` chứa danh sách sản phẩm
                // console.log("danh sach shot sản phẩm :",this.HotSanPham)
              },
              (error) => {
                console.error(`Lỗi khi lấy chi tiết sản phẩm với ID ${id}`, error);
              }
            );
          });
        },
        (error) => {
          console.error("Lỗi khi gọi API sản phẩm hot", error);
        }
      );
  }


  startSlider(): void {
    this.interval = setInterval(() => {
      this.nextImage();
    }, 3000); // Chuyển ảnh sau mỗi 3 giây
  }

  nextImage(): void {
    this.currentIndex = (this.currentIndex + 1) % this.sliderImages.length;
  }

  prevImage(): void {
    this.currentIndex = (this.currentIndex - 1 + this.sliderImages.length) % this.sliderImages.length;
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }


  copyCode(voucherItem: any): void {
    navigator.clipboard.writeText(voucherItem.ma).then(() => {
      // Đặt trạng thái isCopied thành true
      voucherItem.isCopied = true;
      // Sau 3 giây, đổi lại trạng thái isCopied thành false
      setTimeout(() => {
        voucherItem.isCopied = false;
      }, 3000);
    });
  }
  // ===================================================modal=======================================================================
  // ===============================================================================================================================
  // sử lý modal 
  isPopupVisible: boolean = false; // Trạng thái hiển thị popup
  quantity: number = 0;
  mauSac: string = ''
  kichThuoc: string = ''
  sanPhamClick: any[] = [];
  idSsanPham: string = '';
  tenSanPham: string = '';
  maSanPham: string = ''
  ThuongHieu: string = ''
  XuatXu: string = ''
  gioiTinh: string = ''
  selectedColor: any = null; // Lưu màu sắc được chọn
  selectedSize: any = null; // Lưu kích thước được chọ
  anhChiTietSanPham: any[] = []; // Lưu danh sách ảnh chi tiết sản phẩm
  chitietSanPham: any[] = [];
  currentImage: string = ''; // Ảnh chính mặc định
  soLuongCTSP: number = 0;
  donGiaDau: number = 0;
  // ======================== //


  themSanPham(): void {
    const idKhString = localStorage.getItem('id'); // Lấy id dưới dạng chuỗi


    // Kiểm tra xem ID khách hàng có tồn tại trong localStorage hay không
    if (!idKhString) {
      const request = {
        id: this.idCTSP,
        idGioHang: 0,
        idChiTietSanPham: this.idCTSP,
        soLuong: this.quantity || 1, // Đảm bảo số lượng mặc định là 1 nếu không có giá trị
        urlAnh: {
          urlAnh: this.currentImage
        },
        trangThai: 'unactive',
        chiTietSanPham: {
          id: this.idCTSP,
          sanPham: {
            ten: this.tenSanPham
          },
          size: {
            ten: this.kichThuoc
          },
          mauSac: {
            ten: this.mauSac
          },
          donGia: this.donGia
        },
      };
      // Nếu không có khách hàng, lấy hoặc tạo một giỏ hàng từ localStorage
      let cart = JSON.parse(localStorage.getItem('cart') || '[]'); // Lấy giỏ hàng từ localStorage, nếu không có thì khởi tạo mảng rỗng

      // Kiểm tra xem sản phẩm đã có trong giỏ hàng hay chưa
      const existingProductIndex = cart.findIndex((item: any) => item.idChiTietSanPham === request.idChiTietSanPham);

      if (existingProductIndex !== -1) {
        // Nếu sản phẩm đã tồn tại trong giỏ hàng, cộng dồn số lượng
        const tongSoLuong = cart[existingProductIndex].soLuong + request.soLuong;
        if (tongSoLuong > this.soLuongCTSP) {
          // Thông báo lỗi nếu tổng số lượng vượt quá số lượng tồn kho
          this.showErrorMessage('Bạn đã thêm sản phẩm với số lượng tối đa');
        } else {
          // Cộng dồn số lượng
          cart[existingProductIndex].soLuong += request.soLuong;
          this.showSuccessMessage('Thêm sản phẩm vào giỏ thành công!');
        }
      } else {
        // Nếu sản phẩm chưa có trong giỏ hàng, thêm sản phẩm mới
        cart.push(request);
        this.showSuccessMessage('Thêm sản phẩm vào giỏ thành công!');
      }

      // Lưu lại giỏ hàng vào localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      const request = {
        id: 0,
        idGioHang: 0,
        idChiTietSanPham: this.idCTSP,
        soLuong: this.quantity || 1 // Đảm bảo số lượng mặc định là 1 nếu không có giá trị
      };
      // Nếu có ID khách hàng, chuyển đổi chuỗi thành số
      const idKh = Number(idKhString);
      if (isNaN(idKh)) {
        console.error('ID khách hàng không hợp lệ!');
        return; // Nếu ID không hợp lệ, dừng lại
      }

      // Gọi API thêm sản phẩm vào giỏ hàng của khách hàng
      this.gioHangService.themSanPham(idKh, request).subscribe(
        response => {
          this.showSuccessMessage('Thêm sản phẩm vào giỏ thành công!');
        },
        error => {
          this.handleError(error);
        }
      );
    }
  }



  // hàm kiểm tra và sử lý  chọn màu với size 

  checkSelection(): void {
    //  nếu chọn 2 
    if (this.selectedColor !== null && this.selectedSize !== null) {
      console.log('Đã được chọn:');
      console.log("id sản phẩm là ", this.idSsanPham)
      console.log("id ctsp:",this.idCTSP);
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
          this.quantity = 0
        }

      });

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
            this.idCTSP = chiTiet.id
            this.soLuongCTSP = chiTiet.soLuong || 0;
            this.donGiaDau = chiTiet.donGia || 0;
            this.donGia = this.donGiaDau;
            this.currentImage = response[0]?.urlAnh || '';
            this.quantity = 0
            this.kichThuoc = response[0]?.chiTietSanPham.size.ten;
            this.mauSac = response[0]?.chiTietSanPham.mauSac.ten;
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
        this.sizeList = response;
        console.log('sizeList:', this.sizeList);
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
        this.mauSacList = response;
        console.log('mauSacList:', this.mauSacList);
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
    this.loadKhoangGia(productId)
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

  // ===================================================modal=======================================================================
  // ===============================================================================================================================
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


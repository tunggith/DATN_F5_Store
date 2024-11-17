
import { Component, OnInit } from '@angular/core';
import { GioHangService } from 'src/app/gio-hang/gio-hang-service.component';
import { SanPhamService } from 'src/app/san-pham/san-pham-service.component';

@Component({
  selector: 'app-gio-hang',
  templateUrl: './gio-hang.component.html',
  styleUrls: ['./gio-hang.component.css']
})
export class GioHangComponent {
  hoaDons: any[]= [];
  idkh: number =0;
  Ghcts: any[] = []; // Chứa dữ liệu sản phẩm trong giỏ hàng
  totalPrice: number = 0; // Tổng cộng giá trị giỏ hàng
  sanPhamPage: any[] = [];
  totalPages: number[] = []; // Mảng chứa các số trang
  totalElements: number = 0; // Tổng số sản phẩm
  
  page: number = 0;
  size: number = 10;


  constructor(private GioHangService: GioHangService,
    private sanPhamService: SanPhamService) {}

  ngOnInit(): void {
    this.detailHoaDon(); 
  }

  // Hàm gọi API
  LoadGioHang(id: number) {
    this.GioHangService.getByGh(id).subscribe(
      (response) => {
        if (response && response.status) {
          this.Ghcts = response.result.content.content;
          console.log('gio hang',this.Ghcts);
          this.calculateTotal();
          this.loadSanPhamPhanTrang();
        } else {
          console.error('Không tìm thấy thông tin khuyến mãi chi tiết sản phẩm.');
        }
      },
      (error) => console.error('Lỗi khi gọi API khuyến mãi chi tiết sản phẩm:', error)
    );
}

// Hàm để lấy chi tiết hóa đơn của khách hàng
detailHoaDon(): void {
  const id = localStorage.getItem('id') || ''; // Lấy id khách hàng từ localStorage
  
  if (id !== '') {
    // Người dùng đã đăng nhập -> Lấy giỏ hàng từ server
    this.GioHangService.getHoaDonByKhachHang(id).subscribe(
      (response) => {
        if (response && response.status) {
          const hoaDons = response.result.content.content;
          if (hoaDons && hoaDons.length > 0) {
            this.idkh = hoaDons[0].id;
            this.LoadGioHang(this.idkh); // Lấy giỏ hàng từ server
          } else {
            console.error('Không có hóa đơn nào trong danh sách');
          }
        } else {
          console.error('API trả về không hợp lệ');
        }
      },
      (error) => console.error('Lỗi khi gọi API lấy hóa đơn:', error)
    );
  } else {
    // Người dùng chưa đăng nhập -> Lấy giỏ hàng từ localStorage
    console.warn('Chưa đăng nhập, lấy giỏ hàng tạm thời từ localStorage.');
    this.LoadTemporaryCart();
  }
}

LoadTemporaryCart(): void {
  const tempCart = JSON.parse(localStorage.getItem('localCart') || '[]');
  console.log('Dữ liệu local', tempCart);

  if (tempCart.length > 0) {
    this.Ghcts = []; // Khởi tạo lại danh sách giỏ hàng

    const requests = tempCart.map((item: any) =>
      this.sanPhamService.getSanPhamById(item.productId).toPromise().then((product) => ({
        chiTietSanPham: {
          sanPham: product,
          donGia: product.donGia,
          // Thêm các thông tin khác nếu cần
        },
        soLuong: item.soLuong,
      }))
    );
    console.log('Requests:', requests);

    Promise.all(requests).then((result) => {
      this.Ghcts = result;
      console.log('Giỏ hàng chi tiết', this.Ghcts);
      this.calculateTotal(); // Cập nhật tổng tiền
    }).catch((error) => {
      console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
    });
  } else {
    console.warn('Giỏ hàng tạm thời trống.');
  }
}


  // Hàm tính tổng giá trị giỏ hàng
  calculateTotal(): void {
    if (Array.isArray(this.Ghcts)) {
      this.totalPrice = this.Ghcts.reduce(
        (sum, item) => sum + (item.chiTietSanPham.donGia || 0) * (item.soLuong || 0),
        0
      );
    } else {
      this.totalPrice = 0; // Đặt tổng tiền là 0 nếu không có sản phẩm nào
    }
  }
 
  onQuantityChange(item: any): void {
    // Đảm bảo số lượng tối thiểu là 1
    if (item.soLuong < 1) {
      item.soLuong = 1;
    }
  
    // Gọi lại API addToCart để cập nhật
    this.GioHangService.addToCart(item.gioHang.id, item.chiTietSanPham.id, item.soLuong).subscribe({
      next: (response) => {
        console.log('Số lượng sản phẩm đã được cập nhật:', response);
        this.calculateTotal(); // Cập nhật lại tổng tiền sau khi thay đổi số lượng
      },
      error: (error) => {
        alert('Số lượng trong giỏ hàng nhiều hơn số lượng sản phẩm đang có');
        this.LoadGioHang(item.gioHang.id); // Tải lại giỏ hàng nếu có lỗi
      }
    });
  }
  

  deleteGioHangCtItem(ghctId: any) {
    if (!ghctId) {
      console.error('ID giỏ hàng chi tiết không hợp lệ.');
      alert('Không tìm thấy ID giỏ hàng chi tiết để xóa.');
      return;
    }
  
    // Hiển thị xác nhận trước khi xóa
    const confirmDelete = confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?');
    if (!confirmDelete) {
      return;
    }
  
    // Gọi hàm service để xóa
    this.GioHangService.deleteGioHangCt(ghctId.id).subscribe({
      next: (response) => {
        console.log('Xóa thành công:', response);
        alert('Sản phẩm đã được xóa khỏi giỏ hàng.');
        this.detailHoaDon(); // Gọi lại hàm load giỏ hàng để cập nhật danh sách
      },
      error: (error) => {
        console.error('Lỗi khi xóa giỏ hàng chi tiết:', error);
        alert('Không thể xóa sản phẩm. Vui lòng thử lại sau.');
      },
    });
  }
  
  
  
  
  loadSanPhamPhanTrang(): void {
    this.sanPhamService.getSanPhamPhanTrang(this.page, this.size).subscribe(
      (response: any) => {
        console.log('Phản hồi API Sản Phẩm Phân Trang:', response);
        if (response && response.content) {
          this.sanPhamPage = response.content;
         
        } else {
          console.log('Không có dữ liệu trong response.content');
        }
      },
      (error) => {
        console.error('Lỗi khi tải danh sách Sản Phẩm Phân Trang:', error);
      }
    );
  }

  getProductImage(productId: number): string {
    const product = this.sanPhamPage.find(item => item.id === productId);
    return product?.urlAnh || 'assets/img/product/default.jpg'; // Trả về ảnh nếu tìm thấy
  }
  

}

import { Component, OnInit } from '@angular/core';
import { TrangChuServiceComponent } from 'src/app/trang-chu/trang-chu.service.component';

@Component({
  selector: 'pp-trang-chu',
  templateUrl: './trang-chu.component.html',
  styleUrls: ['./trang-chu.component.css']
})
export class TrangChuComponent implements OnInit {
  // khai báo biến
  newSanPham: any[] = []; // Khởi tạo với mảng rỗng để tránh lỗi

  HotSanPham : any[] = []; // khởi tạo biến lưu sản phẩm hot

  listIdSPCt : any[] = []; // khởi tạo biến lưu danh sách id sản phẩm ;

  anhMauSpnew: String ='';
  anhMauSpHot: String ='';


 voucher : any[] = [];


  sizeList: any[] = [];
  mauSacList: any[] = [];
  currentIndex = 0;
  interval: any;

  khoangGia: string = ''; // Lưu khoảng giá
  errorMessage: string = ''; // Thông báo lỗi
  donGia : Number = 0;
  selectedProductId: number = 0;
  sliderImages = [
    'https://imgur.com/owuXyW7.jpg',
    'https://imgur.com/mkWZrwI.jpg',
    'https://imgur.com/yFD2QA4.jpg'
  ];

  constructor(private trangChuService: TrangChuServiceComponent) { }





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
        console.log("khoản giá api ",response)
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

  loadvoucher():void{

    this.trangChuService.getvoucher()
    .subscribe(
      (Response: any) =>{
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
  quantity: number = 0; // Số lượng sản phẩm
  // thuộc tính sản phẩm click 
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
    soLuongCTSP: number = 0 ;
    donGiaDau: number = 0;
    idCTSP: number = 0;

 // ======================== //





// hàm kiểm tra và sử lý  chọn màu với size 

 checkSelection(): void {
  //  nếu chọn 2 
  if (this.selectedColor !== null && this.selectedSize !== null) {
    console.log('Đã được chọn:');
    console.log("id sản phẩm là ",this.idSsanPham)
    console.log('Màu sắc:', this.selectedColor);
    console.log('Kích thước:', this.selectedSize);
    this.loadAnhChiTietSanPham(this.selectedColor.id,this.selectedSize.id,this.idSsanPham)
  

  } 
  //  nếu chọn 1
  if(this.selectedColor !== null ||  this.selectedSize !== null) {
    if(this.selectedColor !== null ){
      console.log('Đã 1 được chọn:');
      console.log("id sản phẩm là ",this.idSsanPham)
      console.log('Màu sắc:', this.selectedColor);
    }else{
      console.log("id sản phẩm là ",this.idSsanPham)
      console.log('Đã 1 được chọn:');
      console.log('Kích thước:', this.selectedSize);
    }
  
   
  }
}


getctsp(selectedColor: any, selectedSize: any, idSanPham: string) : void{
  const idSanPhamNumber = Number(idSanPham); // Chuyển đổi idSanPham từ string sang number

  if (isNaN(idSanPhamNumber)) {
    console.error('ID sản phẩm không hợp lệ:', idSanPham);
    return;
  }

  this.trangChuService.getCtsp(selectedColor, selectedSize, idSanPhamNumber).subscribe(
    (response) => {
      if (response && response.length > 0) {
        this.chitietSanPham = response;
        console.log("chi tiết sản phẩm lấy đc là :",this.chitietSanPham)
        const chiTietsp = response[0];
        console.log("chiTietsp sản phẩm lấy đc là :",chiTietsp)
        this.soLuongCTSP = chiTietsp.soLuong || 0;
        this.donGiaDau = chiTietsp.donGia || 0;
        this.donGia = this.donGiaDau;
        this.idCTSP = chiTietsp.id;
        console.log('id la ctsp ',this.idCTSP)
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
          this.soLuongCTSP = chiTiet.soLuong || 0;
          this.donGiaDau = chiTiet.donGia || 0;
          this.donGia = this.donGiaDau;
          this.currentImage = response[0]?.urlAnh || '';
          this.idCTSP = response[0]?.chiTietSanPham.id;
          console.log('id laf ',this.idCTSP)
          this.quantity = 0
        } else {
          console.warn('Không tìm thấy chi tiết sản phẩm trong phần tử đầu tiên của danh sách ảnh.');
        }
      } else {
        console.warn('API trả về danh sách ảnh rỗng.');
        this.anhChiTietSanPham = [];
  
        this.getctsp(this.selectedColor.id,this.selectedSize.id,this.idSsanPham);

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
        console.log("size theo id sp",response)
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
        console.log("màu theo id sp",response)
        this.mauSacList = response;
        console.log('mauSacList:', this.mauSacList);
      },
      (error) => {
        console.error('Error loading mauSacList:', error);
      }
    );
  }
  

  openPopup(productId: number) {
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
  
}


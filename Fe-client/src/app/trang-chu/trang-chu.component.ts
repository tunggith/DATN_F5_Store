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

 voucher : any[] = [];

  currentIndex = 0;
  interval: any;
  
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

  // HÀM LẤY SẢN PHẨM MỚI 
  loadNewProducts(): void {
    this.trangChuService.getSanPhamNew()
      .subscribe(
        (response: any) => {
          // console.log('Phản hồi API:', response); // Log toàn bộ phản hồi
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
  
  

}
  

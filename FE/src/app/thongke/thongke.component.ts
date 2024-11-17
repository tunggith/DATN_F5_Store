import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ThongkeService } from './thongke.sevice';


@Component({
  selector: 'app-thongke',
  templateUrl: './thongke.component.html',
  styleUrls: ['./thongke.component.css']
})
export class ThongkeComponent implements OnInit {


   titler : String ='các'

  public lineChartData: any[] = [
    { data: [], label: 'Dữ liệu' }
  ];

  public lineChartLabels: string[] = [];
  public lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false, 
  };

  public lineChartLegend = true;

  // Biến để lưu chế độ hiển thị
  public viewType: string = 'month';  // Mặc định là theo tháng

  // Biến để lưu năm bắt đầu và năm kết thúc người dùng nhập
  public selectedYear: number = new Date().getFullYear();
  public startYear: number = 2022;
  public endYear: number = new Date().getFullYear();  // Mặc định là năm hiện tại

  // Biến để lưu kiểu biểu đồ người dùng chọn
  public selectedChartType: string = 'line';  // Mặc định là biểu đồ đường
  public selectedStartDate: string = '';
  public selectedEndDate: string = '';

  // Biến để lưu tổng doanh thu
  public totalDoanhThu: number = 0;
  public DoanhthuHienTai: number = 0;
  // Biến để lưu mục có doanh thu cao nhất và doanh thu của mục đó
  public highestRevenueLabel: string = '';  // Tên (ngày/tháng/năm/quý) có doanh thu cao nhất
  public highestRevenueAmount: number = 0;  // Doanh thu cao nhất

  // Biến để lưu thông tin top sản phẩm
  public topSanPham: any[] = [];

  constructor(private thongkeService: ThongkeService) {}

  ngOnInit(): void {
    // Khởi tạo biểu đồ mặc định theo tháng
    this.loadDoanhThu();
    this.loadDoanhThuTheoNgayHienTai();
    this.loadTopSanPhamTheoThang();
    this.loadDoanhThu();
  
  }

  // Hàm tính tổng doanh thu từ một mảng doanh thu
  calculateTotal(doanhThu: number[]): number {
    return doanhThu.reduce((acc, value) => acc + value, 0);
  }

  // Hàm tìm mục có doanh thu cao nhất (ngày/tháng/quý/năm) và doanh thu của mục đó
  findHighestRevenue(doanhThu: number[], labels: string[]): void {
    const maxRevenue = Math.max(...doanhThu);
    const index = doanhThu.indexOf(maxRevenue);
    this.highestRevenueLabel = labels[index];
    this.highestRevenueAmount = maxRevenue;
  }

  // Hàm gọi API top sản phẩm theo tháng
  loadTopSanPhamTheoThang(): void {
    this.thongkeService.getTopSanPhamTheoThang(this.selectedYear).subscribe(
      (data) => {
        this.topSanPham = data; // Lưu dữ liệu top sản phẩm
        console.log('Danh sách sản phẩm theo tháng:', this.topSanPham); // In danh sách sản phẩm ra console
      },
      (error) => {
        console.error('Lỗi khi lấy dữ liệu top sản phẩm theo tháng:', error);
      }
    );
  }
  

  // Hàm gọi API top sản phẩm theo quý
  loadTopSanPhamTheoQuy(): void {
    this.thongkeService.getTopSanPhamTheoQuy(this.selectedYear).subscribe(
      (data) => {
        this.topSanPham = data; // Lưu dữ liệu top sản phẩm
      },
      (error) => {
        console.error('Lỗi khi lấy dữ liệu top sản phẩm theo quý:', error);
      }
    );
  }

  // Hàm gọi API top sản phẩm theo ngày
  loadTopSanPhamTheoNgay(): void {
    const formattedStartDate = this.formatDate(this.selectedStartDate);
    const formattedEndDate = this.formatDate(this.selectedEndDate);

    this.thongkeService.getTopSanPhamTheoNgay(formattedStartDate, formattedEndDate).subscribe(
      (data) => {
        this.topSanPham = data; // Lưu dữ liệu top sản phẩm
      },
      (error) => {
        console.error('Lỗi khi lấy dữ liệu top sản phẩm theo ngày:', error);
      }
    );
  }

  // Hàm gọi API top sản phẩm theo năm

loadTopSanPhamTheoNam(): void {
  this.thongkeService.getTopSanPhamTheoNam(this.startYear, this.endYear).subscribe(
    (data) => {
      this.topSanPham = data; // Lưu dữ liệu top sản phẩm
      console.log('Danh sách top sản phẩm theo năm:', this.topSanPham); // Log danh sách sản phẩm ra console
    },
    (error) => {
      console.error('Lỗi khi lấy dữ liệu top sản phẩm theo năm:', error);
    }
  );
}


  // Hàm lấy dữ liệu theo tháng và gọi API top sản phẩm theo tháng
  loadDoanhThu(): void {
    //Kiểm tra xem năm đã chọn có hợp lệ không
    if (!this.selectedYear || this.selectedYear <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Vui lòng chọn năm hợp lệ!',
      });
      console.error('Vui lòng chọn năm hợp lệ');
      return;
    }
    // Lấy năm hiện tại
    const currentYear = new Date().getFullYear();
    
    // Kiểm tra xem năm đã chọn có nhỏ hơn năm hiện tại không
    if (this.selectedYear > currentYear) {
      Swal.fire({
        icon: 'warning',
        title: 'Năm phải nhỏ hơn năm hiện tại!',
      });
      console.error('Năm phải nhỏ hơn năm hiện tại');
      return;
    }
    
  
    this.thongkeService.getDoanhThuTheoThang(this.selectedYear).subscribe(
      (data) => {
        const doanhThu = data.map(item => item.doanhThu);
        const thang = data.map(item => `Tháng ${item.thang}`);
  
        this.lineChartData = [
          { data: doanhThu, label: `Doanh thu theo tháng năm ${this.selectedYear}` }
        ];
        this.lineChartLabels = thang;
  
        // Tính tổng doanh thu
        this.totalDoanhThu = this.calculateTotal(doanhThu);
  
        // Tìm tháng có doanh thu cao nhất
        this.findHighestRevenue(doanhThu, thang);
  
        // Gọi API top sản phẩm theo tháng
        this.loadTopSanPhamTheoThang();
      },
      (error) => {
        console.error('Lỗi khi lấy dữ liệu từ API theo tháng:', error);
      }
    );
  }
  
  // Hàm lấy dữ liệu theo quý và gọi API top sản phẩm theo quý
  loadDoanhThuTheoQuy(): void {
// Kiểm tra xem năm đã chọn có hợp lệ không
if (!this.selectedYear || this.selectedYear <= 0) {
  Swal.fire({
    icon: 'warning',
    title: 'Vui lòng chọn năm hợp lệ!',
  });
  console.error('Vui lòng chọn năm hợp lệ');
  return;
}
// Lấy năm hiện tại
const currentYear = new Date().getFullYear();

// Kiểm tra xem năm đã chọn có nhỏ hơn năm hiện tại không
if (this.selectedYear > currentYear) {
  Swal.fire({
    icon: 'warning',
    title: 'Năm phải nhỏ hơn năm hiện tại!',
  });
  console.error('Năm phải nhỏ hơn năm hiện tại');
  return;
}


// Nếu cần thêm điều kiện kiểm tra khác cho năm, có thể làm như sau:
if (this.selectedYear < 1900 || this.selectedYear > new Date().getFullYear()) {
  Swal.fire({
    icon: 'warning',
    title: 'Năm phải nằm trong khoảng từ 1900 đến năm hiện tại!',
  });
  console.error('Năm phải nằm trong khoảng từ 1900 đến năm hiện tại');
  return;
}

// Nếu cả hai điều kiện trên đều hợp lệ, thực hiện tiếp theo

  
    this.thongkeService.getDoanhThuTheoQuy(this.selectedYear).subscribe(
      (data) => {
        const doanhThu = data.map(item => item.doanhThu);
        const quy = data.map(item => `Quý ${item.quy}`);
  
        this.lineChartData = [
          { data: doanhThu, label: `Doanh thu theo quý năm ${this.selectedYear}` }
        ];
        this.lineChartLabels = quy;
  
        // Tính tổng doanh thu
        this.totalDoanhThu = this.calculateTotal(doanhThu);
  
        // Tìm quý có doanh thu cao nhất
        this.findHighestRevenue(doanhThu, quy);
  
        // Gọi API top sản phẩm theo quý
        this.loadTopSanPhamTheoQuy();
      },
      (error) => {
        console.error('Lỗi khi lấy dữ liệu từ API theo quý:', error);
      }
    );
  }
  
  // Hàm lấy dữ liệu theo năm và gọi API top sản phẩm theo năm
  loadDoanhThuTheoNam(): void {
 // Kiểm tra tính hợp lệ của năm bắt đầu và năm kết thúc
if (this.startYear > this.endYear) {
  Swal.fire({
    icon: 'warning',
    title: 'Năm bắt đầu không được lớn hơn năm kết thúc!',
  });
  console.error('Năm bắt đầu không được lớn hơn năm kết thúc');
  return;
}

// Kiểm tra xem năm bắt đầu có hợp lệ không
if (this.startYear === 0 || !this.startYear) {
  Swal.fire({
    icon: 'warning',
    title: 'Vui lòng nhập năm bắt đầu hợp lệ!',
  });
  console.error('Vui lòng nhập năm bắt đầu hợp lệ');
  return;
}

// Kiểm tra xem năm kết thúc có hợp lệ không
if (this.endYear === 0 || !this.endYear) {
  Swal.fire({
    icon: 'warning',
    title: 'Vui lòng nhập năm kết thúc hợp lệ!',
  });
  console.error('Vui lòng nhập năm kết thúc hợp lệ');
  return;
}

    this.thongkeService.getDoanhThuTheoNam(this.startYear, this.endYear).subscribe(
      (data) => {
        const doanhThu = data.map(item => item.doanhThu);
        const nam = data.map(item => `Năm ${item.nam}`);
  
        this.lineChartData = [
          { data: doanhThu, label: `Doanh thu từ năm ${this.startYear} đến năm ${this.endYear}` }
        ];
        this.lineChartLabels = nam;
  
        // Tính tổng doanh thu
        this.totalDoanhThu = this.calculateTotal(doanhThu);
  
        // Tìm năm có doanh thu cao nhất
        this.findHighestRevenue(doanhThu, nam);
  
        // Gọi API top sản phẩm theo năm
        this.loadTopSanPhamTheoNam();
      },
      (error) => {
        console.error('Lỗi khi lấy dữ liệu từ API theo năm:', error);
      }
    );
  }
  
  // Hàm gọi API lấy dữ liệu doanh thu và top sản phẩm theo ngày
  loadDoanhThuTheoNgay(): void {
// Kiểm tra xem ngày bắt đầu có hợp lệ không
if (!this.selectedStartDate) {
  Swal.fire({
    icon: 'warning',
    title: 'Vui lòng chọn ngày bắt đầu!',
  });
  console.error('Vui lòng chọn ngày bắt đầu');
  return;
}

// Kiểm tra xem ngày kết thúc có hợp lệ không
if (!this.selectedEndDate) {
  Swal.fire({
    icon: 'warning',
    title: 'Vui lòng chọn ngày kết thúc!',
  });
  console.error('Vui lòng chọn ngày kết thúc');
  return;
}

// Chuyển đổi ngày bắt đầu và kết thúc sang định dạng có thể so sánh
const startDate = new Date(this.selectedStartDate);
const endDate = new Date(this.selectedEndDate);

// Kiểm tra xem ngày kết thúc có lớn hơn ngày bắt đầu không
if (endDate <= startDate) {
  Swal.fire({
    icon: 'warning',
    title: 'Ngày kết thúc phải lớn hơn ngày bắt đầu!',
  });
  console.error('Ngày kết thúc phải lớn hơn ngày bắt đầu');
  return;
}

// Kiểm tra xem ngày kết thúc có cách ngày bắt đầu không quá 30 ngày
const dayDifference = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24); // Tính số ngày khác nhau
if (dayDifference > 30) {
  Swal.fire({
    icon: 'warning',
    title: 'Ngày kết thúc không được cách ngày bắt đầu quá 30 ngày!',
  });
  console.error('Ngày kết thúc không được cách ngày bắt đầu quá 30 ngày');
  return;
}

// Lấy ngày hiện tại
const currentDate = new Date();
// currentDate.setHours(0, 0, 0, 0); // Đặt thời gian của ngày hiện tại về 00:00:00 để so sánh chỉ ngày



// Kiểm tra xem ngày bắt đầu có lớn hơn ngày hiện tại không
if (startDate > currentDate) {
  Swal.fire({
    icon: 'warning',
    title: 'Ngày bắt đầu không được lớn hơn ngày hiện tại!',
  });
  console.error('Ngày bắt đầu không được lớn hơn ngày hiện tại');
  return;
}

// Kiểm tra xem ngày kết thúc có lớn hơn ngày hiện tại không
if (endDate >currentDate) {
  Swal.fire({
    icon: 'warning',
    title: 'Ngày kết thúc không được lớn hơn ngày hiện tại!',
  });
  console.error('Ngày kết thúc không được lớn hơn ngày hiện tại');
  return;
}

// Kiểm tra xem ngày kết thúc có lớn hơn ngày bắt đầu không
if (endDate < startDate) {
  Swal.fire({
    icon: 'warning',
    title: 'Ngày kết thúc phải lớn hơn ngày bắt đầu!',
  });
  console.error('Ngày kết thúc phải lớn hơn ngày bắt đầu');
  return;
}


// Nếu cả hai ngày đều hợp lệ và ngày kết thúc không nhỏ hơn ngày bắt đầu, thực hiện tiếp theo

  
    const formattedStartDate = this.formatDate(this.selectedStartDate);
    const formattedEndDate = this.formatDate(this.selectedEndDate);
  
    this.thongkeService.getDoanhThuTheoNgay(formattedStartDate, formattedEndDate)
      .subscribe(
        data => {
          const labels = data.map(item => item.ngay);
          const doanhThu = data.map(item => item.doanhThu);
  
          this.lineChartLabels = labels;
          this.lineChartData = [
            { data: doanhThu, label: `Doanh thu từ ${formattedStartDate} đến ${formattedEndDate}` }
          ];
  
          // Tính tổng doanh thu
          this.totalDoanhThu = this.calculateTotal(doanhThu);
  
          // Tìm ngày có doanh thu cao nhất
          this.findHighestRevenue(doanhThu, labels);
  
          // Gọi API top sản phẩm theo ngày
          this.loadTopSanPhamTheoNgay();
        },
        error => {
          console.error('Lỗi khi lấy dữ liệu doanh thu theo ngày:', error);
        }
      );
  }
  


  loadDoanhThuTheoNgayHienTai(): void {
    // Gọi API để lấy thời gian hiện tại tại Việt Nam
    fetch('https://timeapi.io/api/Time/current/zone?timeZone=Asia/Ho_Chi_Minh')
      .then(response => response.json())
      .then(data => {
        const currentDate = new Date(data.dateTime); // Chuyển chuỗi ngày giờ thành đối tượng Date

        // Chuyển đổi định dạng ngày thành dd/MM/yyyy
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
        const year = currentDate.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;

        // Hiển thị ngày lấy được ra console
        console.log("Ngày hiện tại tại Việt Nam:", formattedDate);

        // Sử dụng ngày hiện tại cho cả ngày bắt đầu và ngày kết thúc
        this.thongkeService.getDoanhThuTheoNgay(formattedDate, formattedDate)
          .subscribe(
            data => {
              const labels = data.map(item => item.ngay);
              const doanhThu = data.map(item => item.doanhThu);

              this.lineChartLabels = labels;
              this.lineChartData = [
                { data: doanhThu, label: `Doanh thu ngày ${formattedDate}` }
              ];

              // Tính tổng doanh thu
              this.DoanhthuHienTai = this.calculateTotal(doanhThu);
              console.log("Doanh thu hôm nay là:", this.DoanhthuHienTai);
            },
            error => {
              console.error('Lỗi khi lấy dữ liệu doanh thu theo ngày:', error);
            }
          );
      })
      .catch(error => console.error('Lỗi khi lấy ngày giờ từ API:', error));
}







  // Hàm định dạng ngày từ yyyy-MM-dd sang dd/MM/yyyy
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}

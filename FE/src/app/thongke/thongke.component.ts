import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ThongkeService } from './thongke.sevice';


@Component({
  selector: 'app-thongke',
  templateUrl: './thongke.component.html',
  styleUrls: ['./thongke.component.css']
})
export class ThongkeComponent implements OnInit {

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

  // Biến để lưu mục có doanh thu cao nhất và doanh thu của mục đó
  public highestRevenueLabel: string = '';  // Tên (ngày/tháng/năm/quý) có doanh thu cao nhất
  public highestRevenueAmount: number = 0;  // Doanh thu cao nhất

  // Biến để lưu thông tin top sản phẩm
  public topSanPham: any[] = [];

  constructor(private thongkeService: ThongkeService) {}

  ngOnInit(): void {
    // Khởi tạo biểu đồ mặc định theo tháng
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
    if (this.startYear > this.endYear) {
      console.error('Năm bắt đầu không được lớn hơn năm kết thúc');
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
    if (this.selectedStartDate && this.selectedEndDate) {
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
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Vui lòng chọn ngày bắt đầu và ngày kết thúc!',
      });
      console.error('Vui lòng chọn ngày bắt đầu và ngày kết thúc');
    }
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

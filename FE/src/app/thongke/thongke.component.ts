import { Component } from '@angular/core';

@Component({
  selector: 'app-thongke',
  templateUrl: './thongke.component.html',
  styleUrls: ['./thongke.component.css']
})
export class thongkeComponent {
  // Cấu hình dữ liệu cho biểu đồ
  public lineChartData: any[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Dữ liệu 1' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Dữ liệu 2' }
  ];

  // Cấu hình nhãn cho trục X
  public lineChartLabels: string[] = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7'];

  public lineChartOptions = {
    responsive: true,
  };

  public lineChartLegend = true;
  public lineChartType = 'line';
}

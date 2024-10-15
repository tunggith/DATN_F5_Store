import { Component, OnInit } from '@angular/core';
import { LichSuHoaDonService } from './lich-su-hoa-don.service';

@Component({
  selector: 'app-lich-su-hoa-don',
  templateUrl: './lich-su-hoa-don.component.html',
  styleUrls: ['./lich-su-hoa-don.component.css']
})
export class LichSuHoaDonComponent implements OnInit {
  invoiceHistory: any[] = [];
  currentPage: number = 0;
  totalPages: number = 0;
  pageSize: number = 5; // Kích thước trang

  constructor(private lichSuHoaDonService: LichSuHoaDonService) { }

  ngOnInit(): void {
    this.loadInvoiceHistory();
  }

  loadInvoiceHistory(): void {
    this.lichSuHoaDonService.getInvoiceHistory(this.currentPage, this.pageSize).subscribe(response => {
      this.invoiceHistory = response.result.content.content; // Lấy danh sách hóa đơn
      this.totalPages = response.result.content.totalPages; // Lấy tổng số trang
      console.log(this.invoiceHistory);
    }, error => {
      console.error('Lỗi khi tải lịch sử hóa đơn', error);
    });
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadInvoiceHistory(); // Tải lại dữ liệu cho trang mới
    }
  }

  // Phương thức để tạo mảng số từ 0 đến totalPages - 1
  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }
}

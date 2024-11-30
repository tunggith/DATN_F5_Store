import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TraCuuDonHangService } from "./tra-cuu-don-hang.service"; // Đảm bảo đúng đường dẫn đến service

@Component({
  selector: 'app-tra-cuu-don-hang',
  templateUrl: './tra-cuu-don-hang.component.html',
  styleUrls: ['./tra-cuu-don-hang.component.css']
})
export class TraCuuDonHangComponent {
  searchForm: FormGroup;
  hoaDon: any = null;  // Dữ liệu hóa đơn
  trangThaiHoaDon: string | null = null;  // Trạng thái hóa đơn
  errorMessage: string | null = null;  // Lỗi khi không tìm thấy

  constructor(private fb: FormBuilder, private traCuuDonHangService: TraCuuDonHangService) {
    // Khởi tạo form với một trường mã đơn hàng (ma)
    this.searchForm = this.fb.group({
      ma: ['', [Validators.required]], // Yêu cầu nhập mã đơn hàng
    });
  }

  ngOnInit(): void {}

  // Phương thức gọi khi nhấn tìm kiếm
  onSearch(): void {
    const ma = this.searchForm.value.ma;  // Sử dụng mã hóa đơn để tìm kiếm
    this.traCuuDonHangService.findDonHangByMa(ma).subscribe({
      next: (data) => {
        this.hoaDon = data;
        this.trangThaiHoaDon = data.trangThai;  // Giả sử 'trangThai' chứa trạng thái hiện tại
        this.errorMessage = null;  // Xóa lỗi nếu tìm thấy
      },
      error: () => {
        this.errorMessage = 'Không tìm thấy đơn hàng nào với mã này!';
        this.hoaDon = null;  // Xóa kết quả nếu không tìm thấy
        this.trangThaiHoaDon = null;
      },
    });
  }
}

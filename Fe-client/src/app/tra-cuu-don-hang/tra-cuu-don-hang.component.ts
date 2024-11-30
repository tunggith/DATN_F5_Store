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
  hoaDonCT: any[] = [];  // Dữ liệu hóa đơn là mảng
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
        this.hoaDonCT = data;  // Gán dữ liệu trả về (mảng)
        console.log('Dữ liệu hóa đơn: ', this.hoaDonCT);

        // Giả sử trạng thái nằm ở phần tử đầu tiên
        if (this.hoaDonCT.length > 0) {
          this.trangThaiHoaDon = this.hoaDonCT[0].hoaDon.trangThai;
        } else {
          this.trangThaiHoaDon = null;
        }

        this.errorMessage = null;  // Xóa lỗi nếu tìm thấy
      },
      error: () => {
        this.errorMessage = 'Không tìm thấy đơn hàng nào với mã này!';
        this.hoaDonCT = [];  // Xóa kết quả nếu không tìm thấy
        this.trangThaiHoaDon = null;
      },
    });
  }
}

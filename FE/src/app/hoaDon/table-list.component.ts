import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {HoaDonService} from './hoa-don.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {
  
  hoaDon : any []= []; 
  hoaDonChiTiet : any []= [];
  page = 0;
  size = 5;
  currentVoucher: any = null;
  totalPages: number = 0;

  constructor(private http: HttpClient,
    private hoaDonService : HoaDonService
  ) { }

  ngOnInit() {
    this.getAllhoaDon();
  }

  getAllhoaDon(): void {
    this.hoaDonService.getAll(this.page,this.size).subscribe((response: any) => {
      this.hoaDon = response.result.content.content;
      this.totalPages = response.result.content.totalPages;
      console.log('total :',this.totalPages);
      console.log('Dữ liệu Hóa đơn: ', this.hoaDon);
    }, (error) => {
      console.error('Lỗi khi lấy dữ liệu Hóa đơn', error);
    });
  }


  GetHoaDonCtByHoaDon(id: number): void {
    console.log('id duoc truyen vao',id);
    if (!id) {
      console.error('ID của hóa đơn không hợp lệ:', id);
      return;
    }
    this.hoaDonService.getHoaDonChiTiet(id).subscribe(
      (response: any) => {
        if (response.status) {
          this.hoaDonChiTiet = response.result.content;
        } else {
          console.error('Không tìm thấy thông tin chi tiết hóa đơn.');
        }
      },
      (error) => {
        console.error('Lỗi khi lấy chi tiết hóa đơn:', error);
      }
    );
  }

  TaiHoaDon(chiTietId: number) {
    this.http.get(`http://localhost:8080/api/v1/pdf/download?id=${chiTietId}`, { responseType: 'blob' })
      .subscribe({
        next: (response) => {
          // Kiểm tra kiểu dữ liệu trả về
          const blob = new Blob([response], { type: 'application/pdf' }); // Thay đổi type nếu cần
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `hoa_don_${chiTietId}.pdf`; // Tên file tải về
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          
          Swal.fire({
            title: 'F5 Store xin thông báo : ',
            text: 'Tải hóa đơn thành công!!',
            icon: 'success',
            confirmButtonText: 'OK',
            customClass: {
              confirmButton: 'custom-confirm-button'
            }
          }); 
        },
        error: (error) => {
          // Xử lý lỗi ở đây
          if (error.error instanceof Blob) {
            const reader = new FileReader();
            reader.onload = () => {
              const errorMessage = JSON.parse(reader.result as string);
              Swal.fire({
                title: 'Lỗi xảy ra!',
                text: errorMessage.message || 'Có lỗi xảy ra trong quá trình tải hóa đơn.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            };
            reader.readAsText(error.error);
          } else {
            Swal.fire({
              title: 'Lỗi xảy ra!',
              text: 'Không thể tải hóa đơn. Vui lòng thử lại sau.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        }
      });
  }
  
  

  prevPage(): void {
    if (this.page > 0) {
      this.page--;
      this.getAllhoaDon(); // Gọi lại để tải dữ liệu cho trang trước
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.getAllhoaDon(); // Gọi lại để tải dữ liệu cho trang tiếp theo
    }
  }

  goToPage(pageNumber: number): void {
    this.page = pageNumber;
    this.getAllhoaDon(); // Gọi lại để tải dữ liệu cho trang đã chọn
  }

  

}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {HoaDonService} from './hoa-don.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {
  @Output() closePopup = new EventEmitter<void>();
  @Input() hoaDonId!: number;
  hoaDonChiTiet : any []= [];

  constructor(private http: HttpClient,
    private hoaDonService : HoaDonService
  ) { }

  ngOnInit() {
    this.GetHoaDonCtByHoaDon(this.hoaDonId);
  }
  
  close() {
    this.closePopup.emit();
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
}

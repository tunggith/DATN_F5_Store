import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BanHangService } from 'app/ban-hang.service';
@Component({
  selector: 'app-history-popup',
  templateUrl: './history-popup.component.html',
  styleUrls: ['./history-popup.component.scss']
})
export class HistoryPopupComponent implements OnInit {
  @Output() closePopup = new EventEmitter<void>();
  @Input() hoaDonId!: number;
  constructor(private banHangservice: BanHangService) { }
  hoaDonHistory: any[] = [];
  ngOnInit(): void {
    if (this.hoaDonId) {
      this.getHoaDonHistory(this.hoaDonId);
    }
  }
  close() {
    this.closePopup.emit();
  }
  getHoaDonHistory(id: number): void {
    this.banHangservice.getLichSuHoaDon(id).subscribe(
      data => {
        console.log(data);
        this.hoaDonHistory = data.result.content;
      },
      error => {
        console.error('Lỗi khi gọi API:', error);  // Kiểm tra nếu có lỗi
      }
    );
  }

}

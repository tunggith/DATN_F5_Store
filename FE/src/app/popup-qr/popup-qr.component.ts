import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-popup-qr',
  templateUrl: './popup-qr.component.html',
  styleUrls: ['./popup-qr.component.scss']
})
export class PopupQrComponent implements OnInit{
  @Output() closePopup = new EventEmitter<void>();
  @Output() confirmPayment = new EventEmitter<void>();

  ngOnInit(): void {}
  close() {
    this.closePopup.emit();
  }
  confirm():void{
    this.confirmPayment.emit();
  }
}

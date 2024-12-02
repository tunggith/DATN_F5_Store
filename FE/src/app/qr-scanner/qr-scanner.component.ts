import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { BanHangService } from 'app/ban-hang.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.scss']
})
export class QrScannerComponent implements AfterViewInit {
  @Input() activeInvoiceID!: number;
  @Output() closePopup = new EventEmitter<void>();
  @ViewChild('preview') previewElem!: ElementRef<HTMLVideoElement>;  // ViewChild tham chiếu video
  codeReader = new BrowserMultiFormatReader();
  isScanning = false; // Cờ để kiểm soát trạng thái quét
  debounceTimeout: any; // Để quản lý debounce

  constructor(private banHangService: BanHangService) { }

  ngAfterViewInit() {
    this.startScan();  // Bắt đầu quét khi view đã được khởi tạo hoàn toàn
  }

  // Bắt đầu quét QR
  startScan() {
    if (this.previewElem && !this.isScanning) {  // Chỉ bắt đầu nếu chưa quét
      this.isScanning = true;  // Đặt trạng thái quét thành true
      console.log(this.isScanning);
      this.codeReader.decodeFromVideoDevice(null, this.previewElem.nativeElement, (result, error) => {
        if (result) {
          console.log('QR Code Content:', result.getText());  // In ra nội dung QR
          this.stopScan();  // Dừng quét khi quét thành công
          this.processResult(result.getText());  // Xử lý dữ liệu (gửi lên backend)
        }
        if (error) {
          console.error(error);  // Hiển thị lỗi nếu có
        }
      });
    }
  }

  close() {
    this.stopScan();
    this.closePopup.emit();
  }

  // Dừng quét
  stopScan() {
    if (this.isScanning) {
      // Ngừng quét
      this.codeReader.decodeFromVideoDevice(null, null, null);
      console.log('QR Scanner stopped.');

      // Dừng tất cả các media tracks (Camera)
      const stream = this.previewElem.nativeElement.srcObject as MediaStream;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());  // Dừng tất cả các track
      }

      // Đặt lại trạng thái quét
      this.isScanning = false;
    }
  }


  // Xử lý dữ liệu mã QR
  processResult(qrData: string) {
    if (this.isScanning) {
      return;
    }
    console.log('Processed QR Data:', qrData);

    // Giả sử qrData chứa idSanPham (dạng số), cần parse về dạng số nguyên
    const idSanPham = parseInt(qrData, 10);

    // Kiểm tra nếu idSanPham không hợp lệ
    if (isNaN(idSanPham) || idSanPham <= 0) {
      console.error('Invalid QR data. Cannot process.');
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Dữ liệu mã QR không hợp lệ. Vui lòng thử lại.',
      });
      return;
    }
    // this.isScanning = true;
    // Hiển thị hộp thoại để nhập số lượng
    Swal.fire({
      title: 'Nhập số lượng sản phẩm',
      input: 'number', // Kiểu nhập là số
      inputPlaceholder: 'Nhập số lượng',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy',
      inputAttributes: {
        min: '1', // Giá trị tối thiểu
        step: '1', // Bước nhảy
      },
      customClass: {
        confirmButton: 'btn btn-success', // Thay đổi màu cho nút xác nhận
        cancelButton: 'btn btn-danger', // Thay đổi màu cho nút hủy
      },
      focusConfirm: false,
      preConfirm: (value) => {
        const soLuong = Number(value);
        if (isNaN(soLuong) || soLuong < 1) {
          Swal.showValidationMessage('Số lượng phải lớn hơn hoặc bằng 1. Vui lòng nhập lại.');
          return false; // Không đóng hộp thoại
        }
        return soLuong; // Trả về giá trị hợp lệ
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const soLuong = Number(result.value); // Lấy giá trị số lượng

        // Tạo đối tượng sản phẩm đã chọn với số lượng đã nhập
        const selectedProduct = {
          hoaDon: this.activeInvoiceID,
          chiTietSanPham: idSanPham,
          soLuong: soLuong,
        };

        // Gọi service để thêm sản phẩm vào hóa đơn
        this.banHangService.selectProduct(idSanPham, selectedProduct).subscribe(
          (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Thành công!',
              text: 'Chọn sản phẩm thành công!',
            });
            this.close(); // Đóng popup hoặc thực hiện các hành động khác
          },
          (error) => {
            this.handleError(error); // Xử lý lỗi
          }
        );
      }
    });
  }

  //=========xử lý lỗi=================
  private handleError(error: any): void {
    let errorMessage = 'Có lỗi xảy ra';
    if (error.error instanceof ErrorEvent) {
      // Lỗi từ phía client
      errorMessage = `Lỗi: ${error.error.message}`;
    } else {
      // Lỗi từ phía server
      errorMessage = `${error.error}`;
    }
    this.showErrorMessage(errorMessage);
  }

  // =================== Thông báo ===================
  showSuccessMessage(message: string) {
    Swal.fire({
      icon: 'success',
      title: 'Thành công!',
      text: message,
      showConfirmButton: false,
      timer: 1500
    });
  }

  showErrorMessage(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Thất bại!',
      text: message,
      showConfirmButton: false,
      timer: 1500
    });
  }

  showWarningMessage(message: string) {
    Swal.fire({
      icon: 'warning',
      title: 'Thất bại!',
      text: message,
      showConfirmButton: false,
      timer: 1500
    });
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DiaChiKhachHangService } from './dia-chi-khach-hang.service';
import Swal from 'sweetalert2';
import { error, log } from 'console';
import { GiaoHangNhanhService } from 'app/giao-hang-nhanh.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dia-chi-khach-hang',
  templateUrl: './dia-chi-khach-hang.component.html',
  styleUrls: ['./dia-chi-khach-hang.component.css']
})
export class DiaChiKhachHangComponent implements OnInit {
  @Output() closePopup = new EventEmitter<void>();
  @Input() idKhachHang !: number;

  //Địa chỉ khách hàng
  customersDiaChi: any[] = [];
  phuongXa: string = '';
  quanHuyen: string = '';
  tinhThanh: string = '';
  provinces: any[] = [];
  districts: any[] = [];
  wards: any[] = [];
  selectedTinhThanh: string;
  selectedQuanHuyen: string;
  selectedPhuongXa: string;
  page: number = 0;
  size: number = 2;
  pagination: any = [];
  idDiaChi: number = 0;
  diaChiForm: FormGroup;
  diaChiMoi: any = {
    soNha: '',
    duong: '',
    sdt: '',
    phuongXa: '',
    quanHuyen: '',
    tinhThanh: '',
    quocGia: '',
    loaiDiaChi: 'Nhà riêng',
    trangThai: 'Còn sử dụng'
  }

  constructor(
    private diaChiKhachHangService: DiaChiKhachHangService, 
    private giaoHangNhanhService: GiaoHangNhanhService,
    private fb: FormBuilder
  ) {
    this.diaChiForm = this.fb.group({
      soNha: ['', [Validators.required]],
      duong: ['', [Validators.required]],
      sdt: ['', [Validators.required, Validators.pattern('^[0-9]{10,11}$')]],
      phuongXa: ['', [Validators.required]],
      quanHuyen: ['', [Validators.required]], 
      tinhThanh: ['', [Validators.required]],
      quocGia: ['', [Validators.required]],
      loaiDiaChi: ['Nhà riêng'],
      trangThai: ['Còn sử dụng']
    });
  }

  ngOnInit(): void {
    this.loadDiaChi(this.idKhachHang);
    this.loadProvinces();
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

  // ================= Xử lý lỗi =================
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

  close() {
    this.closePopup.emit();
  }

  changePage(newPage: number): void {
    this.page = newPage;
    this.loadDiaChi(this.idKhachHang);
  }

  loadDiaChi(id: number): void {
    this.diaChiKhachHangService.getAllAddresses(id, this.page, this.size).subscribe(
      (response: any) => {
        if (response.status) {
          this.customersDiaChi = response.result.content.content;
          this.pagination = response.result.pagination;
        }
      },
      (error) => {
        console.error('Lỗi khi gọi API địa chỉ:', error);
      }
    );
  }

  diaChiDetail(id: number): void {
    this.diaChiKhachHangService.chiTietDiaChi(id).subscribe(response => {
      this.diaChiMoi = response.result.content;
      this.idDiaChi = id;
      
      // Fill form với dữ liệu cơ bản
      this.diaChiForm.patchValue({
        soNha: this.diaChiMoi.soNha,
        duong: this.diaChiMoi.duong,
        sdt: this.diaChiMoi.sdt,
        quocGia: this.diaChiMoi.quocGia,
        loaiDiaChi: this.diaChiMoi.loaiDiaChi,
        trangThai: this.diaChiMoi.trangThai
      });

      // Load tỉnh thành và tìm ID tương ứng
      this.giaoHangNhanhService.getProvinces().subscribe(data => {
        this.provinces = data['data'];
        const province = this.provinces.find(p => p.ProvinceName === this.diaChiMoi.tinhThanh);
        if (province) {
          this.selectedTinhThanh = province.ProvinceID.toString(); // Chuyển sang string
          this.tinhThanh = province.ProvinceName;
          
          // Trigger change detection cho select tỉnh thành
          setTimeout(() => {
            this.diaChiForm.patchValue({tinhThanh: province.ProvinceID.toString()});
          });

          // Load quận huyện sau khi có tỉnh thành
          this.giaoHangNhanhService.getDistricts(province.ProvinceID).subscribe(districtData => {
            this.districts = districtData['data'];
            const district = this.districts.find(d => d.DistrictName === this.diaChiMoi.quanHuyen);
            if (district) {
              this.selectedQuanHuyen = district.DistrictID.toString(); // Chuyển sang string
              this.quanHuyen = district.DistrictName;
              this.diaChiForm.patchValue({quanHuyen: district.DistrictID.toString()}); // Cập nhật giá trị select

              // Load phường xã sau khi có quận huyện  
              this.giaoHangNhanhService.getWards(district.DistrictID).subscribe(wardData => {
                this.wards = wardData['data'];
                const ward = this.wards.find(w => w.WardName === this.diaChiMoi.phuongXa);
                if (ward) {
                  this.selectedPhuongXa = ward.WardCode;
                  this.phuongXa = ward.WardName;
                  this.diaChiForm.patchValue({phuongXa: ward.WardCode}); // Cập nhật giá trị select
                }
              });
            }
          });
        }
      });

    }, error => {
      console.error('Error fetching address details:', error);
      this.handleError(error);
    });
  }

  createDiaChi(): void {
    if (this.diaChiForm.valid) {
      const diaChiData = {
        ...this.diaChiForm.value,
        idKhachHang: this.idKhachHang,
        phuongXa: this.phuongXa,
        quanHuyen: this.quanHuyen,
        tinhThanh: this.tinhThanh
      };

      // Kiểm tra số điện thoại
      const sdt = this.diaChiForm.get('sdt').value;
      if (!sdt || !/^[0-9]{10,11}$/.test(sdt)) {
        this.showWarningMessage("Số điện thoại không hợp lệ!");
        return;
      }
      diaChiData.sdt = sdt;

      this.diaChiKhachHangService.addDiaChiKhachHang(diaChiData).subscribe(
        response => {
          this.showSuccessMessage("Thêm địa chỉ thành công!");
          this.loadDiaChi(this.idKhachHang);
          this.diaChiForm.reset();
          // Reset các giá trị khác
          this.phuongXa = '';
          this.quanHuyen = '';
          this.tinhThanh = '';
          this.selectedPhuongXa = '';
          this.selectedQuanHuyen = '';
          this.selectedTinhThanh = '';
        },
        error => {
          this.handleError(error);
        }
      );
    } else {
      this.showWarningMessage("Vui lòng điền đầy đủ thông tin!");
    }
  }

  updateDiaChi(): void {
    if (this.diaChiForm.valid) {
      const diaChiData = {
        ...this.diaChiForm.value,
        id: this.idDiaChi,
        idKhachHang: this.idKhachHang,
        phuongXa: this.phuongXa,
        quanHuyen: this.quanHuyen,
        tinhThanh: this.tinhThanh
      };

      // Kiểm tra số điện thoại
      const sdt = this.diaChiForm.get('sdt').value;
      if (!sdt || !/^[0-9]{10,11}$/.test(sdt)) {
        this.showWarningMessage("Số điện thoại không hợp lệ!");
        return;
      }
      diaChiData.sdt = sdt;

      this.diaChiKhachHangService.updateDiaChiKhachHang(this.idDiaChi, diaChiData).subscribe(
        response => {
          this.showSuccessMessage("Cập nhật thành công!");
          this.loadDiaChi(this.idKhachHang);
        },
        error => {
          this.handleError(error);
        }
      );
    } else {
      this.showWarningMessage("Vui lòng điền đầy đủ thông tin!");
    }
  }

  loadProvinces(): void {
    this.giaoHangNhanhService.getProvinces().subscribe(
      data => {
        this.provinces = data['data'];
      },
      error => {
        console.error('Lỗi khi tải danh sách tỉnh/thành:', error);
      }
    );
  }

  onTinhThanhChange(event: any): void {
    const provinceId = event.target.value;
    this.selectedTinhThanh = provinceId;
    this.tinhThanh = this.provinces.find(p => p.ProvinceID === Number(provinceId))?.ProvinceName || '';

    // Làm mới danh sách huyện và xã khi tỉnh thay đổi
    this.districts = []; // Xóa danh sách huyện
    this.wards = []; // Xóa danh sách xã
    this.selectedQuanHuyen = ''; // Đặt huyện đã chọn về null
    this.selectedPhuongXa = ''; // Đặt xã đã chọn về null
    this.quanHuyen = ''; // Xóa tên huyện
    this.phuongXa = ''; // Xóa tên xã

    // Cập nhật địa chỉ
    this.diaChiForm.patchValue({ diaChi: `${this.phuongXa}, ${this.quanHuyen}, ${this.tinhThanh}` });

    this.giaoHangNhanhService.getDistricts(provinceId).subscribe(
        data => {
            this.districts = data['data'];
        },
        error => console.error('Lỗi khi tải danh sách quận/huyện:', error)
    );
}

onQuanHuyenChange(event: any): void {
    const districtId = event.target.value;
    this.selectedQuanHuyen = districtId;
    this.quanHuyen = this.districts.find(d => d.DistrictID === Number(districtId))?.DistrictName || '';

    // Làm mới danh sách xã khi huyện thay đổi
    this.wards = []; // Xóa danh sách xã
    this.selectedPhuongXa = ''; // Đặt xã đã chọn về null
    this.phuongXa = ''; // Xóa tên xã

    // Cập nhật địa chỉ
    this.diaChiForm.patchValue({ diaChi: `${this.phuongXa}, ${this.quanHuyen}, ${this.tinhThanh}` });

    // Lấy danh sách xã mới cho huyện đã chọn
    this.giaoHangNhanhService.getWards(districtId).subscribe(
        data => this.wards = data['data'],
        error => console.error('Lỗi khi tải danh sách phường/xã:', error)
    );
}

onPhuongXaChange(event: any): void {
    const wardCode = event.target.value;
    this.selectedPhuongXa = wardCode;
    const foundWard = this.wards.find(w => w.WardCode === wardCode);

    this.phuongXa = foundWard ? foundWard.WardName : '';

    // Cập nhật địa chỉ
    this.diaChiForm.patchValue({ diaChi: `${this.phuongXa}, ${this.quanHuyen}, ${this.tinhThanh}` });
}

  resetForm(): void {
    this.diaChiForm.reset({
      soNha: '',
      duong: '',
      sdt: '',
      phuongXa: '',
      quanHuyen: '',
      tinhThanh: '',
      quocGia: '',
      loaiDiaChi: 'Nhà riêng',
      trangThai: 'Còn sử dụng'
    });
    
    // Reset các giá trị select
    this.phuongXa = '';
    this.quanHuyen = '';
    this.tinhThanh = '';
    this.selectedPhuongXa = '';
    this.selectedQuanHuyen = '';
    this.selectedTinhThanh = '';
    
    // Reset danh sách quận/huyện và phường/xã
    this.districts = [];
    this.wards = [];
  }

}

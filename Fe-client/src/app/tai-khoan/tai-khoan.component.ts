import { Component, OnInit } from '@angular/core';
import { DangNhapService } from '../dang-nhap/dang-nhap.service';
import { DatePipe } from '@angular/common';
import Swal from "sweetalert2";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tai-khoan',
  templateUrl: './tai-khoan.component.html',
  styleUrls: ['./tai-khoan.component.css'],
  providers: [DatePipe]
})
export class TaiKhoanComponent implements OnInit {
  urlAnh: string = 'assets/default-person-icon.png'; // Đường dẫn ảnh mặc định
  diaCHiData: any[] =[];
  khachHang = {
    id:0,
    ma: '',
    ten: '',
    gioiTinh: 0,
    sdt: '',
    email: '',
    ngayThangNamSinh: '',
    anh: ''
  };
  diaChi: any[] = [];
  errors: any = {}; // Dùng để lưu lỗi cho từng trường
  idKhachHang: number = 0;
  constructor(
    private dangNhapService: DangNhapService,
    private datePipe: DatePipe,
    private fb: FormBuilder
    
  ) {

    {
      // Khởi tạo form
      this.diaChiForm = this.fb.group({
        idKhachHang: [],
        soNha: ['', Validators.required],
        sdt: ['', [Validators.required, Validators.pattern(/^[0-9]{10,11}$/)]],
        duong: ['', Validators.required],
        phuongXa: ['', Validators.required],
        quanHuyen: ['', Validators.required],
        tinhThanh: ['', Validators.required],
        quocGia: ['Việt Nam'],
        loaiDiaChi: ['Nhà riêng', Validators.required],
        trangThai: ['Còn sử dụng']
      });

    }
   }

  ngOnInit(): void {
    this.loadData();
  }


  loadData():void{
    this.detailKhachHang();
    this.getDiaChiKhachHang();
    this.loadProvinces();
  }


  // Kiểm tra tên khách hàng hợp lệ
  isValidName(name: string): boolean {
    const nameRegex = /^[A-Za-zÀ-ỹ\s]+$/; // Chỉ cho phép chữ cái và khoảng trắng
    return nameRegex.test(name) && name.length <= 50;
  }

// Kiểm tra tuổi hợp lệ
  isValidAge(dateOfBirth: string): boolean {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();

    // Nếu chưa qua sinh nhật năm nay thì trừ 1 năm
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age > 3 && age < 110;
  }

// Kiểm tra lỗi các trường
  validateForm() {
    this.errors = {}; // Reset lỗi

    // Kiểm tra họ tên
    if (!this.khachHang.ten.trim()) {
      this.errors.ten = 'Họ tên không được bỏ trống';
    } else if (!this.isValidName(this.khachHang.ten)) {
      this.errors.ten = 'Họ tên không hợp lệ (chỉ cho phép chữ và không vượt quá 50 ký tự)';
    }

    // Kiểm tra ngày tháng năm sinh và tuổi hợp lệ
    if (!this.khachHang.ngayThangNamSinh) {
      this.errors.ngayThangNamSinh = 'Ngày tháng năm sinh không được bỏ trống';
    } else if (!this.isValidAge(this.khachHang.ngayThangNamSinh)) {
      this.errors.ngayThangNamSinh = 'Tuổi phải lớn hơn 3 và nhỏ hơn 110';
    }

    // Kiểm tra email
    if (!this.khachHang.email || !this.isValidEmail(this.khachHang.email)) {
      this.errors.email = 'Email không hợp lệ';
    }

    // Kiểm tra số điện thoại
    if (!this.khachHang.sdt || !this.isValidPhoneNumber(this.khachHang.sdt)) {
      this.errors.sdt = 'Số điện thoại không hợp lệ';
    }
  }

  // Kiểm tra email hợp lệ
  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  // Kiểm tra số điện thoại hợp lệ
  isValidPhoneNumber(sdt: string): boolean {
    const phoneRegex = /^[0-9]{10,11}$/; // Giả sử số điện thoại là 10-11 chữ số
    return phoneRegex.test(sdt);
  }

  // Lấy thông tin tài khoản
  detailKhachHang() {
    const id = localStorage.getItem('id') || '';
    if (id) {
      this.dangNhapService.detailKhachHang(id).subscribe(
        data => {
          this.khachHang = data.result.content;
          this.khachHang.gioiTinh = Number(this.khachHang.gioiTinh);
          this.khachHang.ngayThangNamSinh = this.datePipe.transform(this.khachHang.ngayThangNamSinh, 'yyyy-MM-dd') || '';
          if (![0, 1, 2].includes(this.khachHang.gioiTinh)) {
            this.khachHang.gioiTinh = 0; // Giá trị mặc định là Nữ
          }
          if (!this.khachHang.anh) {
            this.khachHang.anh = this.urlAnh;
          }

         
          this.idKhachHang = this.khachHang.id;
          console.log("id khách hàng là ",this.idKhachHang);
        },
        error => {
          console.error("Không thể lấy thông tin khách hàng:", error);
          Swal.fire({
            title: 'Lỗi!',
            text: 'Không thể lấy thông tin tài khoản. Vui lòng thử lại.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
    }
  }

  // Lấy địa chỉ khách hàng
  getDiaChiKhachHang() {
    const id = localStorage.getItem('id') || '';
    if (id !== '') {
      this.dangNhapService.diaChiKhachHang(id).subscribe(
        data => {
          
          console.log("địa data chỉ lấy ra là",data)
          this.diaChi = data;
          this.diaCHiData = data.result.content;
          console.log("địa chỉ lấy ra là",this.diaChi)
          console.log("địa chỉ data lấy ra là",this.diaCHiData)
        },
        error => {
          console.error("Không thể lấy địa chỉ khách hàng:", error);
        }
      );
    }
  }

  // Định dạng địa chỉ đầy đủ
  formatDiaChi(diaChiItem: any): string {
    return `${diaChiItem.soNha}, ${diaChiItem.duong}, ${diaChiItem.phuongXa}, ${diaChiItem.quanHuyen}, ${diaChiItem.tinhThanh}, ${diaChiItem.quocGia}`;
  }

  // Xử lý khi người dùng chọn ảnh
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.khachHang.anh = e.target.result; // Đặt đường dẫn ảnh
      };
      reader.readAsDataURL(file); // Đọc file ảnh
    }
  }

  // Cập nhật thông tin khách hàng
  updateKhachHang() {
    this.validateForm();
    if (Object.keys(this.errors).length === 0) {  // Kiểm tra nếu không có lỗi
      const id = localStorage.getItem('id') || '';
      if (id !== '') {
        this.dangNhapService.updateKhachHang(id, this.khachHang).subscribe(
          (response) => {
            Swal.fire({
              title: 'Thành công!',
              text: 'Cập nhật thông tin khách hàng thành công!',
              icon: 'success',
              confirmButtonText: 'OK'
            });
          },
          (error) => {
            console.error('Lỗi khi cập nhật thông tin khách hàng:', error);
            Swal.fire({
              title: 'Lỗi!',
              text: 'Đã xảy ra lỗi, vui lòng thử lại.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        );
      } else {
        Swal.fire({
          title: 'Cảnh báo!',
          text: 'Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
      }
    }
  }

   // Danh sách địa chỉ của khách hàng
   customersDiaChi: any[] = [];
   // Các biến hỗ trợ chọn địa chỉ
   phuongXa: string = '';
   quanHuyen: string = '';
   tinhThanh: string = '';
   ListTinhThanh: any[] = [];
   districts: any[] = [];
   wards: any[] = [];
   // Biến điều khiển phân trang
   page: number = 0;
   size: number = 2;
   pagination: any = [];
   idTinhThanh: number = 0;

   idTinh: number = 0
   idXa: number = 0
   idhuyen: number = 0
   
   tenTinh: String = ''
   tenXa: String = ''
   tenhuyen: String = ''
 
   // Biến kiểm soát popup
   isPopupVisible: boolean = false;
 
   // Form quản lý địa chỉ
   diaChiForm: FormGroup;
 
   // Địa chỉ mới (template để thêm địa chỉ)
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
   };
 
   
    
 
 
   // Hàm load danh sách tỉnh thành
   loadProvinces() {
     this.dangNhapService.getProvinces().subscribe({
       next: (data: any) => {
         this.ListTinhThanh = data?.data || [];
         console.log('Danh sách tỉnh thành:', this.ListTinhThanh);
       },
       error: (err) => console.error('Lỗi khi tải tỉnh thành:', err)
     });
   }
 
   onTinhThanhChange(event: any): void {
    const tinhThanhId = event.target.value;
    if (tinhThanhId) {
      this.dangNhapService.getDistricts(Number(tinhThanhId)).subscribe({
        next: (data: any) => {
          this.districts = data?.data || [];
          console.log('Danh sách quận/huyện:', this.districts);
          this.diaChiForm.patchValue({ quanHuyen: '', phuongXa: '' });
          this.wards = [];
        },
        error: (err) => console.error('Lỗi khi tải quận huyện:', err)
      });
    }
  }
  
  onQuanHuyenChange(event: any): void {
    const districtId = event.target.value;
  
    if (districtId) {
      this.dangNhapService.getWards(Number(districtId)).subscribe({
        next: (data: any) => {
          this.wards = data?.data || [];
          console.log('Danh sách phường/xã:', this.wards);
  
          // Reset phường xã trong form khi quận huyện thay đổi
          this.diaChiForm.patchValue({ phuongXa: '' });
  
          // Gọi hàm cập nhật khách hàng nếu cần
          this.updateKhachHangAfterDistrictChange(districtId);
        },
        error: (err) => console.error('Lỗi khi tải phường xã:', err)
      });
    }
  }
  
  // Hàm gọi updateKhachHang sau khi Quận Huyện được thay đổi
  updateKhachHangAfterDistrictChange(districtId: number): void {
    // Chuẩn bị dữ liệu cập nhật
    const formValue = this.diaChiForm.value;
    const updatedCustomerData = {
      id: this.khachHang.id,
      ma: this.khachHang.ma,
      ten: this.khachHang.ten,
      gioiTinh: this.khachHang.gioiTinh.toString(),
      ngayThangNamSinh: this.datePipe.transform(this.khachHang.ngayThangNamSinh, 'yyyy-MM-ddTHH:mm:ss') || '',
      email: this.khachHang.email,
      roles: 'USER', // Giữ vai trò mặc định
      anh: this.khachHang.anh || this.urlAnh,
      sdt: this.khachHang.sdt,
      userName: this.khachHang.ma, // Dùng mã khách hàng làm username
      password: '', // Để trống nếu không cần thay đổi mật khẩu
      trangThai: 'Hoạt động', // Giá trị mặc định
      diaChi: {
        soNha: formValue.soNha,
        duong: formValue.duong,
        quanHuyen: this.districts.find(district => district.DistrictID === Number(districtId))?.DistrictName || '',
        phuongXa: this.wards.find(ward => ward.WardCode === formValue.phuongXa)?.WardName || '',
        tinhThanh: this.ListTinhThanh.find(province => province.ProvinceID === Number(formValue.tinhThanh))?.ProvinceName || ''
      }
    };
  
    // Gọi API update khách hàng
    this.dangNhapService.updateDiaChiKhachHang(this.khachHang.id, updatedCustomerData).subscribe({
      next: (response) => {
        console.log('Cập nhật thành công:', response);
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Cập nhật thông tin khách hàng thành công sau khi thay đổi quận/huyện!',
          confirmButtonText: 'OK'
        });
      },
      error: (err) => {
       console.log("lỗi gì đó rồi:) ")
      }
    });
  }
  

 
   // Hàm chỉnh sửa địa chỉ
   editAddress(address: any) {
     this.diaChiForm.patchValue(address);
     this.openPopup();
   }
 
   // Hàm xóa địa chỉ
   deleteAddress(id: any) {
     this.customersDiaChi = this.customersDiaChi.filter((addr) => addr.id !== id);
     console.log('Danh sách địa chỉ sau khi xóa:', this.customersDiaChi);
   }
 

   diaChiDangSua: any = null; // Địa chỉ đang được chỉnh s
   isEditing: boolean = false; // Kiểm tra chế độ sửa

   openPopup(diaChi: any = null): void {
    console.log('Địa chỉ đang chỉnh sửa:', diaChi);
  
    if (diaChi) {
      // Trạng thái chỉnh sửa
      this.isEditing = true;
      this.diaChiDangSua = diaChi; // Lưu địa chỉ đang chỉnh sửa
      console.log('Địa chỉ đang sửa là', this.diaChiDangSua);
  
      // Tìm ProvinceID từ ProvinceName
      const selectedTinhThanh = this.ListTinhThanh.find(
        tinh => tinh.ProvinceName.trim().toLowerCase() === diaChi.tinhThanh.trim().toLowerCase()
      );
  
      if (selectedTinhThanh) {
        // Gán giá trị Tỉnh Thành vào form và load Quận/Huyện
        this.diaChiForm.patchValue({ tinhThanh: selectedTinhThanh.ProvinceID });
        this.onTinhThanhChange({ target: { value: selectedTinhThanh.ProvinceID } } as any);
  
        setTimeout(() => {
          // Tìm DistrictID từ DistrictName sau khi danh sách được load
          const selectedQuanHuyen = this.districts.find(
            huyen => huyen.DistrictName.trim().toLowerCase() === diaChi.quanHuyen.trim().toLowerCase()
          );
          if (selectedQuanHuyen) {
            this.diaChiForm.patchValue({ quanHuyen: selectedQuanHuyen.DistrictID });
            this.onQuanHuyenChange({ target: { value: selectedQuanHuyen.DistrictID } } as any);
  
            setTimeout(() => {
              // Tìm WardCode từ WardName sau khi danh sách được load
              const selectedPhuongXa = this.wards.find(
                xa => xa.WardName.trim().toLowerCase() === diaChi.phuongXa.trim().toLowerCase()
              );
              if (selectedPhuongXa) {
                this.diaChiForm.patchValue({ phuongXa: selectedPhuongXa.WardCode });
              }
              console.log('selectedPhuongXa:', selectedPhuongXa);
            }, 300); // Thời gian chờ để load wards
          }
          console.log('selectedQuanHuyen:', selectedQuanHuyen);
        }, 300); // Thời gian chờ để load districts
      }
  
      console.log('selectedTinhThanh:', selectedTinhThanh);
  
      // Gán các trường khác vào form
      this.diaChiForm.patchValue({
        soNha: diaChi.soNha,
        duong: diaChi.duong,
        sdt: diaChi.sdt,
        loaiDiaChi: diaChi.loaiDiaChi || 'Nhà riêng'
      });
    } else {
      // Trạng thái thêm mới
      this.isEditing = false;
      this.diaChiDangSua = null;
      this.diaChiForm.reset(); // Reset form cho trường hợp thêm mới
    }
  
    this.isPopupVisible = true; // Hiển thị popup
  }
  
  
  
  
 
   // Đóng popup
closePopup() {
     this.isPopupVisible = false;
     this.diaChiForm.reset();
   }
createDiaChi() {
    console.log('Đã vào thêm địa chỉ');
  
    if (this.diaChiForm.valid) {
      const formValue = this.diaChiForm.value;
  
      // Kiểm tra trường hợp Quận/Huyện trống
      if (!formValue.quanHuyen) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Quận/Huyện không được để trống.',
          confirmButtonText: 'OK'
        });
        return; // Dừng thực hiện nếu Quận/Huyện không được chọn
      }
  
console.log('Form Value:', formValue);
console.log('ListTinhThanh:', this.ListTinhThanh);
console.log('Districts:', this.districts);
console.log('Wards:', this.wards);

const tinhThanhName = this.ListTinhThanh.find(province => province.ProvinceID === Number(formValue.tinhThanh))?.ProvinceName || '';
const quanHuyenName = this.districts.find(district => district.DistrictID === Number(formValue.quanHuyen))?.DistrictName || '';
const phuongXaName = this.wards.find(ward => ward.WardCode === formValue.phuongXa)?.WardName || '';


const selectedTinhThanh = this.ListTinhThanh.find(province => province.ProvinceName === tinhThanhName)?.ProvinceID || '';
const selectedQuanHuyen = this.districts.find(district => district.DistrictName === quanHuyenName)?.DistrictID || '';
const selectedPhuongXa = this.wards.find(ward => ward.WardName === phuongXaName)?.WardCode || '';


      console.log("tinhThanhName",tinhThanhName)
      console.log("quanHuyenName",quanHuyenName)
      console.log("phuongXaName",phuongXaName)


      console.log("selectedTinhThanh",selectedTinhThanh)
      console.log("selectedQuanHuyen",selectedQuanHuyen)
      console.log("selectedPhuongXa",selectedPhuongXa)


      const params = {
        idKhachHang: this.idKhachHang,
        soNha: formValue.soNha,
        sdt: formValue.sdt,
        duong: formValue.duong,
        phuongXa: phuongXaName,
        quanHuyen: quanHuyenName,
        tinhThanh: tinhThanhName,
        quocGia: 'Việt Nam',
        loaiDiaChi: formValue.loaiDiaChi,
        trangThai: 'Còn sử dụng'
      };
  
      this.dangNhapService.addDiaChi(params).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Thành công!',
            text: 'Địa chỉ được thêm thành công!',
            confirmButtonText: 'OK'
          });
          this.closePopup();
          this.loadData();
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Lỗi!',
            text: err.error || 'Có lỗi xảy ra khi thêm địa chỉ. Vui lòng thử lại.',
            confirmButtonText: 'OK'
          });
          console.error('Lỗi khi thêm địa chỉ:', err);
        }
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Thông tin chưa đầy đủ',
        text: 'Vui lòng điền đầy đủ thông tin trong form.',
        confirmButtonText: 'OK'
      });
    }
  }
  
  submitDiaChi(): void {
    if (this.diaChiForm.valid) {
      const formValue = this.diaChiForm.value;
  
      const diaChiData = {
        id: this.isEditing ? this.diaChiDangSua.id : 0, // ID chỉ có khi chỉnh sửa
        idKhachHang: this.idKhachHang,
        soNha: formValue.soNha,
        sdt: formValue.sdt,
        duong: formValue.duong,
        phuongXa: this.wards.find(ward => ward.WardCode === formValue.phuongXa)?.WardName || '',
        quanHuyen: this.districts.find(district => district.DistrictID === Number(formValue.quanHuyen))?.DistrictName || '',
        tinhThanh: this.ListTinhThanh.find(province => province.ProvinceID === Number(formValue.tinhThanh))?.ProvinceName || '',
        quocGia: 'Việt Nam',
        loaiDiaChi: formValue.loaiDiaChi || 'Nhà riêng',
        trangThai: 'Còn sử dụng'
      };
  
      console.log('Dữ liệu gửi đến API:', diaChiData); // Log dữ liệu trước khi gửi
      console.log('Dữ liệu  isEditing gửi đến API:', this.isEditing); // Log dữ liệu trước khi gửi
  
      if (this.isEditing) {
        console.log("update địa chỉ")
        // Gọi API cập nhật
        this.dangNhapService.updateDiaChi(diaChiData.id, diaChiData).subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Thành công!',
              text: 'Cập nhật địa chỉ thành công!',
              confirmButtonText: 'OK'
            });
            this.loadData(); // Làm mới danh sách địa chỉ
            this.closePopup();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Lỗi!',
              text: 'Đã xảy ra lỗi khi cập nhật địa chỉ.',
              confirmButtonText: 'OK'
            });
            console.error('Lỗi khi cập nhật địa chỉ:', err);
          }
        });
      } else {
        // Gọi API thêm mới
        this.dangNhapService.addDiaChi(diaChiData).subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Thành công!',
              text: 'Thêm địa chỉ thành công!',
              confirmButtonText: 'OK'
            });
            this.loadData(); // Làm mới danh sách địa chỉ
            this.closePopup();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Lỗi!',
              text: 'Đã xảy ra lỗi khi thêm địa chỉ.',
              confirmButtonText: 'OK'
            });
            console.error('Lỗi khi thêm địa chỉ:', err);
          }
        });
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Thông báo!',
        text: 'Vui lòng điền đầy đủ thông tin!',
        confirmButtonText: 'OK'
      });
    }
  }
  
  
  
  
  updateCustomer() {
    // Kiểm tra form trước khi gửi
    this.validateForm();
    if (Object.keys(this.errors).length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Vui lòng kiểm tra thông tin và thử lại.',
        confirmButtonText: 'OK'
      });
      return;
    }
  
    // Cấu trúc dữ liệu gửi đi
    const customerData = {
      id: this.khachHang.id,
      ma: this.khachHang.ma,
      ten: this.khachHang.ten,
      gioiTinh: this.khachHang.gioiTinh.toString(),
      ngayThangNamSinh: this.datePipe.transform(this.khachHang.ngayThangNamSinh, 'yyyy-MM-ddTHH:mm:ss') || '',
      email: this.khachHang.email,
      roles: 'USER', // Giá trị mặc định
      anh: this.khachHang.anh || this.urlAnh,
      sdt: this.khachHang.sdt,
      userName: this.khachHang.ma, // Tạm thời dùng mã khách hàng làm username
      password: '', // Để trống nếu không cần cập nhật mật khẩu
      trangThai: 'Hoạt động' // Giá trị mặc định
    };
  
    // Gọi API cập nhật thông tin
    this.dangNhapService.updateDiaChiKhachHang(this.idKhachHang, customerData).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Cập nhật thông tin khách hàng thành công!',
          confirmButtonText: 'OK'
        });
        console.log('Cập nhật thành công:', response);
      },
      error: (err) => {
        console.error('Lỗi khi cập nhật thông tin khách hàng:', err);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Đã xảy ra lỗi khi cập nhật thông tin. Vui lòng thử lại.',
          confirmButtonText: 'OK'
        });
      }
    });
  }
  
}


import {Component, OnInit} from '@angular/core';
import {MapsService} from './nhan-vien.service';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { GiaoHangNhanhService } from 'app/giao-hang-nhanh.service';
import Swal from 'sweetalert2';
import {DatePipe} from '@angular/common';
import { response } from 'express';

declare const google: any;

@Component({
    selector: 'app-nhan-vien',
    templateUrl: './nhan-vien.component.html',
    styleUrls: ['./nhan-vien.component.css'],
    providers: [DatePipe] // Đăng ký DatePipe ở đây
})
export class NhanVienComponent implements OnInit {

    nhanVienForm: FormGroup;
    validationErrors: any = {};  // Lưu lỗi từ backend
    nhanViens: any[] = [];
    searchKeyword: string = '';
    newNhanVien: any = {
        gioiTinh: '1',
        trangThai: 'Hoạt động',
        anh: null
    };  // Biến lưu thông tin nhân viên mới

    updateNhanVienData: any = {
        gioiTinh: '1',
        trangThai: 'Hoạt động',
        anh: null
    }; // Biến lưu thông tin nhân viên cần cập nhật

    // Biến quản lý phân trang
    page = 0;
    size = 5;
    currentPage: any = null;
    totalPages: number = 0;

    phuongXa: string = '';
    quanHuyen: string = '';
    tinhThanh: string = '';
    provinces: any[] = [];
    districts: any[] = [];
    wards: any[] = [];
    selectedTinhThanh: string;
    selectedQuanHuyen: string;
    selectedPhuongXa: string;

    constructor(private mapsService: MapsService, private giaoHangNhanhService: GiaoHangNhanhService, private datePipe: DatePipe, private fb: FormBuilder) {
        this.nhanVienForm = this.fb.group({
            ma: [''],
            ten: ['', Validators.required],
            ngayThangNamSinh: ['', [Validators.required, this.validateAge]],
            sdt: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
            diaChi: [{ value: '', disabled: true }],
            username: [''],
            password: [''],
            email: ['', [Validators.required, Validators.email]],
            anh: [''],
            gioiTinh: ['1'],
            trangThai: ['Hoạt động'],
            tinhThanh: ['', Validators.required], // Tỉnh/ thành
            quanHuyen: ['', Validators.required], // Quận/ huyện
            phuongXa: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        this.loadNhanVien(this.currentPage);
        this.loadProvinces();
    }


    loadNhanVien(page: number): void {
        this.mapsService.getAllNhanVien(this.page, this.size).subscribe(
            (response: any) => {
                if (response.status) {
                    this.nhanViens = response.result.content.content; // Lấy danh sách nhân viên
                    this.totalPages = response.result.content.totalPages; // Tính tổng số trang
                }
            },
            (error) => {
                console.error('Lỗi khi gọi API:', error);
            }
        );
    }

    // Tải danh sách tỉnh/thành
    loadProvinces(): void {
        this.giaoHangNhanhService.getProvinces().subscribe(
            data => {
                this.provinces = data['data'];  // Gán dữ liệu vào 'provinces'
            },
            error => {
                console.error('Lỗi khi tải danh sách tỉnh/thành:', error);
            }
        );
    }

    // Xử lý khi thay đổi tỉnh/thành
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
        this.nhanVienForm.patchValue({ diaChi: `${this.phuongXa}, ${this.quanHuyen}, ${this.tinhThanh}` });

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
        this.nhanVienForm.patchValue({ diaChi: `${this.phuongXa}, ${this.quanHuyen}, ${this.tinhThanh}` });

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
        this.nhanVienForm.patchValue({ diaChi: `${this.phuongXa}, ${this.quanHuyen}, ${this.tinhThanh}` });
    }



    onFileSelected(event: Event): void {
        const fileInput = event.target as HTMLInputElement;
        if (fileInput.files && fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const reader = new FileReader();

            reader.onload = (e: any) => {
                this.newNhanVien.anh = e.target.result; // Lưu URL ảnh vào đối tượng nhân viên
                this.nhanVienForm.patchValue({anh: this.newNhanVien.anh}); // Cập nhật form
            };
            reader.readAsDataURL(file); // Đọc file và tạo URL
        }
    }

    prevPage(): void {
        if (this.page > 0) {
            this.page--;
            this.loadNhanVien(this.currentPage); // Gọi lại để tải dữ liệu cho trang trước
        }
    }

    nextPage(): void {
        if (this.page < this.totalPages - 1) {
            this.page++;
            this.loadNhanVien(this.currentPage); // Gọi lại để tải dữ liệu cho trang tiếp theo
        }
    }

    goToPage(pageNumber: number): void {
        this.page = pageNumber;
        this.loadNhanVien(this.currentPage); // Gọi lại để tải dữ liệu cho trang đã chọn
    }

    // Tìm kiếm nhân viên theo mã hoặc tên
    searchNhanVien(): void {
        if (!this.searchKeyword || this.searchKeyword.trim() === '') {
            this.loadNhanVien(this.currentPage);
            return;
        }

        // Tìm kiếm nhân viên
        this.mapsService.searchNhanVien(0, 1000, this.searchKeyword.trim()).subscribe((response) => {
            if (response && response.result && response.result.content && response.result.content.content) {
                this.nhanViens = response.result.content.content;
            } else {
                console.warn('Không tìm thấy kết quả tìm kiếm.');
                this.nhanViens = [];
            }
        }, (error) => {
            console.error('Lỗi khi gọi API:', error);
        });
    }

    //button làm mới form
    onReset() {
        this.nhanVienForm.reset({
            gioiTinh: '1',      // Đặt lại giới tính là "Nam"
            trangThai: 'Hoạt động' // Đặt lại trạng thái là "Hoạt động"
        });
        this.newNhanVien.anh = null;
    }


    // Thêm nhân viên
    createNhanVien() {
        if (this.nhanVienForm.valid) {
            this.newNhanVien = {...this.nhanVienForm.getRawValue()}; // Lưu dữ liệu vào newNhanVien
            this.mapsService.createNhanVien(this.newNhanVien).subscribe({
                next: (response) => {
                    if (response && response.status && response.result) {
                        console.log('Nhân viên đã được thêm thành công', response);
                        this.loadNhanVien(this.currentPage);

                        Swal.fire({
                            title: 'Thành công!',
                            text: 'Nhân viên đã được thêm thành công.',
                            icon: 'success',
                            confirmButtonText: 'OK'
                        });

                        // Đặt lại các trường trạng thái, giới tính
                        this.onReset();
                    } else {
                        // Nếu không có phản hồi thành công, hiển thị thông báo lỗi
                        Swal.fire({
                            title: 'Lỗi!',
                            text: 'Mã nhân viên đã tồn tại. Vui lòng kiểm tra lại.',
                            icon: 'warning',
                            confirmButtonText: 'OK'
                        });
                    }
                },
                error: (errors) => {
                    if (errors.status === 400 && errors.error) {
                        this.validationErrors = errors.error;

                        Swal.fire({
                            title: 'Lỗi!',
                            text: 'Vui lòng kiểm tra lại thông tin bạn đã nhập.',
                            icon: 'warning',
                            confirmButtonText: 'OK'
                        });
                    } else {
                        Swal.fire({
                            title: 'Lỗi!',
                            text: 'Có lỗi xảy ra trong quá trình thêm nhân viên.',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    }
                }
            });
        } else {
            Swal.fire({
                title: 'Lỗi!',
                text: 'Vui lòng điền đầy đủ các trường bắt buộc.',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
        }
    }

    // Cập nhật nhân viên
    updateNhanVien(id: number): void {
        if (this.nhanVienForm.valid) {
            this.updateNhanVienData = {...this.nhanVienForm.getRawValue()}; // Lấy tất cả dữ liệu từ form, kể cả các trường bị disabled
            // delete this.updateNhanVienData.ma; // Bỏ qua trường mã vì nó không được chỉnh sửa

            this.mapsService.updateNhanVien(id, this.updateNhanVienData).subscribe({
                next: () => {
                    Swal.fire({
                        title: 'Thành công!',
                        text: 'Nhân viên đã được cập nhật thành công.',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                    this.loadNhanVien(this.currentPage);
                    this.nhanVienForm.reset();

                    // Đặt lại các trường trạng thái, giới tính
                    this.onReset();
                },
                error: (errors) => {
                    if (errors.status === 400 && errors.error) {
                        this.validationErrors = errors.error;

                        Swal.fire({
                            title: 'Lỗi!',
                            text: 'Vui lòng kiểm tra lại thông tin bạn đã nhập.',
                            icon: 'warning',
                            confirmButtonText: 'OK'
                        });
                    } else {
                        Swal.fire({
                            title: 'Lỗi!',
                            text: 'Có lỗi xảy ra trong quá trình cập nhật nhân viên.',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    }
                }
            });
        } else {
            Swal.fire({
                title: 'Lỗi!',
                text: 'Vui lòng điền đầy đủ các trường bắt buộc.',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
        }
        // Kích hoạt lại trường mã để có thể nhập liệu khi thêm mới
        this.nhanVienForm.get('ma')?.enable(); // Bật lại trường mã
    }

    // Xóa nhân viên
    deleteNhanVien(id: number) {
        Swal.fire({
            title: 'Bạn có chắc chắn không?',
            text: "Hành động này sẽ không thể phục hồi!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Có, xóa!',
            cancelButtonText: 'Không, quay lại!'
        }).then((result) => {
            if (result.isConfirmed) {
                this.mapsService.deleteNhanVien(id).subscribe(response => {
                    Swal.fire(
                        'Đã xóa!',
                        'Nhân viên đã được xóa thành công.',
                        'success'
                    );
                    this.loadNhanVien(this.currentPage);
                }, error => {
                    Swal.fire(
                        'Lỗi!',
                        'Có lỗi xảy ra trong quá trình xóa nhân viên.',
                        'error'
                    );
                });
            }
        });
    }

    // Hiển thị thông tin nhân viên lên form
    showDetail(nhanVien: any) {

        this.newNhanVien = {...nhanVien}; // Sao chép thông tin của nhân viên vào newNhanVien
        this.newNhanVien.ngayThangNamSinh = this.formatDate(nhanVien.ngayThangNamSinh); // Định dạng lại ngày sinh
        this.newNhanVien.diaChi = nhanVien.diaChi;
        this.updateNhanVienData.id = nhanVien.id;
        const [phuongXa,quanHuyen,tinhThanh] = this.newNhanVien.diaChi.split(",").map(part=>part.trim());
        console.log(tinhThanh,quanHuyen,phuongXa);
        const privince = this.provinces.find(p=>p.ProvinceName===tinhThanh);
        this.selectedTinhThanh = privince ? privince.ProvinceID : null;
        if(this.selectedTinhThanh){
            this.giaoHangNhanhService.getDistricts(Number(this.selectedTinhThanh)).subscribe(
                data => {
                    this.districts = data['data'];
                    const district = this.districts.find(d=> d.DistrictName===quanHuyen);
                    this.selectedQuanHuyen = district ? district.DistrictID : null;
                    if(this.selectedQuanHuyen){
                        this.giaoHangNhanhService.getWards(Number(this.selectedQuanHuyen)).subscribe(
                            data=>{
                                this.wards = data['data'];
                                const ward = this.wards.find(w=>w.WardName===phuongXa);
                                this.selectedPhuongXa = ward ? ward.WardCode : null;
                            }
                        );
                    }
                }
            );
        }
        // Cập nhật nhanVienForm với thông tin nhân viên
        this.nhanVienForm.patchValue(this.newNhanVien);

        // Vô hiệu hóa trường mã khi cập nhật
        this.nhanVienForm.get('ma')?.disable();
    }


    // Đổi trạng thái nhân viên
    toggleStatus(id: number): void {
        const nhanVien = this.nhanViens.find(nv => nv.id === id);
        if (nhanVien) {
            nhanVien.trangThai = nhanVien.trangThai === 'Hoạt động' ? 'Không hoạt động' : 'Hoạt động';

            this.mapsService.updateNhanVien(nhanVien.id, nhanVien).subscribe(response => {
                console.log('Cập nhật trạng thái thành công:', response);
            }, error => {
                console.error('Có lỗi khi cập nhật trạng thái:', error);
            });
        }
    }

    // Phương thức để định dạng ngày sinh
    formatDate(dateString: string): string {
        const date = new Date(dateString);
        return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
    }


    // Kiểm tra ngày sinh >= 18 tuổi
    validateAge(control: AbstractControl): { [key: string]: any } | null {
        const dateOfBirth = new Date(control.value);
        const today = new Date();

        // Nếu ngày sinh không hợp lệ
        if (!dateOfBirth.getTime()) {
            return null;
        }

        // Tính tuổi
        const age = today.getFullYear() - dateOfBirth.getFullYear();
        const isAdult = age > 18 ||
            (age === 18 && (today.getMonth() > dateOfBirth.getMonth() ||
                (today.getMonth() === dateOfBirth.getMonth() && today.getDate() >= dateOfBirth.getDate())));

        return isAdult ? null : { 'ageInvalid': true };
    }

    protected readonly document = document;
}

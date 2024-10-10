import {Component, OnInit} from '@angular/core';
import {MapsService} from './maps.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import Swal from 'sweetalert2';
import {DatePipe} from '@angular/common';

declare const google: any;

@Component({
    selector: 'app-maps',
    templateUrl: './maps.component.html',
    styleUrls: ['./maps.component.css'],
    providers: [DatePipe] // Đăng ký DatePipe ở đây
})
export class MapsComponent implements OnInit {

    nhanVienForm: FormGroup;
    validationErrors: any = {};  // Lưu lỗi từ backend
    nhanViens: any[] = [];
    searchKeyword: string = '';
    newNhanVien: any = {
        gioiTinh: '1',
        trangThai: 'Hoạt động',
        anh: ''
    };  // Biến lưu thông tin nhân viên mới

    updateNhanVienData: any = {
        gioiTinh: '1',
        trangThai: 'Hoạt động'
    }; // Biến lưu thông tin nhân viên cần cập nhật

    // Biến quản lý phân trang
    page = 0;
    size = 5;
    currentPage: any = null;
    totalPages: number = 0;

    constructor(private mapsService: MapsService, private datePipe: DatePipe, private fb: FormBuilder) {
        this.nhanVienForm = this.fb.group({
            ma: ['', Validators.required],
            ten: ['', Validators.required],
            ngayThangNamSinh: ['', Validators.required],
            sdt: ['', Validators.required],
            diaChi: ['', Validators.required],
            username: ['', Validators.required],
            password: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            anh: [''],
            gioiTinh: ['1'],
            trangThai: ['Hoạt động'],
        });
    }

    ngOnInit(): void {
        this.loadNhanVien(this.currentPage);
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

    // Thêm nhân viên
    createNhanVien() {
        if (this.nhanVienForm.valid) {
            this.newNhanVien = {...this.nhanVienForm.value}; // Lưu dữ liệu vào newNhanVien
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

                        this.nhanVienForm.reset();
                        this.nhanVienForm.patchValue({
                            trangThai: 'Hoạt động',
                            gioiTinh: '1'
                        });
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
            delete this.updateNhanVienData.ma; // Bỏ qua trường mã vì nó không được chỉnh sửa

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

                    // Đặt lại các trường trạng thái, giới tính, và ảnh
                    this.nhanVienForm.patchValue({
                        trangThai: 'Hoạt động',
                        gioiTinh: '1',
                        anh: ''
                    });
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
        this.updateNhanVienData.id = nhanVien.id; // Lưu ID của nhân viên cần cập nhật

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

}

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SevricesanphamService } from './sevricesanpham.service'; // Import service
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { response } from 'express';
import { forkJoin } from 'rxjs';
import { ThemeService } from 'ng2-charts';
declare var window: any;
@Component({
  selector: 'app-sanpham',
  templateUrl: './sanpham.component.html',
  styleUrls: ['./sanpham.component.css']
})
export class SanphamComponent implements OnInit {
  role: string = '';
  sanPhamList: any[] = [];
  totalPagesSanPham: number = 0;
  pageSanPham: number = 0;
  sizeSanPham: number = 5;

  idSanPhamChiTiet: number = 0;
  chiTietSanPhamList: any[] = [];
  gioiTinhList: any[] = [];
  totalPagesChiTiet: number = 0;
  pageChiTiet: number = 0;
  sizeChiTiet: number = 5;

  thuongHieuList: any[] = [];
  xuatXuList: any[] = [];
  selectedSanPhamId: number = 0;

  filteredChiTietSanPhamList: any[] = []; // Danh sách lọc kết quả
  sizes: any[] = [];  // Biến để lưu danh sách các Size
  mauSacList: any[] = [];

  filteredSanPhamList: any[] = [];
  popup: boolean = false;

  searchTerm: string = '';
  isUpdateProductDetailModalOpen: boolean = false;  // Biến điều khiển modal
  selectedChiTietSanPhamId: number = 0;  // ID của sản phẩm chi tiết đã chọn để cập nhật

  sanPhamForm: FormGroup;
  attributeForm: FormGroup;
  chiTietSanPhamForm: FormGroup;

  searchChiTietTerm: string = '';
  isaddThuocTinhlModalOpen = false;  // Biến để điều khiển hiển thị modal

  idSpct: number = 0;
  // Các thuộc tính đã có
  selectedColor: number = null; // Biến để lưu ID màu sắc đã chọn
  selectedSize: number = null; // Biến để lưu ID kích thước đã chọn
  maxPrice: number = null; // Giá tối đa để lọc
  selectedPrice: number = null; // Giá tối thiểu để lọc
  filteredChiTietSanPhamList2: any[] = []; // Danh sách lọc kết quả


  // Biến để lưu tên sản phẩm đã chọn
  selectedSanPhamName: string = '';
  selectedchiTietSanPhamId: number = 0;

  isAddAttributeModalOpen = false; // Đặt giá trị khởi tạo là false

  selectedThuongHieu: number = 0;
  selectedXuatXu: number = 0;
  selectedGioiTinh: number = 0;

  constructor(private fb: FormBuilder, private sanPhamService: SevricesanphamService, private cdr: ChangeDetectorRef) { }
  isAddProductDetailModalOpen: boolean = false;  // Biến điều khiển modal

  isChiTietModalOpen: boolean = false; // Track main modal state
  isAddOrUpdateDetailModalOpen: boolean = false; // Track add/update detail modal state

  idchiTietSanPham: number = 0;

  ngOnInit() {
    this.role = localStorage.getItem('role');
    this.sanPhamForm = this.fb.group({
      id: [null],
      maSanPham: ['', Validators.required],
      tenSanPham: ['', [
        Validators.required, 
        Validators.pattern('^[a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểẾẾỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếềểễệỉịọỏốồổỗộớờởỡợụủứừựếềểễệỉịọỏốồổỗộớờởỡợụủứừựỳỵỷỹ& ]*$')
      ]],
      xuatXu: ['', Validators.required],
      thuongHieu: ['', Validators.required],
      gioiTinh: ['', Validators.required],
      trangThai: ['đang hoạt động', Validators.required]
    });

    const maSanPham = this.generateMaSanPham();
    this.sanPhamForm.patchValue({ maSanPham: maSanPham });

    this.chiTietSanPhamForm = this.fb.group({
      idMauSac: ['', Validators.required],
      idSize: ['', Validators.required],
      donGia: ['', [Validators.required, Validators.min(0)]],
      soLuong: [0, Validators.required],
      moTa: [''],
      checkKm: false,
      trangThai: ['Còn hàng', Validators.required]
    });

    // Kiểm tra trạng thái form
    this.chiTietSanPhamForm.valueChanges.subscribe(value => {
      console.log('Form Value:', value);
      console.log('Form Valid:', this.chiTietSanPhamForm.valid);
    });


    this.attributeForm = this.fb.group({
      type: ['', Validators.required],  // Validator kiểm tra loại thuộc tính phải được chọn
      ma: ['', [Validators.required, Validators.pattern('^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểẾẾỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếềểễệỉịọỏốồổỗộớờởỡợụủứừễếềểễệỉịọỏốồổỗộớờởỡợụủứừựỳỵỷỹ ]*$')]],    // Validator kiểm tra mã thuộc tính phải không được để trống
      ten: ['', [Validators.required, Validators.pattern('^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểẾẾỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếềểễệỉịọỏốồổỗộớờởỡợụủứừễếềểễệỉịọỏốồổỗộớờởỡợụủứừựỳỵỷỹ ]*$')]]

    });


    this.sanPhamService.getAllThuongHieu().subscribe(response => {
      this.thuongHieuList = response.result.content || [];
      this.cdr.detectChanges(); // Ép cập nhật view
    });

    this.sanPhamService.getAllXuatXu().subscribe(response => {
      this.xuatXuList = response.result.content || [];
      this.cdr.detectChanges(); // Ép cập nhật view
    });

    this.sanPhamService.getAllGioiTinh().subscribe(response => {
      this.gioiTinhList = response.result.content || [];
      this.cdr.detectChanges(); // Ép cập nhật view
    });

    this.sanPhamService.getAllMauSac().subscribe(response => {
      this.mauSacList = response.result.content || [];
      console.log('Dữ liệu màu sắc:', this.mauSacList); // Kiểm tra dữ liệu màu sắc
      this.cdr.detectChanges();
    }, error => {
      console.error('Lỗi khi tải màu sắc:', error);
    });

    this.sanPhamService.getAllSizes().subscribe(response => {
      this.sizes = response.result.content || [];
      console.log('Dữ liệu kích thước:', this.sizes); // Kiểm tra dữ liệu kích thước
      this.cdr.detectChanges();
    }, error => {
      console.error('Lỗi khi tải kích thước:', error);
    });

    this.loaddata();
    this.filteredChiTietSanPhamList = [...this.chiTietSanPhamList];
    this.filteredSanPhamList = [...this.sanPhamList];
    this.filterSanPham();
  }
  openPopup(idChiTietSanPham: number) {
    this.selectedSanPhamId = idChiTietSanPham;
    this.popup = true;
    console.log("Modal opened:", this.popup); // Kiểm tra xem có log ra không
  }

  closePopup() {
    this.popup = false;
  }
  loaddata() {
    this.getSanPhamPhanTrang(this.pageSanPham);
    this.getAllThuongHieu();
    this.getAllXuatXu();
    this.getAllGioiTinh();
    this.getAllSizes();
    this.getAllMauSac();
    this.filterChiTietSanPham();
    this.selectedColorId = null;
  }

  viewProductDetails(idSanPham: number) {
    this.idSanPhamChiTiet = idSanPham;
    this.selectSanPhamChiTiet(idSanPham);
    this.loadMauSacbysp(idSanPham);
    this.idSanPham2 = idSanPham;
    this.filterChiTietSanPham();

    this.sanPhamService.getSanPhambyid(idSanPham).subscribe(
      response => {
        if (response && response.result && response.result.content.length > 0) {
          const product = response.result.content[0];
          this.selectedSanPhamName = product.ten;
          this.selectedChiTietSanPhamId = product.id;

          // Mở modal bằng jQuery
          ($('#chiTietModal') as any).modal('show');

          this.filterChiTietSanPham();
        } else {
          console.warn('Không có dữ liệu sản phẩm trong phản hồi');
        }
      },
      error => {
        console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Không thể lấy thông tin chi tiết sản phẩm!'
        });
      }
    );
  }



  // Lọc chi tiết sản phẩm theo API
  filterChiTietSanPham() {
    const sanPhamId = this.selectedSanPhamId; // Lấy ID sản phẩm được chọn
    const donGia = this.selectedPrice !== null ? this.selectedPrice : undefined; // Giá được chọn
    const mauSacId = this.selectedColor ? Number(this.selectedColor) : null; // ID màu sắc được chọn, hoặc null nếu không có
    const sizeId = this.selectedSize ? Number(this.selectedSize) : null; // ID kích thước được chọn, hoặc null nếu không có
    const page = this.pageChiTiet; // Trang hiện tại
    const size = this.sizeChiTiet; // Số lượng sản phẩm trên mỗi trang

    // Gọi service để lọc sản phẩm
    this.sanPhamService.filterChiTietSanPham(sanPhamId, donGia, mauSacId, sizeId, page, size).subscribe(
      response => {
        if (response && response.content) {
          this.filteredChiTietSanPhamList = response.content; // Cập nhật danh sách đã lọc
          this.totalPagesChiTiet = response.totalPages; // Cập nhật tổng số trang
        } else {
          console.warn('Không có dữ liệu chi tiết sản phẩm nào được trả về.');
          this.filteredChiTietSanPhamList = []; // Reset danh sách nếu không có dữ liệu
        }
      },
      error => {
        console.error('Lỗi khi lọc chi tiết sản phẩm:', error);
        Swal.fire('Lỗi', 'Có lỗi xảy ra khi lọc sản phẩm!', 'error');
      }
    );
  }

  // Thay đổi giá và gọi lại hàm lọc
  updatePrice(price: number) {
    this.selectedPrice = price;
    this.filterChiTietSanPham();
  }
  // Thay đổi màu sắc và gọi lại hàm lọc
  selectColor(colorId: string) {
    this.selectedColor = Number(colorId);
    this.filterChiTietSanPham();
  }

  // Thay đổi kích thước và gọi lại hàm lọc
  selectSize(sizeId: string) {
    this.selectedSize = Number(sizeId);
    this.filterChiTietSanPham();
  }



  // Hàm tải màu sắc từ API
  loadMauSac() {
    // Giả định bạn đã có hàm để lấy danh sách màu sắc
    this.sanPhamService.getAllMauSac().subscribe(data => {
      this.mauSacList = data.result.content;
    });
  }

  // Hàm tải kích thước từ API
  loadSizes() {
    // Giả định bạn đã có hàm để lấy danh sách kích thước
    this.sanPhamService.getAllSizes().subscribe(data => {
      this.sizes = data.result.content;
    });
  }




  getAllThuongHieu() {
    this.sanPhamService.getAllThuongHieu().subscribe(response => {
      this.thuongHieuList = response.result.content;
    }, error => {
      console.error('Lỗi khi lấy danh sách thương hiệu:', error);
    });
  }

  getAllXuatXu() {
    this.sanPhamService.getAllXuatXu().subscribe(response => {
      this.xuatXuList = response.result.content;
    }, error => {
      console.error('Lỗi khi lấy danh sách xuất xứ:', error);
    });
  }

  getAllGioiTinh() {
    this.sanPhamService.getAllGioiTinh().subscribe(response => {
      this.gioiTinhList = response.result.content;
    }, error => {
      console.error('Lỗi khi lấy danh sách giới tính:', error);
    });
  }


  getAllSizes(): void {
    this.sanPhamService.getAllSizes().subscribe(
      (response) => {
        console.log('Danh sách kích thước:', response);
        this.sizes = response.result.content;  // Gán dữ liệu trả về từ API vào biến sizes
        console.log('Danh sách kích thước:', this.sizes);
      },
      (error) => {
        console.error('Lỗi khi lấy danh sách kích thước:', error);
      }
    );
  }
  getAllMauSac(): void {
    this.sanPhamService.getAllMauSac().subscribe(
      (response) => {
        this.mauSacList = response.result.content;;  // Gán dữ liệu trả về từ API vào biến mauSacList
        console.log('Danh sách màu sắc:', this.mauSacList);
      },
      (error) => {
        console.error('Lỗi khi lấy danh sách màu sắc:', error);
      }
    );
  }

  getSanPhamPhanTrang(page: number, thuongHieuId?: number, xuatXuId?: number, gioiTinhId?: number): void {
    this.sanPhamService
      .filterSanPham(thuongHieuId, xuatXuId, gioiTinhId, page, this.sizeSanPham)
      .subscribe({
        next: async (response) => {
          console.log('Dữ liệu trả về từ API:', response);

          if (response && response.totalPages !== undefined) {
            this.sanPhamList = response.content || [];

            // Duyệt qua từng sản phẩm để thêm `tongSoLuong`
            for (const sanpham of this.sanPhamList) {
              try {
                const tongSoLuong = await this.getTongSoLuong(sanpham.id);
                sanpham.tongSoLuong = tongSoLuong ?? 0; // Nếu không trả về, gán 0
              } catch (err) {
                console.error(`Lỗi khi lấy tổng số lượng cho sản phẩm ID ${sanpham.id}:`, err);
                sanpham.tongSoLuong = 0; // Gán giá trị mặc định là 0 khi lỗi
              }
            }

            this.filteredSanPhamList = [...this.sanPhamList];
            this.totalPagesSanPham = response.totalPages;
            this.pageSanPham = response.currentPage;
          } else {
            console.warn('Không có dữ liệu sản phẩm trong phản hồi');
          }
        },
        error: (error) => {
          console.error('Lỗi khi gọi API getSanPhamPhanTrang:', error);
        },
      });
  }






  changePageSanPham(newPage: number) {
    if (newPage >= 0 && newPage < this.totalPagesSanPham) {
      this.pageSanPham = newPage; // Cập nhật trang hiện tại
      this.getSanPhamPhanTrang(newPage, this.selectedThuongHieu, this.selectedXuatXu, this.selectedGioiTinh);
    }
  }





  changePageChiTiet(newPage: number) {
    // Kiểm tra nếu trang mới hợp lệ
    if (newPage >= 0 && newPage < this.totalPagesChiTiet) {
      this.pageChiTiet = newPage; // Cập nhật trang hiện tại
      this.filterChiTietSanPham();
    }
  }


  loading: boolean = false;

  getChiTietSanPhamPhanTrang(idSanPham: number, page: number = 0) {
    // Kiểm tra tính hợp lệ của idSanPham
    if (idSanPham === undefined || idSanPham === null || isNaN(idSanPham)) {
      console.error('ID sản phẩm không hợp lệ:', idSanPham);
      return; // Dừng lại nếu idSanPham không hợp lệ
    }

    this.loading = true; // Bắt đầu loading

    // Gọi API để lấy chi tiết sản phẩm
    this.sanPhamService.getChiTietSanPhamPhanTrang(idSanPham, page, this.sizeChiTiet).subscribe(
      response => {
        this.loading = false; // Kết thúc loading
        console.log("Danh sách chi tiết sản phẩm:", response);
        if (response && response.content) {
          this.chiTietSanPhamList = response.content || [];
          this.filteredChiTietSanPhamList = [...this.chiTietSanPhamList]; // Cập nhật danh sách lọc từ danh sách chính

          // Cập nhật thông tin phân trang
          if (response.pagination) {
            this.totalPagesChiTiet = response.pagination.totalPages || 1;
            this.pageChiTiet = response.pagination.pageNumber || 0;
          } else {
            this.totalPagesChiTiet = 1;
            this.pageChiTiet = 0;
          }
        } else {
          console.warn('Response không hợp lệ hoặc không có danh sách sản phẩm.');
          this.chiTietSanPhamList = []; // Đặt lại danh sách nếu không có dữ liệu
        }
      },
      error => {
        this.loading = false; // Kết thúc loading khi có lỗi
        console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
        Swal.fire('Lỗi', 'Có lỗi xảy ra khi lấy chi tiết sản phẩm!', 'error');
      }
    );
  }




  // Hàm chọn sản phẩm và điền vào form
  selectSanPham(sanpham: any) {
    console.log('Sản phẩm được chọn:', sanpham); // Kiểm tra sản phẩm được chọn

    if (!sanpham || typeof sanpham.id === 'undefined') {
      console.error('Sản phẩm không hợp lệ:', sanpham);
      return; // Dừng lại nếu sản phẩm không hợp lệ
    }

    this.selectedSanPhamId = sanpham.id;

    // Cập nhật thông tin vào form
    this.sanPhamForm.patchValue({
      id: sanpham.id,
      maSanPham: sanpham.ma,
      tenSanPham: sanpham.ten,
      xuatXu: sanpham.xuatXu?.id,
      thuongHieu: sanpham.thuongHieu?.id,
      gioiTinh: sanpham.gioiTinh?.id,
      trangThai: sanpham.trangThai
    });
  }




  // Hàm chọn sản phẩm chi tiết
  selectSanPhamChiTiet(idSanPham: number) {
    this.selectedSanPhamId = idSanPham;
    console.log('ID sản phẩm được chọn:', idSanPham); // Kiểm tra ID
    this.getChiTietSanPhamPhanTrang(idSanPham); // Gọi hàm để lấy chi tiết
  }





  onSubmit() {
    console.log('Form submitted with selectedSanPhamId:', this.selectedSanPhamId); // Debug log

    if (this.sanPhamForm.invalid) {
      let errorMessage = '';

      if (this.sanPhamForm.get('xuatXu').invalid) {
        errorMessage += 'Xuất xứ là bắt buộc.\n';
      }
      if (this.sanPhamForm.get('thuongHieu').invalid) {
        errorMessage += 'Thương hiệu là bắt buộc.\n';
      }
      if (this.sanPhamForm.get('gioiTinh').invalid) {
        errorMessage += 'Giới tính là bắt buộc.\n';
      }
      if (this.sanPhamForm.get('trangThai').invalid) {
        errorMessage += 'Trạng thái là bắt buộc.\n';
      }
      if (this.sanPhamForm.get('tenSanPham').hasError('pattern')) {
        errorMessage += 'Tên sản phẩm không được chứa ký tự đặc biệt.\n';
      }

      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: errorMessage.trim()
      });

      return;
    }

    // Create the payload
    const sanPhamData = {
      id: this.selectedSanPhamId, // Ensure ID is included for updates
      ma: this.selectedSanPhamId ? this.sanPhamForm.get('maSanPham').value : this.generateMaSanPham(),
      ten: this.sanPhamForm.value.tenSanPham.trim(),
      trangThai: this.sanPhamForm.value.trangThai,
      xuatXu: { id: Number(this.sanPhamForm.value.xuatXu) },
      thuongHieu: { id: Number(this.sanPhamForm.value.thuongHieu) },
      gioiTinh: { id: Number(this.sanPhamForm.value.gioiTinh) }
    };

    console.log('Submitting data:', sanPhamData); // Debug log

    // Check for duplicates
    this.checkDuplicateProduct(sanPhamData, this.selectedSanPhamId).then(isDuplicate => {
      if (isDuplicate) {
        Swal.fire('Lỗi', 'Sản phẩm với thông tin này đã tồn tại!', 'error');
        return;
      }

      // Call service method
      this.sanPhamService.createOrUpdateSanPham(sanPhamData).subscribe(
        (response) => {
          if (response.status) {
            const isUpdate = Boolean(this.selectedSanPhamId);
            console.log("isUpdate ",isUpdate );
            Swal.fire({
              icon: 'success',
              title: isUpdate ? 'Cập nhật thành công!' : 'Thêm mới thành công!',
              text: `Sản phẩm đã được ${isUpdate ? 'cập nhật' : 'thêm mới'} thành công!`
            });

            // Close modal and reset
            ($('#sanPhamModal') as any).modal('hide');
            this.loaddata();
            this.resetForm();
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Lỗi!',
              text: response.message || 'Có lỗi xảy ra!'
            });
          }
        },
        (error) => {
          console.error('Error:', error); // Debug log
          Swal.fire({
            icon: 'error',
            title: 'Lỗi!',
            text: 'Có lỗi xảy ra!'
          });
        }
      );
    });
  }





  // Hàm kiểm tra trùng sản phẩm

  checkDuplicateProduct(sanPhamData: any, currentProductId: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.sanPhamService.getfullSanPham().subscribe((data) => {
        const existingProducts = data?.result?.content || [];

        // Kiểm tra trùng lặp dựa trên tên, thương hiệu, xuất xứ và giới tính
        const isDuplicate = existingProducts.some(item => {
          const isSameProduct =
            item.id !== currentProductId &&
            item.ten?.trim().toLowerCase() === sanPhamData.ten?.trim().toLowerCase() && // So sánh tên không phân biệt chữ hoa thường
            item.xuatXu?.id === sanPhamData.xuatXu?.id &&
            item.thuongHieu?.id === sanPhamData.thuongHieu?.id &&
            item.gioiTinh?.id === sanPhamData.gioiTinh?.id;

          return isSameProduct;
        });

        resolve(isDuplicate);
      }, (error) => {
        console.error('Lỗi khi kiểm tra trùng lặp sản phẩm:', error);
        reject(false); // Nếu có lỗi, mặc định là không trùng
      });
    });
  }


  resetForm() {
    this.sanPhamForm.reset({
      trangThai: 'Đang hoạt động'
    });
    
    const maSanPham = this.generateMaSanPham();
    this.sanPhamForm.patchValue({ maSanPham: maSanPham });
    
    this.selectedSanPhamId = 0;
    console.log('Form reset, selectedSanPhamId:', this.selectedSanPhamId);
  }





  // Hàm mở modal thêm chi tiết sản phẩm
  openModalAddProductDetail(idSanPham: number) {
    this.selectedSanPhamId = idSanPham;  // Gán ID sản phẩm đã chọn
    this.chiTietSanPhamForm.reset();     // Reset form mỗi lần mở modal
    this.chiTietSanPhamForm.patchValue({ trangThai: 'Còn hàng' });  // Đặt giá trị mặc định
    this.isAddProductDetailModalOpen = true;  // Hiển thị modal

  }


  // Hàm đóng modala
  closeModal() {
    this.isAddProductDetailModalOpen = false;
  }



  // Hàm xử lý khi submit form chi tiết sản phẩm
  onSubmitUpdateChiTietSanPham() {
    // Kiểm tra xem form có hợp lệ không
    if (this.chiTietSanPhamForm.valid) {
      const sanPhamId = this.selectedSanPhamId;
      const mauSacId = this.chiTietSanPhamForm.value.idMauSac;
      const sizeId = this.chiTietSanPhamForm.value.idSize;
      const chiTietSanPhamId = this.selectedSanPhamChitietId;
      console.log("chiTietSanPhamId",chiTietSanPhamId);
      // Tạo mã tự động dựa trên ID màu sắc và kích thước


  
      // Kiểm tra trùng lặp trước khi gửi yêu cầu cập nhật
      this.sanPhamService.checkTrungChiTietSanPhamupdate(sanPhamId, mauSacId, sizeId, chiTietSanPhamId).subscribe(
        (isDuplicate) => {
          if (isDuplicate) {
            // Nếu trùng lặp, thông báo lỗi
            Swal.fire('Lỗi', 'Chi tiết sản phẩm với màu sắc và kích thước này đã tồn tại!', 'error');
          } else {
            // Tạo dữ liệu cập nhật
            const updatedChiTietSanPhamData = {
              id: chiTietSanPhamId,
              idSanPham: sanPhamId,
              idMauSac: mauSacId,
              idSize: sizeId,
              ma: this.maChitietsanpham,
              donGia: parseFloat(this.chiTietSanPhamForm.value.donGia) || 0, // Giá trị mặc định là 0
              soLuong: parseInt(this.chiTietSanPhamForm.value.soLuong, 10) || 0, // Giá trị mặc định là 0
              moTa: this.chiTietSanPhamForm.value.moTa,
              trangThai: this.chiTietSanPhamForm.value.trangThai || 'Còn hàng' // Giá trị mặc định nếu chưa có
            };

            // nếu số lượng  > 0 thì trạng thái là Còn Hàng
            if (updatedChiTietSanPhamData.soLuong > 0) {
              updatedChiTietSanPhamData.trangThai = 'Còn hàng';
            }

            if(updatedChiTietSanPhamData.donGia < 0 || updatedChiTietSanPhamData.soLuong < 0){
              Swal.fire('Lỗi', 'Giá trị không được nhỏ hơn 0!', 'error');
              return;
            }

            if(updatedChiTietSanPhamData.donGia > 1000000000){
              Swal.fire('Lỗi', 'Giá trị không được lớn hơn 1.000.000.000!', 'error');
              return;
            }

            if(updatedChiTietSanPhamData.soLuong > 1000000000){
              Swal.fire('Lỗi', 'Giá trị không được lớn hơn 1.000.000.000!', 'error');
              return;
            }

            // Gửi yêu cầu cập nhật chi tiết sản phẩm
            this.sanPhamService.updateChiTietSanPham(chiTietSanPhamId, updatedChiTietSanPhamData).subscribe(
              (response) => {
                // Hiển thị thông báo thành công
                Swal.fire('Thành công', 'Chi tiết sản phẩm đã được cập nhật thành công!', 'success');
                
                // Đóng modal
                this.isUpdateProductDetailModalOpen = false;
                // Cập nhật lại dữ liệu
                this.maChitietsanpham = '';
                
                this.loaddata();
                this.closeupdateChiTietmodal();
                this.openChiTietModal(this.selectedSanPhamId)
              },
              (error) => {
                console.error('Lỗi khi cập nhật chi tiết sản phẩm:', error);
                Swal.fire('Lỗi', 'Có lỗi xảy ra khi cập nhật chi tiết sản phẩm!', 'error');
              }
            );
          }
        },
        (error) => {
          console.error('Lỗi khi kiểm tra trùng lặp chi tiết sản phẩm:', error);
          Swal.fire('Lỗi', 'Có lỗi xảy ra khi kiểm tra trùng lặp chi tiết sản phẩm!', 'error');
        }
      );
    } else {
      // Thông báo nếu form không hợp lệ
      Swal.fire('Lỗi', 'Vui lòng điền đầy đủ thông tin trước khi cập nhật!', 'warning');
    }
  }
  


  // Gọi API để lấy toàn bộ chi tiết sản phẩm
  loadAllChiTietSanPham() {
    this.sanPhamService.getAllChiTietSanPham().subscribe(
      (data: any[]) => {
        this.chiTietSanPhamList = data;  // Gán dữ liệu vào danh sách
      },
      (error) => {
        console.error('Lỗi khi lấy danh sách chi tiết sản phẩm:', error);
      }
    );
  }




  // Hàm mở modal cập nhật chi tiết sản phẩm




  // Hàm đóng modal cập nhật
  closeUpdateModal() {
    this.isUpdateProductDetailModalOpen = false;
  }

  // Hàm tìm kiếm sản phẩm
  onSearch(searchTerm: string) {
    // Loại bỏ khoảng trắng ở đầu và cuối của searchTerm
    searchTerm = searchTerm.trim();

    if (searchTerm !== '') {
      // Gọi API để lấy danh sách sản phẩm mới nhất
      this.sanPhamService.getfullSanPham().subscribe((data) => {
        const sanPhamList = data?.result?.content || [];

        // Lọc danh sách sản phẩm dựa trên từ khóa tìm kiếm
        this.filteredSanPhamList = sanPhamList.filter(sanpham =>
          sanpham.ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sanpham.ma.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }, (error) => {
        console.error('Lỗi khi tải danh sách sản phẩm:', error);
        this.filteredSanPhamList = []; // Nếu có lỗi, trả về danh sách rỗng
      });
    } else {
      // Nếu không có từ khóa tìm kiếm, hiển thị lại toàn bộ danh sách sản phẩm
      this.sanPhamService.getfullSanPham().subscribe((data) => {
        this.filteredSanPhamList = data?.result?.content || [];
      }, (error) => {
        console.error('Lỗi khi tải danh sách sản phẩm:', error);
        this.filteredSanPhamList = []; // Nếu có lỗi, trả về danh sách rỗng
      });
    }
  }



  searchChiTietSanPham() {
    const search = this.searchTerm.toLowerCase().trim();

    if (search) {
      // Lọc dữ liệu theo từ khóa
      this.filteredChiTietSanPhamList = this.chiTietSanPhamList.filter(chiTiet =>
        chiTiet.ma.toLowerCase().includes(search) ||
        chiTiet.ten.toLowerCase().includes(search) ||
        chiTiet.mauSac.ten.toLowerCase().includes(search) ||
        chiTiet.size.ten.toLowerCase().includes(search) ||
        chiTiet.trangThai.toLowerCase().includes(search)
      );
    } else {
      // Nếu không có từ khóa, hiển thị toàn bộ dữ liệu
      this.filteredChiTietSanPhamList = [...this.chiTietSanPhamList];
    }
  }

  onSearchChiTiet(searchTerm: string) {
    if (searchTerm && searchTerm.trim() !== '') {
      this.filteredChiTietSanPhamList = this.chiTietSanPhamList.filter(chiTiet =>
        chiTiet.ma.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chiTiet.ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chiTiet.mauSac.ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chiTiet.size.ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chiTiet.trangThai.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      // Nếu không có từ khóa tìm kiếm, hiển thị lại toàn bộ danh sách chi tiết sản phẩm
      this.filteredChiTietSanPhamList = [...this.chiTietSanPhamList];
    }
  }




 

  openChiTietModal(sanPhamId: number) {
    this.selectSanPhamChiTiet(sanPhamId);
    this.isChiTietModalOpen = true;
    ($('#chiTietModal') as any).modal('show');
  }

  closeChiTietModal() {
    this.isChiTietModalOpen = false;
    ($('#chiTietModal') as any).modal('hide');
  }



  filterSanPham(page: number = 0) {
    this.sanPhamService.filterSanPham(this.selectedThuongHieu, this.selectedXuatXu, this.selectedGioiTinh, page, this.sizeSanPham).subscribe(
      (response) => {
        console.log('Dữ liệu sản phẩm sẽ lọc:', response);
        this.filteredSanPhamList = response.content;
        this.totalPagesSanPham = response.totalPages;
        this.pageSanPham = response.currentPage;
      },
      (error) => {
        console.error('Lỗi khi lọc sản phẩm:', error);
      }
    );
  }



  selectedSizes: number[] = [];
  selectedMauSacs: number[] = [];



  isValidSelection: boolean = false;

  checkValidSelection() {
    this.isValidSelection = this.selectedSizes.length > 0 && this.selectedMauSacs.length > 0;
  }


  toggleSize(sizeId: number) {
    if (this.selectedSizes.includes(sizeId)) {
      this.selectedSizes = this.selectedSizes.filter(id => id !== sizeId);
    } else {
      this.selectedSizes.push(sizeId);
    }
    this.checkValidSelection();
  }

  toggleMauSac(mauSacId: number) {
    if (this.selectedMauSacs.includes(mauSacId)) {
      this.selectedMauSacs = this.selectedMauSacs.filter(id => id !== mauSacId);
    } else {
      this.selectedMauSacs.push(mauSacId);
    }
    this.checkValidSelection();
  }


  // Hàm xử lý khi người dùng chọn hoặc bỏ chọn màu sắc
  onMauSacChange(mauSacId: number, checked: boolean) {
    const mauSacsControl = this.chiTietSanPhamForm.get('mauSacs');
    if (checked) {
      this.selectedMauSacs.push(mauSacId);
    } else {
      this.selectedMauSacs = this.selectedMauSacs.filter(id => id !== mauSacId);
    }
    mauSacsControl?.setValue(this.selectedMauSacs);
    mauSacsControl?.markAsTouched();
    this.checkValidSelection();
  }

  // Hàm xử lý khi người dùng chọn hoặc bỏ chọn kích thước
  onSizeChange(sizeId: number, checked: boolean) {
    const sizesControl = this.chiTietSanPhamForm.get('sizes');
    if (checked) {
      this.selectedSizes.push(sizeId);
    } else {
      this.selectedSizes = this.selectedSizes.filter(id => id !== sizeId);
    }
    sizesControl?.setValue(this.selectedSizes);
    sizesControl?.markAsTouched();
    this.checkValidSelection();
  }

  renderChiTietSanPham() {
    if (this.selectedSizes.length === 0 || this.selectedMauSacs.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Chú ý!',
        text: 'Vui lòng chọn ít nhất một màu sắc và kích thước!'
      });
      return;
    }

    // Hiển thị loading
    this.loading = true;

    // Tạo danh sách chi tiết sản phẩm dựa trên màu sắc và kích thước đã chọn
    const chiTietSanPhamData = [];

    for (let sizeId of this.selectedSizes) {
      for (let mauSacId of this.selectedMauSacs) {
        // Gọi hàm để tạo mã tự động cho mỗi chi tiết sản phẩm
        const ma = this.generateMaspct(mauSacId, sizeId);
        const soLuong = this.chiTietSanPhamForm.value.soLuong || 0;
        const trangThai = soLuong === 0 ? 'Hết hàng' : (this.chiTietSanPhamForm.value.trangThai || 'Còn hàng');

        chiTietSanPhamData.push({
          idSanPham: this.selectedSanPhamId,
          ma: ma,
          idMauSac: mauSacId,
          idSize: sizeId,
          donGia: this.chiTietSanPhamForm.value.donGia || 0,
          soLuong: soLuong,
          moTa: this.chiTietSanPhamForm.value.moTa || '',
          trangThai: trangThai
        });
      }
    }

    // Kiểm tra từng chi tiết sản phẩm với API để đảm bảo không trùng lặp
    const checkRequests = chiTietSanPhamData.map(data =>
      this.sanPhamService.checkTrungChiTietSanPham(
        data.idSanPham,
        data.idMauSac,
        data.idSize
      )
    );

    // Thực hiện tất cả các yêu cầu kiểm tra trùng lặp cùng một lúc
    forkJoin(checkRequests).subscribe(
      results => {
        // Lọc những sản phẩm không bị trùng lặp
        const filteredData = chiTietSanPhamData.filter((_, index) => !results[index]);

        if (filteredData.length === 0) {
          this.loading = false;
          Swal.fire({
            icon: 'warning',
            title: 'Không có chi tiết sản phẩm hợp lệ!',
            text: 'Tất cả các sản phẩm đã bị trùng lặp với các chi tiết hiện tại.'
          });
          return;
        }

        // Gọi API để thêm các sản phẩm không bị trùng lặp
        const requests = filteredData.map(data => this.sanPhamService.createChiTietSanPham(data));

        forkJoin(requests).subscribe(
          responses => {
            this.loading = false; // Ẩn loading
            let successCount = responses.filter(response => response.status).length;

            Swal.fire({
              icon: 'success',
              title: 'Thành công!',
              text: `${successCount} chi tiết sản phẩm đã được thêm thành công!`
            });

            // Tải lại dữ liệu
            this.loaddata();
            ($('#createDetailModal') as any).modal('hide');
            this.openChiTietModal(this.selectedSanPhamId)
          },
          error => {
            this.loading = false; // Ẩn loading
            console.error('Lỗi khi thêm chi tiết sản phẩm:', error);
            Swal.fire({
              icon: 'error',
              title: 'Lỗi!',
              text: 'Có lỗi xảy ra khi thêm chi tiết sản phẩm!'
            });
          }
        );
      },
      error => {
        this.loading = false;
        console.error('Lỗi khi kiểm tra trùng lặp:', error);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Không thể kiểm tra trùng lặp chi tiết sản phẩm!'
        });
      }
    );
  }




  // Hàm tạo mã tự động dựa trên ID màu sắc và kích thước
  generateMaspct(idMauSac: number, idSize: number): string {
    return `SPCT${this.padNumber(this.selectedSanPhamId, 2)}${this.padNumber(idMauSac, 2)}${this.padNumber(idSize, 2)}`;
  }


  // Hàm để đảm bảo số luôn có ít nhất 2 chữ số (ví dụ: 1 -> 01)
  padNumber(num: number, length: number): string {
    return num.toString().padStart(length, '4');
  }

  generateMaSanPham(): string {
    const randomNum = Math.floor(1000 + Math.random() * 9000); // Tạo số ngẫu nhiên 4 chữ số
    const maSanPham = `SP${randomNum}`; 
    return maSanPham;
  }


  openAddAttributeModal() {
    console.log('Mở modal thêm thuộc tính');
    this.isaddThuocTinhlModalOpen = true;
    console.log('Trạng thái isaddThuocTinhlModalOpen:', this.isaddThuocTinhlModalOpen);
  }

  closeAddAttributeModal() {
    console.log('Đóng modal thêm thuộc tính');
    this.isaddThuocTinhlModalOpen = false;
    console.log('Trạng thái isaddThuocTinhlModalOpen:', this.isaddThuocTinhlModalOpen);
  }


  resetAttributeForm() {
    // Đặt lại giá trị của form về trạng thái ban đầu
    this.attributeForm.reset({
      type: '',  // Đặt giá trị mặc định cho loại thuộc tính
      ma: '',    // Đặt giá trị mặc định cho mã thuộc tính
      ten: ''    // Đặt giá trị mặc định cho tên thuộc tính
    });

    // Đặt trạng thái "touched" và "dirty" về false cho các control
    this.attributeForm.markAsPristine();
    this.attributeForm.markAsUntouched();

    console.log('Form đã được reset');
  }

  onSubmitAttribute() {
    // Trim value of `ten` field
    const tentt = this.attributeForm.get('ten');
    if (tentt) {
      tentt.setValue(tentt.value.trim());
    }

    console.log('Hàm onSubmitAttribute đã được gọi');

    // Kiểm tra tính hợp lệ của form
    if (this.attributeForm.valid) {
      console.log('Form hợp lệ, bắt đầu xử lý thêm thuộc tính');

      const attributeType = this.attributeForm.value.type;
      const attributeData = {
        id: 0,
        ma: this.attributeForm.value.ma,
        ten: this.attributeForm.value.ten
      };

      console.log('Dữ liệu thuộc tính:', attributeType, attributeData);

      this.checkDuplicateAttribute(attributeType, attributeData.ma, attributeData.ten)
        .then(isDuplicate => {
          console.log('Kết quả kiểm tra trùng lặp:', isDuplicate);
          if (isDuplicate) {
            Swal.fire('Lỗi', 'Thuộc tính đã tồn tại!', 'error');
          } else {
            this.addAttribute(attributeType, attributeData);
          }
        })
        .catch(error => {
          console.error('Lỗi khi kiểm tra trùng lặp:', error);
          Swal.fire('Lỗi', 'Đã xảy ra lỗi khi kiểm tra trùng lặp!', 'error');
        });
    } else {
      console.warn('Form không hợp lệ:', this.attributeForm.errors);
      Swal.fire('Lỗi', 'Vui lòng kiểm tra lại thông tin!', 'error');
    }
  }

  addAttribute(attributeType: string, attributeData: any) {
    const serviceMap = {
      'mauSac': this.sanPhamService.addMauSac,
      'size': this.sanPhamService.addSize,
      'xuatXu': this.sanPhamService.addXuatXu,
      'thuongHieu': this.sanPhamService.addThuongHieu
    };

    const selectedService = serviceMap[attributeType];

    if (selectedService) {
      console.log('Gọi API thêm thuộc tính:', attributeType);
      selectedService.call(this.sanPhamService, attributeData).subscribe(
        response => {
          console.log('Phản hồi từ API:', response);
          Swal.fire('Thành công', `${this.getAttributeLabel(attributeType)} đã được thêm!`, 'success');
          this.closeAddAttributeModal();
          this.resetAttributeForm();
          this.loaddata();
        },
        error => {
          console.error('Lỗi khi thêm thuộc tính:', error);
          Swal.fire('Lỗi', `Có lỗi xảy ra khi thêm ${this.getAttributeLabel(attributeType)}!`, 'error');
        }
      );
    } else {
      console.error('Loại thuộc tính không hợp l��:', attributeType);
      Swal.fire('Lỗi', 'Loại thuộc tính không hợp lệ!', 'error');
    }
  }

  getAttributeLabel(attributeType: string): string {
    switch (attributeType) {
      case 'mau-sac': return 'Màu sắc';
      case 'size': return 'Kích thước';
      case 'xuat-xu': return 'Xuất xứ';
      case 'thuong-hieu': return 'Thương hiệu';
      default: return 'thuộc tính';
    }
  }

  checkDuplicateAttribute(type: string, ma: string, ten: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      console.log('Bắt đầu kiểm tra trùng lặp cho loại:', type);

      switch (type) {
        case 'mau-sac':
          this.sanPhamService.getAllMauSac().subscribe(
            data => {
              const existingAttributes = data?.result?.content || [];
              resolve(this.isDuplicate(existingAttributes, ma, ten));
            },
            error => {
              console.error('Lỗi khi lấy danh sách màu sắc:', error);
              reject(error);
            }
          );
          break;
        case 'size':
          this.sanPhamService.getAllSizes().subscribe(
            data => {
              const existingAttributes = data?.result?.content || [];
              resolve(this.isDuplicate(existingAttributes, ma, ten));
            },
            error => {
              console.error('Lỗi khi lấy danh sách kích thước:', error);
              reject(error);
            }
          );
          break;
        case 'xuat-xu':
          this.sanPhamService.getAllXuatXu().subscribe(
            data => {
              const existingAttributes = data?.result?.content || [];
              resolve(this.isDuplicate(existingAttributes, ma, ten));
            },
            error => {
              console.error('Lỗi khi lấy danh sách xuất xứ:', error);
              reject(error);
            }
          );
          break;
        case 'thuong-hieu':
          this.sanPhamService.getAllThuongHieu().subscribe(
            data => {
              const existingAttributes = data?.result?.content || [];
              resolve(this.isDuplicate(existingAttributes, ma, ten));
            },
            error => {
              console.error('Lỗi khi lấy danh sách thương hiệu:', error);
              reject(error);
            }
          );
          break;
        default:
          console.error('Loại thuộc tính không hợp lệ:', type);
          resolve(false);
      }
    });
  }

  isDuplicate(list: any[], ma: string, ten: string): boolean {
    if (!Array.isArray(list)) {
      console.error('Dữ liệu không phải là mảng:', list);
      return false;
    }

    return list.some(item => {
      return item && typeof item.ma === 'string' && typeof item.ten === 'string' && (item.ma === ma || item.ten === ten);
    });
  }


  logButtonClick() {
    console.log('Nút submit đã được bấm');
  }



  selectedImages: (string | ArrayBuffer)[] = []; // Mảng chứa các ảnh đã chọn mới
  // Định nghĩa savedImages là mảng chứa các đối tượng với id và url
  savedImages: { id: number; url: string }[] = []; // Mảng chứa ID và URL ảnh đã lưu
  SanPhamChiTietbyid: any = {};
  CheckImageLimit: boolean = false;
  sizeName: string = '';
  colorName: string = '';

  

  // Hàm kiểm tra xem sản phẩm có đủ ảnh chưa
  checkImageLimit() {
    this.sanPhamService.getImagesByProductId(this.idSpct).subscribe(
      (response: any) => {
        console.log('Danh sách ảnh:', response);

        const imageCount = response.result.content.totalElements || 0;
        console.log('Số lượng ảnh:', imageCount);
        this.CheckImageLimit = imageCount >= 3;
        if (this.CheckImageLimit) {
          Swal.fire({
            icon: 'error',
            title: 'Đã đủ ảnh',
            text: `Sản phẩm này đã có đủ 3 ảnh.`,
          });
        }
      },
      error => {
        console.error("Lỗi khi lấy danh sách ảnh:", error);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Không thể kiểm tra số lượng ảnh hiện có.',
        });
      }
    );
  }

  // Hàm xử lý khi chọn ảnh mới
  onFilesSelected(event: any) {
    const files = event.target.files;
    const maxFiles = 3;

    // Kiểm tra nếu số lượng ảnh hiện tại cộng với số ảnh mới sẽ vượt quá giới hạn
    if (this.selectedImages.length + files.length > maxFiles) {
      Swal.fire({
        icon: 'error',
        title: 'Giới hạn ảnh',
        text: `Bạn chỉ được chọn tối đa ${maxFiles} ảnh. Hiện tại đã có ${this.selectedImages.length} ảnh.`,
      });
      return;
    }

    // Thêm từng ảnh mới vào mảng `selectedImages` mà không xóa ảnh cũ
    for (let i = 0; i < files.length && this.selectedImages.length < maxFiles; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (e) => {
        if (this.selectedImages.length < maxFiles) {
          this.selectedImages.push(e.target?.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  }





  // Hàm xóa ảnh đã chọn khỏi mảng `selectedImages`
  removeSelectedImage(index: number) {
    this.selectedImages.splice(index, 1);
  }


  // Hàm reset modal
  resetModal() {
    this.selectedImages = []; // Xóa tất cả ảnh mới đã chọn
    this.savedImages = []; // Xóa danh sách ảnh đã lưu (nếu cần thiết)
    this.idSpct = 0; // Đặt lại ID sản phẩm chi tiết (tùy thuộc vào logic của bạn)
    this.selectedSanPhamName = ''; // Đặt lại tên sản phẩm (tùy thuộc vào logic của bạn)
    this.SanPhamChiTietbyid = {}; // Xóa chi tiết sản phẩm (tùy thuộc vào logic của bạn)
  }


  deleteSavedImage(id: number) {
    // Hiển thị hộp thoại xác nhận trước khi xóa ảnh
    Swal.fire({
      title: 'Xác nhận xóa',
      text: 'Bạn có chắc chắn muốn xóa ảnh này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Có!',
      cancelButtonText: 'Không'
    }).then((result) => {
      if (result.isConfirmed) {
        // Nếu người dùng xác nhận, gọi API để xóa ảnh
        this.sanPhamService.deleteImage(id).subscribe(
          (response: any) => {
            console.log("Ảnh đã được xóa thành công:", response);
            // Cập nhật danh sách ảnh sau khi xóa thành công
            this.savedImages = this.savedImages.filter(image => image.id !== id);
            // Hiển thị thông báo thành công
            Swal.fire({
              icon: 'success',
              title: 'Đã xóa ảnh',
              text: 'Ảnh đã được xóa thành công.',
            });
            this.getProducts(this.selectedColorId, this.idSanPham2)
          },
          (error) => {
            console.error("Lỗi khi xóa ảnh:", error);
            Swal.fire({
              icon: 'error',
              title: 'Lỗi',
              text: 'Không thể xóa ảnh. Vui lòng thử lại.',
            });
          }
        );
      }
    });
  }


  resetChiTietSanPhamForm() {
    // Đặt lại các giá trị mặc định cho các trường trong form
    this.chiTietSanPhamForm.reset({
      idMauSac: '',           // Đặt lại giá trị mặc định cho idMauSac
      idSize: '',             // Đặt lại giá trị mặc định cho idSize
      donGia: 0,              // Đặt lại giá trị mặc định cho đơn giá
      soLuong: 0,             // Đặt lại giá trị mặc định cho số lượng
      moTa: '',               // Đặt lại giá trị mặc định cho mô tả
      trangThai: 'Còn hàng'   // Đặt lại giá trị mặc định cho trạng thái
    });

    // Đặt lại trạng thái hợp lệ của form
    this.chiTietSanPhamForm.markAsPristine();  // Đánh dấu form là không có sự thay đổi
    this.chiTietSanPhamForm.markAsUntouched(); // Đánh dấu tất cả các trường là chưa được chm vào
    this.chiTietSanPhamForm.markAsUntouched(); // Đánh dấu tất cả các trường là chưa được chm vào
    this.chiTietSanPhamForm.updateValueAndValidity(); // Cập nhật lại trạng thái hợp lệ của form

    console.log("Đã reset chi tiết sản phẩm form");

    this.loaddata();

    // Nếu sử dụng FormArray cho checkbox, hãy clear giá trị của nó
    (this.chiTietSanPhamForm.get('mauSacs') as FormArray).clear();
    (this.chiTietSanPhamForm.get('sizes') as FormArray).clear();

    // Hoặc nếu không dùng FormArray, bạn có thể set lại giá trị rỗng
    this.chiTietSanPhamForm.patchValue({
      mauSacs: [],
      sizes: []
    });
  }

  async getTongSoLuong(idSanPham: number): Promise<number> {
    try {
      const data = await this.sanPhamService.getTongSoLuong(idSanPham).toPromise();
      return data ?? 0; // Nếu API không trả về giá trị, gán giá trị mặc định là 0
    } catch (err) {
      console.error('Lỗi khi gọi API:', err);
      return 0; // Gán giá trị mặc định là 0 khi lỗi
    }
  }
  // sulianh2
  danhSachMau: any[] = [];
  error: string | null = null;



  loadMauSacbysp(idSanPham: number): void {
    this.loading = true;
    this.error = null;
    console.log("ham lay id anh")
    this.sanPhamService.getMauSacBySanPham(idSanPham)
      .subscribe({
        next: (response) => {
          console.log(" màu ", response)
          this.danhSachMau = response;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Có lỗi xảy ra khi tải dữ liệu màu sắc';
          this.loading = false;
          console.error('Error:', err);
        }
      });
  }





  saveImagesByColor() {
    const maxImages = 3;

    // Kiểm tra nếu chưa chọn ảnh
    if (this.selectedImages.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Chưa chọn ảnh',
        text: 'Vui lòng chọn ít nhất một ảnh.',
      });
      return;
    }

    // Kiểm tra nếu chưa chọn màu
    if (!this.selectedColorId) {
      Swal.fire({
        icon: 'warning',
        title: 'Chưa chọn màu sắc',
        text: 'Vui lòng chọn một màu sắc.',
      });
      return;
    }

    // Kiểm tra số lượng ảnh hiện có
    if (this.products.length >= maxImages) {
      Swal.fire({
        icon: 'warning',
        title: 'Đã đủ số lượng ảnh',
        text: 'Số lượng ảnh đã đạt tối đa (3 ảnh).',
      });
      return;
    }

    // Kiểm tra tổng số ảnh sau khi thêm mới
    if (this.products.length + this.selectedImages.length > maxImages) {
      Swal.fire({
        icon: 'warning',
        title: 'Vượt quá số lượng cho phép',
        text: `Chỉ có thể thêm tối đa ${maxImages - this.products.length} ảnh nữa.`,
      });
      return;
    }

    // Nếu pass hết các điều kiện thì tiếp tục upload
    const urls = this.selectedImages.map((image) => image as string);

    this.sanPhamService.uploadImageByColors(this.idSanPham2, this.selectedColorId, urls).subscribe({
      next: (response: any) => {
        console.log('Phản hồi từ server:', response);
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: response || 'Ảnh đã được tải lên thành công.',
        });
        this.getProducts(this.selectedColorId, this.idSanPham2);
        this.selectedImages = [];
      },
      error: (err) => {
        console.error('Lỗi khi upload ảnh:', err);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Có lỗi xảy ra khi lưu ảnh. Vui lòng thử lại.',
        });
      },
    });
  }

  selectedColorId: number | null = null; // Biến lưu ID màu sắc đã chọn
  onColorChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedColorId = Number(target.value); // Lấy giá trị ID từ dropdown
    console.log('ID màu đã chọn:', this.selectedColorId);
    this.getProducts(this.selectedColorId, this.idSanPham2)
  }

  idSanPham2: number = 0;
  products: any[] = [];
  getProducts(idMauSac: number, idSanPham: number): void {
    this.sanPhamService.getProductsByColorAndProduct(idMauSac, idSanPham)
      .subscribe({
        next: (data) => {
          console.log("ảnh nhận đc là ", data); // Xác minh dữ liệu
          this.products = data; // Gán dữ liệu vào danh sách products
          console.log('anh Products:', this.products);
        },
        error: (error) => {
          console.error('Error fetching products:', error);
        }
      });
  }



  chonSphinh2(id: number, name: string) {
    this.idSanPham2 = id;
    this.selectedSanPhamName = name;
    this.getProducts(this.selectedColorId, this.idSanPham2)
    this.loadMauSacbysp(id);
  }

  resertAnh() {
    this.selectedImages = [];
  }
  downloadImage(id: number) { // ID của PDF bạn muốn tải về
    this.sanPhamService.downloadImage(id).subscribe(blob => {
      // Tạo URL từ Blob
      const url = window.URL.createObjectURL(blob);
      // Tạo link để tải xuống
      const a = document.createElement('a');
      a.href = url;
      a.download = `san_pham_${id}.png`; // Tên tệp bạn muốn
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url); // Giải phóng URL
    }, error => {
      console.error('Error downloading Image', error);
    });
  }


   maChitietsanpham: string = '';
   selectedSanPhamChitietId: number = 0;
  // Method to open the add/update detail modal
  openUpdateDetailModal(idChiTietSanPham : number) {
    this.isAddOrUpdateDetailModalOpen = true;
    this.closeChiTietModal(); // Temporarily close the main modal
    this.selectedSanPhamChitietId = idChiTietSanPham;
    this.sanPhamService.getChiTietSanPhamById(idChiTietSanPham).subscribe(
      (response: any) => {
        if (response && response.result && response.result.content) {
          const chiTietSanPham = response.result.content;

          // Điền dữ liệu chi tiết sản phẩm vào form
          this.chiTietSanPhamForm.patchValue({
            ma: chiTietSanPham.ma, // Patch mã chi tiết
            idMauSac: chiTietSanPham.mauSac?.id, // Patch id màu sắc (nếu có)
            idSize: chiTietSanPham.size?.id, // Patch id kích thước (nếu có)
            donGia: chiTietSanPham.donGia, // Patch đơn giá
            soLuong: chiTietSanPham.soLuong, // Patch số lượng
            moTa: chiTietSanPham.moTa || '', // Patch ghi chú (cho phép gi�� trị rỗng nếu không có)
            trangThai: chiTietSanPham.trangThai // Patch trạng thái
          });
          this.maChitietsanpham = chiTietSanPham.ma;
        }
      },
      error => {
        console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Không thể lấy thông tin chi tiết sản phẩm!'
        });
      }
    );
  
    ($('#updateChiTietmodal') as any).modal('show');

    
}


  closeupdateChiTietmodal() {
    this.isAddOrUpdateDetailModalOpen = false;
    ($('#updateChiTietmodal') as any).modal('hide');
     this.openChiTietModal(this.selectedSanPhamId);
    
    
}

// Add this method to the SanphamComponent class



 
  
} 
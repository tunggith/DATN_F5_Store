import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SevricesanphamService } from './sevricesanpham.service'; // Import service
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  popup: boolean=false;

  searchTerm: string = '';
  isUpdateProductDetailModalOpen: boolean = false;  // Biến điều khiển modal cập nhật
  selectedChiTietSanPhamId: number = 0;  // ID của sản phẩm chi tiết đã chọn để cập nhật

  sanPhamForm: FormGroup;
  attributeForm: FormGroup;
  chiTietSanPhamForm : FormGroup;

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

  constructor(private fb: FormBuilder, private sanPhamService: SevricesanphamService,private cdr: ChangeDetectorRef) { }
  isAddProductDetailModalOpen: boolean = false;  // Biến điều khiển modal


  ngOnInit() {
    this.sanPhamForm = this.fb.group({
      id: [null],
      maSanPham: [''],
      tenSanPham: ['', Validators.required],
      xuatXu: ['', Validators.required],
      thuongHieu: ['', Validators.required],
      gioiTinh: ['', Validators.required],
      trangThai: ['đang hoạt động', Validators.required]
    });

    if (!this.selectedSanPhamId || this.selectedSanPhamId == 0) {
      const maSanPham = this.generateMaSanPham();
      this.sanPhamForm.get('maSanPham').setValue(maSanPham);
    }

    this.chiTietSanPhamForm = this.fb.group({
      idMauSac: ['', Validators.required],
      ma: ['', Validators.required],
      idSize: ['', Validators.required],
      donGia: [0, Validators.required],
      soLuong: [0, Validators.required],
      giChu: [''], // Không thêm Validators.required cho trường này
      trangThai: ['Còn hàng', Validators.required]
    });
    

    this.attributeForm = this.fb.group({
      type: ['', Validators.required],  // Validator kiểm tra loại thuộc tính phải được chọn
      ma: ['', [Validators.required]],    // Validator kiểm tra mã thuộc tính phải không được để trống
      ten: ['', [Validators.required]]    // Validator kiểm tra tên thuộc tính phải không được để trống
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

  }
  
  viewProductDetails(idSanPham: number) {
    this.idSanPhamChiTiet = idSanPham;
    this.selectSanPhamChiTiet(idSanPham); // Gọi hàm để chọn sản phẩm chi tiết
    this.openChiTietModal(idSanPham); // Gọi hàm để mở modal

    // Lọc chi tiết sản phẩm trước khi lấy thông tin cụ thể
    this.filterChiTietSanPham(); 

    // Gọi API để lấy thông tin sản phẩm cụ thể
    this.sanPhamService.getSanPhambyid(idSanPham).subscribe(
        response => {
            console.log('Phản hồi từ API:', response); // Kiểm tra phản hồi từ API
            if (response && response.result && response.result.content.length > 0) {
                const product = response.result.content[0]; // Lấy sản phẩm đầu tiên từ mảng

                // Cập nhật thông tin vào form
                this.chiTietSanPhamForm.patchValue({
                    idMauSac: product.idMauSac || '', // Cập nhật ID màu sắc nếu có
                    ma: product.ma || '', // Cập nhật mã sản phẩm
                    idSize: product.idSize || '', // Cập nhật ID kích thước nếu có
                    donGia: product.donGia || 0, // Cập nhật đơn giá
                    soLuong: product.soLuong || 0, // Cập nhật số lượng
                    giChu: product.giChu || '', // Cập nhật ghi chú
                    trangThai: product.trangThai || 'Còn hàng' // Cập nhật trạng thái
                });

                // Lưu tên sản phẩm
                this.selectedSanPhamName = product.ten; // Gán tên sản phẩm
                this.selectedChiTietSanPhamId = product.id;
                console.log('ID sản phẩm:', this.selectedChiTietSanPhamId);
                
                // Gọi hàm lọc lại để lấy chi tiết sản phẩm sau khi đã cập nhật thông tin
                this.filterChiTietSanPham();
            } else {
                console.warn('Không có dữ liệu sản phẩm trong phản hồi');
            }
        },
        error => {
            console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
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
  
    openUpdateProductDetailModal(idChiTietSanPham: number) {
      if (idChiTietSanPham) {
        this.selectedChiTietSanPhamId = idChiTietSanPham; // Lưu ID chi tiết sản phẩm đã chọn
        this.isUpdateProductDetailModalOpen = true; // Hiển thị modal cập nhật
    
        // Gọi API lấy dữ liệu chi tiết sản phẩm theo ID
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
                giChu: chiTietSanPham.giChu || '', // Patch ghi chú (cho phép giá trị rỗng nếu không có)
                trangThai: chiTietSanPham.trangThai // Patch trạng thái
              });
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
      } else {
        console.error('ID sản phẩm chi tiết không hợp lệ:', idChiTietSanPham);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'ID sản phẩm chi tiết không hợp lệ!'
        });
      }
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

  getSanPhamPhanTrang(page: number, thuongHieuId?: number, xuatXuId?: number, gioiTinhId?: number) {
    this.sanPhamService.filterSanPham(thuongHieuId, xuatXuId, gioiTinhId, page, this.sizeSanPham).subscribe(response => {
        console.log('Dữ liệu trả về từ API:', response); // Log dữ liệu
        // Kiểm tra xem có dữ liệu không
        if (response && response.totalPages !== undefined) {
            // Gán danh sách sản phẩm từ phản hồi
            this.sanPhamList = response.content || []; // Gán danh sách sản phẩm
            this.filteredSanPhamList = [...this.sanPhamList]; // Sao chép dữ liệu cho filtered list
            console.log('Danh sách sản phẩm:', this.filteredSanPhamList);
            this.totalPagesSanPham = response.totalPages; // Gán tổng số trang
            this.pageSanPham = response.currentPage; // Gán số trang hiện tại
        } else {
            console.warn('Không có dữ liệu sản phẩm trong phản hồi');
            this.sanPhamList = [];
            this.filteredSanPhamList = [];
        }
    }, error => {
        console.error('Lỗi khi gọi API getSanPhamPhanTrang:', error);
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
      maSanPham: sanpham.ma,
      tenSanPham: sanpham.ten,
      xuatXu: sanpham.xuatXu?.id,  // Optional chaining để tránh lỗi nếu xuatXu không tồn tại
      thuongHieu: sanpham.thuongHieu?.id,  // Optional chaining để tránh lỗi nếu thuongHieu không tồn tại
      gioiTinh: sanpham.gioiTinh?.id,  // Optional chaining để tránh lỗi nếu gioiTinh không tồn tại
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
      // Kiểm tra tính hợp lệ của form
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
    
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: errorMessage.trim()
        });
    
        return; // Dừng lại nếu form không hợp lệ
      }
    
      // Lấy mã sản phẩm tự động nếu sản phẩm mới
      const maSanPham = this.generateMaSanPham();
      
      // Lấy dữ liệu sản phẩm từ form
      const sanPhamData = {
        id: this.selectedSanPhamId ? this.selectedSanPhamId : 0,
        ma: maSanPham, // Sử dụng mã sản phẩm từ hàm generateMaSanPham()
        ten: this.sanPhamForm.value.tenSanPham,
        trangThai: this.sanPhamForm.value.trangThai,
        xuatXu: {
          id: this.sanPhamForm.value.xuatXu,
        },
        thuongHieu: {
          id: this.sanPhamForm.value.thuongHieu,
        },
        gioiTinh: {
          id: this.sanPhamForm.value.gioiTinh,
        }
      };
    
      // Kiểm tra trùng lặp sản phẩm với tất cả các thuộc tính
      this.checkDuplicateProduct(sanPhamData, this.selectedSanPhamId).then(isDuplicate => {
        if (isDuplicate) {
          Swal.fire('Lỗi', 'Sản phẩm với thông tin này đã tồn tại!', 'error');
        } else {
          // Nếu không trùng lặp thì tiếp tục thêm hoặc cập nhật sản phẩm
          if (this.selectedSanPhamId) {
            // Cập nhật sản phẩm
            this.sanPhamService.createOrUpdateSanPham(sanPhamData).subscribe(
              (response) => {
                if (response.status) {
                  Swal.fire({
                    icon: 'success',
                    title: 'Cập nhật thành công!',
                    text: 'Sản phẩm đã được cập nhật thành công!'
                  });
                  this.loaddata();
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: response.message || 'Có lỗi xảy ra khi cập nhật sản phẩm!'
                  });
                }
              },
              (error) => {
                console.error('Lỗi khi cập nhật sản phẩm:', error);
                Swal.fire({
                  icon: 'error',
                  title: 'Lỗi!',
                  text: 'Có lỗi xảy ra khi cập nhật sản phẩm!'
                });
              }
            );
          } else {
            // Thêm sản phẩm mới
            this.sanPhamService.createOrUpdateSanPham(sanPhamData).subscribe(
              (response) => {
                if (response.status) {
                  Swal.fire({
                    icon: 'success',
                    title: 'Thêm mới thành công!',
                    text: 'Sản phẩm đã được thêm mới thành công!'
                  });
                  this.loaddata();
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: response.message || 'Có lỗi xảy ra khi thêm mới sản phẩm!'
                  });
                }
              },
              (error) => {
                console.error('Lỗi khi thêm mới sản phẩm:', error);
                Swal.fire({
                  icon: 'error',
                  title: 'Lỗi!',
                  text: 'Có lỗi xảy ra khi thêm mới sản phẩm!'
                });
              }
            );
          }
    
          this.sanPhamForm.reset(); // Reset form
          this.selectedSanPhamId = 0; // Đặt lại ID sản phẩm đã chọn
          this.loaddata(); // Tải lại dữ liệu
        }
      });
    }
    
    
  
  // Hàm kiểm tra trùng sản phẩm

  checkDuplicateProduct(sanPhamData: any, currentProductId: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    this.sanPhamService.getfullSanPham().subscribe((data) => {
      const existingProducts = data?.result?.content || [];

      // Kiểm tra xem sản phẩm với tất cả các thuộc tính đã tồn tại hay chưa
      const isDuplicate = existingProducts.some(item =>
        item.id !== currentProductId &&
        item.ma === sanPhamData.ma &&
        item.ten === sanPhamData.ten &&
        item.xuatXu?.id === sanPhamData.xuatXu?.id &&
        item.thuongHieu?.id === sanPhamData.thuongHieu?.id &&
        item.gioiTinh?.id === sanPhamData.gioiTinh?.id &&
        item.trangThai === sanPhamData.trangThai
      );
      resolve(isDuplicate);
    }, (error) => {
      console.error('Lỗi khi kiểm tra trùng lặp sản phẩm:', error);
      reject(false); // Nếu có lỗi, mặc định là không trùng
    });
  });
}


resetForm() {
  this.sanPhamForm.patchValue({
    maSanPham: this.generateMaSanPham(), // Gán mã sản phẩm mới vào trường maSanPham
    tenSanPham: '',
    xuatXu: '',
    thuongHieu: '',
    gioiTinh: '',
    trangThai: 'Còn hàng' // Giá trị mặc định cho trạng thái
  });
  this.selectedSanPhamId = 0;
  this.loaddata();
  console.log("Đã reset form");
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
    if (this.chiTietSanPhamForm.valid) {
      const sanPhamId = this.selectedSanPhamId;
      const mauSacId = this.chiTietSanPhamForm.value.idMauSac;
      const sizeId = this.chiTietSanPhamForm.value.idSize;
      const chiTietSanPhamId = this.selectedChiTietSanPhamId;
  
      // Tạo mã tự động dựa trên ID màu sắc và kích thước
      const ma = this.generateMaspct(mauSacId, sizeId);
  
      // Kiểm tra trùng lặp trước khi gửi yêu cầu cập nhật
      this.sanPhamService.checkTrungChiTietSanPhamupdate(sanPhamId, mauSacId, sizeId, chiTietSanPhamId).subscribe(
        isDuplicate => {
          if (isDuplicate) {
            Swal.fire('Lỗi', 'Chi tiết sản phẩm với màu sắc và kích thước này đã tồn tại!', 'error');
          } else {
            const updatedChiTietSanPhamData = {
              id: chiTietSanPhamId,
              idSanPham: sanPhamId,
              idMauSac: mauSacId,
              idSize: sizeId,
              ma: ma,
              donGia: this.chiTietSanPhamForm.value.donGia,
              soLuong: this.chiTietSanPhamForm.value.soLuong,
              giChu: this.chiTietSanPhamForm.value.giChu,
              trangThai: this.chiTietSanPhamForm.value.trangThai
            };
  
            this.sanPhamService.updateChiTietSanPham(chiTietSanPhamId, updatedChiTietSanPhamData).subscribe(
              response => {
                Swal.fire('Thành công', 'Chi tiết sản phẩm đã được cập nhật thành công!', 'success');
                this.isUpdateProductDetailModalOpen = false;
                this.loaddata();
                this.selectSanPhamChiTiet(sanPhamId);
              },
              error => {
                console.error('Lỗi khi cập nhật chi tiết sản phẩm:', error);
                Swal.fire('Lỗi', 'Có lỗi xảy ra khi cập nhật chi tiết sản phẩm!', 'error');
              }
            );
          }
        },
        error => {
          console.error('Lỗi khi kiểm tra trùng lặp chi tiết sản phẩm:', error);
          Swal.fire('Lỗi', 'Có lỗi xảy ra khi kiểm tra trùng lặp chi tiết sản phẩm!', 'error');
        }
      );
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
    if (searchTerm && searchTerm.trim() !== '') {
      this.filteredSanPhamList = this.sanPhamList.filter(sanpham =>
        sanpham.ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sanpham.ma.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      // Nếu không có từ khóa tìm kiếm, hiển thị lại toàn bộ danh sách sản phẩm
      this.filteredSanPhamList = [...this.sanPhamList];
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


  onSubmitChiTietSanPham() {
    if (this.chiTietSanPhamForm.valid) {
      const chiTietSanPhamData = {
        id: this.selectedChiTietSanPhamId, // ID của sản phẩm chi tiết cần cập nhật
        idSanPham: this.selectedSanPhamId, // Gửi trực tiếp ID sản phẩm thay vì object
        idMauSac: this.chiTietSanPhamForm.value.idMauSac, // Gửi ID màu sắc thay vì object
        idSize: this.chiTietSanPhamForm.value.idSize, // Gửi ID kích thước thay vì object
        donGia: this.chiTietSanPhamForm.value.donGia,
        soLuong: this.chiTietSanPhamForm.value.soLuong,
        trangThai: this.chiTietSanPhamForm.value.trangThai
      };
  
      // Kiểm tra trùng lặp size và màu sắc trước khi gửi yêu cầu
      this.sanPhamService.checkTrungChiTietSanPham(
        this.selectedSanPhamId,
        chiTietSanPhamData.idMauSac,
        chiTietSanPhamData.idSize
      ).subscribe(
        isDuplicate => {
          if (isDuplicate) {
            // Nếu trùng lặp, hiển thị thông báo lỗi
            Swal.fire({
              icon: 'error',
              title: 'Lỗi!',
              text: 'Chi tiết sản phẩm với kích thước và màu sắc này đã tồn tại!'
            });
          } else {
            // Nếu không trùng lặp, tiếp tục thêm chi tiết sản phẩm
            this.sanPhamService.createChiTietSanPham(chiTietSanPhamData).subscribe(
              response => {
                if (response.status) {
                  Swal.fire({
                    icon: 'success',
                    title: 'Thành công!',
                    text: 'Chi tiết sản phẩm đã được thêm thành công!'
                  });
                  this.loaddata();
                  this.selectSanPhamChiTiet(this.selectedSanPhamId);
                  this.isAddProductDetailModalOpen = false; // Đóng modal sau khi thêm thành công
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: response.message || 'Có lỗi xảy ra khi thêm chi tiết sản phẩm!'
                  });
                }
              },
              error => {
                console.error('Lỗi khi thêm chi tiết sản phẩm:', error);
                Swal.fire({
                  icon: 'error',
                  title: 'Lỗi!',
                  text: 'Có lỗi xảy ra khi thêm chi tiết sản phẩm!'
                });
              }
            );
          }
        },
        error => {
          console.error('Lỗi khi kiểm tra trùng lặp chi tiết sản phẩm:', error);
          Swal.fire({
            icon: 'error',
            title: 'Lỗi!',
            text: 'Có lỗi xảy ra khi kiểm tra chi tiết sản phẩm!'
          });
        }
      );
    }
  }
  
  
  isChiTietModalOpen: boolean = false;

  openChiTietModal(sanPhamId: number) {
    this.selectSanPhamChiTiet(sanPhamId);
    this.isChiTietModalOpen = true;
  }
  
  closeChiTietModal() {
    this.isChiTietModalOpen = false;
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

            chiTietSanPhamData.push({
                idSanPham: this.selectedSanPhamId,
                ma: ma,
                idMauSac: mauSacId,
                idSize: sizeId,
                donGia: this.chiTietSanPhamForm.value.donGia || 0,
                soLuong: this.chiTietSanPhamForm.value.soLuong || 0,
                giChu: this.chiTietSanPhamForm.value.giChu || '',
                trangThai: this.chiTietSanPhamForm.value.trangThai || 'Hết hàng'
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
  // Chỉ tạo mã khi không có ID sản phẩm đã chọn
  if (!this.selectedSanPhamId || this.selectedSanPhamId == 0) {
    const maSanPham = `SP${Math.floor(1000 + Math.random() * 9000)}`; // Ví dụ mã sản phẩm có định dạng SPXXXX
    return maSanPham;
  } else {
    // Nếu đang chỉnh sửa, trả về mã hiện tại
    return this.sanPhamForm.get('maSanPham')?.value; 
  }
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

  console.log('Hàm onSubmitAttribute đã được gọi');

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
    'mau-sac': this.sanPhamService.addMauSac,
    'size': this.sanPhamService.addSize,
    'xuat-xu': this.sanPhamService.addXuatXu,
    'thuong-hieu': this.sanPhamService.addThuongHieu
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
    console.error('Loại thuộc tính không hợp lệ:', attributeType);
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
SanPhamChiTietbyid: any = [];
CheckImageLimit: boolean = false;

  // Hàm lấy chi tiết sản phẩm và tải ảnh đã lưu
  chonSphinh(id: number) {
    this.idSpct = id;
    this.loadSavedImages();
  }

// Hàm lấy danh sách ảnh đã lưu của sản phẩm
loadSavedImages() {
  this.sanPhamService.getImagesByProductId(this.idSpct).subscribe(
    (response: any) => {
      const content = response.result.content.content || [];

      // Kiểm tra nếu `content` là một mảng và lấy ID và URL ảnh
      if (Array.isArray(content) && content.length > 0) {
        this.savedImages = content.map((img: any) => ({
          id: img.id,            // Lưu ID ảnh
          url: img.urlAnh || ''  // Lưu URL ảnh
        }));
      } else {
        this.savedImages = []; // Không có ảnh nào
      }

      console.log("Ảnh đã lưu:", this.savedImages);
    },
    (error) => {
      console.error("Lỗi khi lấy danh sách ảnh:", error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không thể tải ảnh đã lưu.',
      });
    }
  );
}




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
  
  

 // Hàm lưu các ảnh đã chọn
saveImages() {
  const maxImages = 3;

  // Kiểm tra nếu không có ảnh nào được chọn
  if (this.selectedImages.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Chưa chọn ảnh',
      text: 'Vui lòng chọn ảnh trước khi lưu.',
    });
    return;
  }

  // Lấy số lượng ảnh hiện tại
  this.sanPhamService.getImagesByProductId(this.idSpct).subscribe(
    (response: any) => {
      const currentImageCount = response.result.content.totalElements || 0;

      // Kiểm tra nếu tổng số ảnh sau khi thêm ảnh mới sẽ vượt quá giới hạn
      if (currentImageCount + this.selectedImages.length > maxImages) {
        Swal.fire({
          icon: 'error',
          title: 'Đã đủ ảnh',
          text: `Sản phẩm này đã có đủ ${maxImages} ảnh.`,
        });
        return;
      }

      // Nếu không vượt quá giới hạn, tiến hành lưu từng ảnh
      const saveRequests = this.selectedImages.map(image =>
        this.sanPhamService.uploadAnh(this.idSpct, image)
      );

      // Thực hiện tất cả các yêu cầu lưu ảnh và đợi hoàn thành
      Promise.all(saveRequests.map(req => req.toPromise()))
        .then(responses => {
          console.log("Ảnh đã được lưu thành công:", responses);
          
          Swal.fire({
            icon: 'success',
            title: 'Lưu ảnh thành công',
            text: 'Tất cả ảnh đã được lưu thành công.',
          });

          // Xóa danh sách ảnh mới và tải lại danh sách ảnh đã lưu
          this.selectedImages = [];
          this.loadSavedImages();
        })
        .catch(error => {
          console.error("Lỗi khi lưu ảnh:", error);
          Swal.fire({
            icon: 'error',
            title: 'Lỗi lưu ảnh',
            text: 'Có lỗi xảy ra khi lưu ảnh. Vui lòng thử lại.',
          });
        });
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





} 
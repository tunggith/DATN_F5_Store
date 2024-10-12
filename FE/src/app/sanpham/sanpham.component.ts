import { Component, OnInit } from '@angular/core';
import { SevricesanphamService } from './sevricesanpham.service'; // Import service
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
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
 
  searchTerm: string = '';
  isUpdateProductDetailModalOpen: boolean = false;  // Biến điều khiển modal cập nhật
  selectedChiTietSanPhamId: number = 0;  // ID của sản phẩm chi tiết đã chọn để cập nhật

  sanPhamForm: FormGroup;
  attributeForm: FormGroup;
  chiTietSanPhamForm : FormGroup;

  searchChiTietTerm: string = '';
  isaddThuocTinhlModalOpen = false;  // Biến để điều khiển hiển thị modal

  constructor(private fb: FormBuilder, private sanPhamService: SevricesanphamService) { }
  isAddProductDetailModalOpen: boolean = false;  // Biến điều khiển modal

  pageSizeChiTiet: number = 5;  // Kích thước trang mặc định
  totalElementsChiTiet: number = 0;  // Tổng số phần tử

  ngOnInit() {
    this.sanPhamForm = this.fb.group({
      id: [null],
      maSanPham: ['', Validators.required],
      tenSanPham: ['', Validators.required],
      xuatXu: ['', Validators.required],
      thuongHieu: ['', Validators.required],
      gioiTinh: ['', Validators.required],
      trangThai: ['Còn hàng', Validators.required]
    });


    this.chiTietSanPhamForm = this.fb.group({
      ma: ['', Validators.required],
      ten: ['', Validators.required],
      idMauSac: ['', Validators.required],
      idSize: ['', Validators.required],
      donGia: [0, Validators.required],
      soLuong: [0, Validators.required],
      trangThai: ['Còn hàng', Validators.required]
    });


    this.attributeForm = this.fb.group({
      type: ['', Validators.required],  // Loại thuộc tính
      ma: ['', Validators.required],    // Mã thuộc tính
      ten: ['', Validators.required]    // Tên thuộc tính
    });

    this.loaddata();

    this.filteredChiTietSanPhamList = [...this.chiTietSanPhamList]; 
  }

  loaddata() {
    this.getSanPhamPhanTrang(this.pageSanPham);
    this.getAllThuongHieu();
    this.getAllXuatXu();
    this.getAllGioiTinh();
    this.getAllSizes();
    this.getAllMauSac();
    
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

  getSanPhamPhanTrang(page: number) {
    this.sanPhamService.getSanPhamPhanTrang(page, this.sizeSanPham).subscribe(response => {
      if (response.status) {
        console.log('Dữ liệu sản phẩm:', response.result.content);  // Log dữ liệu trả về từ API để kiểm tra
        this.sanPhamList = response.result.content.content;  // Gán danh sách sản phẩm
        this.filteredSanPhamList = [...this.sanPhamList];    // Sao chép dữ liệu cho filtered list
        this.totalPagesSanPham = response.result.content.totalPages;  // Gán số trang
        this.pageSanPham = response.result.content.pageable.pageNumber;  // Gán số trang hiện tại
      }
    }, error => {
      console.error('Lỗi khi gọi API getSanPhamPhanTrang:', error);
    });
  }
  

  
  getChiTietSanPhamPhanTrang(idSanPham: number, page: number = 0) {
    this.sanPhamService.getChiTietSanPhamPhanTrang(idSanPham, page).subscribe(
      response => {
        if (response) {
          // Lấy danh sách sản phẩm từ content
          this.chiTietSanPhamList = response.content || [];
          this.filteredChiTietSanPhamList = [...this.chiTietSanPhamList]; // Cập nhật danh sách lọc
  
          // Cập nhật thông tin phân trang
          this.totalPagesChiTiet = response.totalPages || 1;  // Tổng số trang
          this.pageChiTiet = response.currentPage || 0;       // Trang hiện tại
          this.pageSizeChiTiet = response.pageSize || 5;      // Kích thước trang (5 sản phẩm mỗi trang)
          this.totalElementsChiTiet = response.totalElements || 0;  // Tổng số phần tử
  
          console.log(`Trang hiện tại: ${this.pageChiTiet}, Tổng số trang: ${this.totalPagesChiTiet}`);
        }
      },
      error => {
        console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
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
    this.getChiTietSanPhamPhanTrang(idSanPham);
  }

  changePageChiTiet(newPage: number) {
    if (newPage >= 0 && newPage < this.totalPagesChiTiet) {
      this.getChiTietSanPhamPhanTrang(this.selectedSanPhamId, newPage);
    }
  }

  changePageSanPham(newPage: number) {
    if (newPage >= 0 && newPage < this.totalPagesSanPham) {
      this.getSanPhamPhanTrang(newPage);
    }
  }

  onSubmit() {
    // Kiểm tra tính hợp lệ của form
    if (this.sanPhamForm.invalid) {
      let errorMessage = '';
  
      // Lặp qua từng trường để tìm lỗi
      if (this.sanPhamForm.get('maSanPham').invalid) {
        errorMessage += 'Mã sản phẩm là bắt buộc.\n';
      }
      if (this.sanPhamForm.get('tenSanPham').invalid) {
        errorMessage += 'Tên sản phẩm là bắt buộc.\n';
      }
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
  
      // Hiển thị thông báo lỗi
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: errorMessage.trim()
      });
  
      return; // Dừng lại nếu form không hợp lệ
    }
  
    // Lấy dữ liệu sản phẩm từ form
    const sanPhamData = {
      id: this.selectedSanPhamId ? this.selectedSanPhamId : 0,
      ma: this.sanPhamForm.value.maSanPham,
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
  
    // Kiểm tra trùng lặp sản phẩm
    this.checkDuplicateProduct(sanPhamData.ma, sanPhamData.ten, this.selectedSanPhamId).then(isDuplicate => {
      if (isDuplicate) {
        Swal.fire('Lỗi', 'Mã sản phẩm hoặc tên sản phẩm đã tồn tại!', 'error');
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
  checkDuplicateProduct(ma: string, ten: string, currentProductId: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.sanPhamService.getfullSanPham().subscribe((data) => {
        const existingProducts = data?.result?.content || [];
  
        // Kiểm tra xem mã sản phẩm hoặc tên sản phẩm đã tồn tại hay chưa
        const isDuplicate = existingProducts.some(item => 
          (item.ma === ma || item.ten === ten) && item.id !== currentProductId
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
      maSanPham: '',
      tenSanPham: '',
      xuatXu: '',
      thuongHieu: '',
      gioiTinh: '',
      trangThai: 'Còn hàng' // Giá trị mặc định cho trạng thái
    });
    this.selectedSanPhamId = 0;
    this.loaddata();
    
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
  


    openUpdateProductDetailModal(idChiTietSanPham: number) {
      if (idChiTietSanPham) {
        this.selectedChiTietSanPhamId = idChiTietSanPham;  // Lưu ID chi tiết sản phẩm đã chọn
        this.isUpdateProductDetailModalOpen = true;  // Hiển thị modal cập nhật
    
        // Gọi API lấy dữ liệu chi tiết sản phẩm theo ID
        this.sanPhamService.getChiTietSanPhamById(idChiTietSanPham).subscribe(
          (response: any) => {
            if (response && response.result && response.result.content) {
              const chiTietSanPham = response.result.content;
    
              // Điền dữ liệu chi tiết sản phẩm vào form
              this.chiTietSanPhamForm.patchValue({
                ma: chiTietSanPham.ma,  // Patch mã chi tiết
                ten: chiTietSanPham.ten,  // Patch tên chi tiết
                idMauSac: chiTietSanPham.mauSac?.id,  // Patch id màu sắc (nếu có)
                idSize: chiTietSanPham.size?.id,  // Patch id kích thước (nếu có)
                donGia: chiTietSanPham.donGia,  // Patch đơn giá
                soLuong: chiTietSanPham.soLuong,  // Patch số lượng
                trangThai: chiTietSanPham.trangThai  // Patch trạng thái
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

// Hàm kiểm tra trùng lặp và xử lý thêm thuộc tính
onSubmitAttribute() {
  if (this.attributeForm.valid) {
    const attributeType = this.attributeForm.value.type;
    const attributeData = {
      id: 0,
      ma: this.attributeForm.value.ma,
      ten: this.attributeForm.value.ten
    };

    // Kiểm tra trùng lặp trước khi thêm
    this.checkDuplicateAttribute(attributeType, attributeData.ma, attributeData.ten).then(isDuplicate => {
      if (isDuplicate) {
        Swal.fire('Lỗi', 'Thuộc tính đã tồn tại!', 'error');
      } else {
        // Nếu không trùng, tiến hành thêm thuộc tính
        this.addAttribute(attributeType, attributeData);
      }
    }).catch(error => {
      console.error('Lỗi khi kiểm tra trùng lặp:', error);
    });
  }
}

// Hàm thêm thuộc tính
addAttribute(attributeType: string, attributeData: any) {
  switch (attributeType) {
    case 'mau-sac':
      this.sanPhamService.addMauSac(attributeData).subscribe(
        response => {
          Swal.fire('Thành công', 'Màu sắc đã được thêm!', 'success');
        },
        error => {
          Swal.fire('Lỗi', 'Có lỗi xảy ra khi thêm màu sắc!', 'error');
        }
      );
      this.closeAddAttributeModal();
      break;
    case 'size':
      this.sanPhamService.addSize(attributeData).subscribe(
        response => {
          Swal.fire('Thành công', 'Kích thước đã được thêm!', 'success');
        },
        error => {
          Swal.fire('Lỗi', 'Có lỗi xảy ra khi thêm kích thước!', 'error');
        }
      );
      break;
    case 'xuat-xu':
      this.sanPhamService.addXuatXu(attributeData).subscribe(
        response => {
          Swal.fire('Thành công', 'Xuất xứ đã được thêm!', 'success');
        },
        error => {
          Swal.fire('Lỗi', 'Có lỗi xảy ra khi thêm xuất xứ!', 'error');
        }
      );
      this.closeAddAttributeModal();
      break;
    case 'thuong-hieu':
      this.sanPhamService.addThuongHieu(attributeData).subscribe(
        response => {
          Swal.fire('Thành công', 'Thương hiệu đã được thêm!', 'success');
        },
        error => {
          Swal.fire('Lỗi', 'Có lỗi xảy ra khi thêm thương hiệu!', 'error');
        }
      );
       this.closeAddAttributeModal();
      break;
    default:
      Swal.fire('Lỗi', 'Loại thuộc tính không hợp lệ!', 'error');
  }
}

// Hàm kiểm tra trùng lặp
checkDuplicateAttribute(type: string, ma: string, ten: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    let existingAttributes = [];

    // Giả sử có các API hoặc danh sách để kiểm tra theo loại thuộc tính
    switch (type) {
      case 'mau-sac':
        this.sanPhamService.getAllMauSac().subscribe(data => {
          existingAttributes = data?.result?.content || []; // Lấy ra danh sách từ kết quả
          resolve(this.isDuplicate(existingAttributes, ma, ten));
        });
        break;
      case 'size':
        this.sanPhamService.getAllSizes().subscribe(data => {
          existingAttributes = data?.result?.content || []; // Lấy ra danh sách từ kết quả
          resolve(this.isDuplicate(existingAttributes, ma, ten));
        });
        break;
      case 'xuat-xu':
        this.sanPhamService.getAllXuatXu().subscribe(data => {
          existingAttributes = data?.result?.content || []; // Lấy ra danh sách từ kết quả
          resolve(this.isDuplicate(existingAttributes, ma, ten));
        });
        break;
      case 'thuong-hieu':
        this.sanPhamService.getAllThuongHieu().subscribe(data => {
          existingAttributes = data?.result?.content || []; // Lấy ra danh sách từ kết quả
          resolve(this.isDuplicate(existingAttributes, ma, ten));
        });
        break;
      default:
        resolve(false); // Không hợp lệ, không cần kiểm tra
    }
  });
}


// Hàm kiểm tra trùng lặp trong danh sách
isDuplicate(list: any[], ma: string, ten: string): boolean {
  // Kiểm tra list là mảng và các phần tử có cấu trúc đúng
  if (!Array.isArray(list)) {
    console.error('Dữ liệu không phải là mảng:', list);
    return false;
  }

  // Kiểm tra từng phần tử trong mảng
  return list.some(item => {
    // Kiểm tra phần tử có thuộc tính 'ma' và 'ten' không
    return item && typeof item.ma === 'string' && typeof item.ten === 'string' && (item.ma === ma || item.ten === ten);
  });
}


  

  // Hàm mở modal
  openAddAttributeModal() {
    console.log('Mở modal thêm thuộc tính');
    this.isaddThuocTinhlModalOpen = true;
    console.log('Trạng thái isaddThuocTinhlModalOpen:', this.isaddThuocTinhlModalOpen);
  }
  
  // Hàm đóng modal
  closeAddAttributeModal() {
    console.log('Đóng modal thêm thuộc tính');
    this.isaddThuocTinhlModalOpen = false;
    console.log('Trạng thái isaddThuocTinhlModalOpen:', this.isaddThuocTinhlModalOpen);
  }
  

  onSubmitChiTietSanPham() {
    if (this.chiTietSanPhamForm.valid) {
      // Tạo object đúng với API yêu cầu
      const chiTietSanPhamData = {
        id: 0,
        idSanPham: this.selectedSanPhamId,  // Gửi ID sản phẩm thay vì đối tượng
        idMauSac: this.chiTietSanPhamForm.value.idMauSac,  // Gửi ID màu sắc
        idSize: this.chiTietSanPhamForm.value.idSize,  // Gửi ID kích thước
        ma: this.chiTietSanPhamForm.value.ma,
        ten: this.chiTietSanPhamForm.value.ten,
        donGia: this.chiTietSanPhamForm.value.donGia,
        soLuong: this.chiTietSanPhamForm.value.soLuong,
        trangThai: this.chiTietSanPhamForm.value.trangThai
      };
  
      // Kiểm tra trùng lặp
      this.sanPhamService.checkTrungChiTietSanPham(
        chiTietSanPhamData.idSanPham,
        chiTietSanPhamData.idMauSac,
        chiTietSanPhamData.idSize,
        chiTietSanPhamData.ma,
        chiTietSanPhamData.ten
      ).subscribe(
        isDuplicate => {
          if (isDuplicate) {
            // Nếu trùng lặp, hiển thị thông báo lỗi
            Swal.fire({
              icon: 'error',
              title: 'Lỗi!',
              text: 'Chi tiết sản phẩm đã tồn tại!'
            });
          } else {
            // Nếu không trùng lặp, thực hiện thêm sản phẩm
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
                  this.isAddProductDetailModalOpen = false;  // Đóng modal sau khi thêm thành công
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
          console.error('Lỗi khi kiểm tra trùng chi tiết sản phẩm:', error);
          Swal.fire({
            icon: 'error',
            title: 'Lỗi!',
            text: 'Có lỗi xảy ra khi kiểm tra trùng chi tiết sản phẩm!'
          });
        }
      );
    }
  }
  


  onSubmitUpdateChiTietSanPham() {
    if (this.chiTietSanPhamForm.valid) {
      // Lấy giá trị từ form
      const soLuong = this.chiTietSanPhamForm.value.soLuong;
      const donGia = this.chiTietSanPhamForm.value.donGia;
      let trangThai = this.chiTietSanPhamForm.value.trangThai;
  
      // Kiểm tra số lượng: Nếu số lượng bằng 0, đặt trạng thái là 'hết hàng'
      // Nếu số lượng lớn hơn 0, đặt trạng thái là 'còn hàng'
      if (soLuong === 0) {
        trangThai = 'hết hàng';
      } else if (soLuong > 0) {
        trangThai = 'còn hàng';
      }
  
      // Kiểm tra giá tiền: Nếu giá tiền <= 0, hiển thị thông báo lỗi
      if (donGia <= 0) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Giá tiền phải lớn hơn 0!'
        });
        return;  // Dừng lại, không gửi dữ liệu
      }
  
      // Tạo object theo cấu trúc API yêu cầu
      const updatedChiTietSanPhamData = {
        id: this.selectedChiTietSanPhamId,  // ID của sản phẩm chi tiết cần cập nhật
        idSanPham: this.selectedSanPhamId,  // ID sản phẩm chính
        idMauSac: this.chiTietSanPhamForm.value.idMauSac,  // ID màu sắc
        idSize: this.chiTietSanPhamForm.value.idSize,  // ID kích thước
        ma: this.chiTietSanPhamForm.value.ma,
        ten: this.chiTietSanPhamForm.value.ten,
        donGia: donGia,  // Giá tiền
        soLuong: soLuong,  // Số lượng
        trangThai: trangThai  // Trạng thái cập nhật ('hết hàng' hoặc 'còn hàng')
      };
  
      // Gửi dữ liệu cập nhật tới API
      this.sanPhamService.updateChiTietSanPham(this.selectedChiTietSanPhamId, updatedChiTietSanPhamData).subscribe(
        response => {
          Swal.fire({
            icon: 'success',
            title: 'Cập nhật thành công!',
            text: 'Chi tiết sản phẩm đã được cập nhật.'
          });
  
          this.isUpdateProductDetailModalOpen = false;  // Đóng modal sau khi cập nhật thành công
          this.loaddata();
          this.selectSanPhamChiTiet(this.selectedSanPhamId);  // Tải lại danh sách chi tiết sản phẩm
        },
        error => {
          console.error('Lỗi khi cập nhật chi tiết sản phẩm:', error);
          Swal.fire({
            icon: 'error',
            title: 'Lỗi!',
            text: 'Có lỗi xảy ra khi cập nhật chi tiết sản phẩm!'
          });
        }
      );
    }
  }
  
}
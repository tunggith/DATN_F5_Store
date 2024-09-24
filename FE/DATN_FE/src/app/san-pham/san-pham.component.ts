import { Component, OnInit } from '@angular/core';
import { SanPhamService } from '../san-pham.service';
import { SanPham } from '../san-pham';
import { XuatXuService } from '../xuat-xu.service';
import { XuatXu } from '../xuat-xu';
import { ThuongHieu } from '../thuong-hieu';
import { ThuongHieuService } from '../thuong-hieu.service';
import { ChatLieu } from '../chat-lieu';
import { ChatLieuService } from '../chat-lieu.service';

@Component({
  selector: 'app-san-pham',
  templateUrl: './san-pham.component.html',
  styleUrls: ['./san-pham.component.scss']
})

export class SanPhamComponent implements OnInit {
  public sanPhamList: SanPham[] = [];
  totalElement: number = 0;
  currentPage: number = 0;
  pageSize: number = 5;
  totalPages: number[] = [];
  searchTerm: string = '';
  pagination: number[] = [];
  xuatXuOptions: XuatXu[] = [];
  thuongHieuOptions: ThuongHieu[] = [];
  chatLieuOptions: ChatLieu[] = [];

  constructor(
    private SanPhamService: SanPhamService,
    private XuatXuService: XuatXuService,
    private thuongHieuService: ThuongHieuService,
    private chatLieuService: ChatLieuService
  ) { }
  ngOnInit(): void {
    this.loadSanPham();
    this.loadXuatXuOptions();
    this.loadThuongHieuOptions();
    this.loadChatLieuOptions();
  }

  loadSanPham(ten?: string, ma?: string) {
    this.SanPhamService.findByTenOrMa(this.currentPage, this.pageSize, ten, ma).subscribe((data: any) => {
      this.sanPhamList = data.result.content.content;
      this.totalElement = data.result.pagination.totalElements;
      this.totalPages = Array.from({ length: data.result.pagination.totalPage }, (v, k) => k);
      this.updatePagination();
    },
      error => {
        console.error('lỗi khi tải sản phẩm', error);
      });
  }
  updatePagination(): void {
    const totalPages = Math.ceil(this.totalElement / this.pageSize);
  }
  searchSanPham(): void {
    this.currentPage = 0;
    this.loadSanPham(this.searchTerm, this.searchTerm);
  }
  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadSanPham(this.searchTerm, this.searchTerm);
    }
  }
  nextPage(): void {
    if (this.currentPage < this.totalPages.length - 1) {
      this.currentPage++;
      console.log('Navigating to Next Page:', this.currentPage);
      this.loadSanPham(this.searchTerm, this.searchTerm);
    }
  }
  loadPage(page: number): void {
    console.log('Loading Page:', page);
    this.currentPage = page;
    this.loadSanPham(this.searchTerm, this.searchTerm);
  }
  //option hiển thị 
  //xuất xứ
  loadXuatXuOptions(): void{
    this.XuatXuService.getXuatXu().subscribe((data: any)=>{
        this.xuatXuOptions = data.result.content;
    })
  }
  //thương hiệu
  loadThuongHieuOptions(): void{
    this.thuongHieuService.getThuongHieu().subscribe((data: any)=>{
      this.thuongHieuOptions = data.result.content;
    })
  }
  //chất liệu
  loadChatLieuOptions(): void{
    this.chatLieuService.getChatLieu().subscribe((data:any)=>{
      this.chatLieuOptions = data.result.content;
    })
  }
  //add sản phẩm
  newSanPham: SanPham = {
    ma: '',
    ten: '',
    trangThai: 'Đang hoạt động',
    xuatXu: {
      id: 0,
      ma: '',
      ten: ''
    },
    thuongHieu: {
      id: 0,
      ma: '',
      ten: ''
    },
    chatLieu: {
      id: 0,
      ma: '',
      ten: ''
    }

  }
  // hàm thêm sản phẩm mới
  addSanPham(): void {
    this.SanPhamService.addSanPham(this.newSanPham).subscribe(
      response => {
        console.log('thêm sản phẩm thành công!', response);
        
        //reset lại form sau khi thêm sản phẩm
        this.newSanPham = {
          ma: '',
          ten: '',
          trangThai: 'Đang hoạt động',
          xuatXu: {
            id: 0,
            ma: '',
            ten: ''
          },
          thuongHieu: {
            id: 0,
            ma: '',
            ten: ''
          },
          chatLieu: {
            id: 0,
            ma: '',
            ten: ''
          }
        }
        //tải lại danh sách sản phẩm sau khi thêm
        this.loadSanPham();
      },
      error=>{
        console.log('add sản phẩm lỗi',error);
      }
    );
  }

}
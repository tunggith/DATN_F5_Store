import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SevricesanphamService {
  private apiUrl = 'http://localhost:8080/api/v1'; // URL gốc API cho sản phẩm
  private apispct = 'http://localhost:8080/api/v1/chi_tiet_san_pham';  // URL gốc API cho sản phẩm
  private defaultSize = 3;  // Kích thước mặc định là 3

  constructor(private http: HttpClient) { }

  // Hàm để tạo hoặc cập nhật sản phẩm
  createOrUpdateSanPham(sanPhamData: any): Observable<any> {
    if (sanPhamData.id && sanPhamData.id !== 0) {
      // Nếu có ID, thực hiện cập nhật
      const url = `${this.apiUrl}/san-pham/update/${sanPhamData.id}`;
      return this.http.put<any>(url, sanPhamData); // PUT request để cập nhật sản phẩm
    } else {
      // Nếu không có ID hoặc ID bằng 0, thực hiện tạo mới
      const url = `${this.apiUrl}/san-pham/create`;
      return this.http.post<any>(url, sanPhamData); // POST request để tạo sản phẩm
    }
  }


  getSanPhamPhanTrang(page: number, size: number = this.defaultSize): Observable<any> {
    const url = `${this.apiUrl}/san-pham/getAll?page=${page}&size=${size}`;
    return this.http.get<any>(url);
  }

  getChiTietSanPhamPhanTrang(idSanPham: number, currentPage: number = 0, size: number = this.defaultSize): Observable<any> {
    const url = `${this.apispct}/getall-phan_trang/${idSanPham}?currentPage=${currentPage}&size=${size}`;
    return this.http.get<any>(url);
  }

  getAllThuongHieu(): Observable<any> {
    const url = `${this.apiUrl}/thuong-hieu/getAll`;
    return this.http.get<any>(url);
  }


  getfullSanPham(): Observable<any> {
    const url = `${this.apiUrl}/san-pham/getfull`;
    return this.http.get<any>(url);
  }

  getAllXuatXu(): Observable<any> {
    const url = `${this.apiUrl}/xuat-xu/getAll`;
    return this.http.get<any>(url);
  }

  getAllGioiTinh(): Observable<any> {
    const url = `${this.apiUrl}/gioi-tinh/getAll`;
    return this.http.get<any>(url);
  }

  createChiTietSanPham(chiTietSanPhamData: any): Observable<any> {
    const url = `${this.apispct}/created`;
    return this.http.post<any>(url, chiTietSanPhamData);
  }

  // Hàm để gọi API lấy danh sách kích thước (Size)
  getAllSizes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/size/getAll`);
  }

  getAllMauSac(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/mau-sac/getAll`);
  }

  updateChiTietSanPham(idChiTietSanPham: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/chi_tiet_san_pham/update/${idChiTietSanPham}`, data);
  }

  getAllChiTietSanPham(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/api/v1/chi_tiet_san_pham/getAll');
  }

  getChiTietSanPhamById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apispct}/${id}`);
  }

  // Thêm màu sắc
  addMauSac(mauSac: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/mau-sac/create`, mauSac);
  }

  // Thêm size
  addSize(size: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/size/create`, size);
  }

  // Thêm xuất xứ
  addXuatXu(xuatXu: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/xuat-xu/create`, xuatXu);
  }

  // Thêm thương hiệu
  addThuongHieu(thuongHieu: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/thuong-hieu/create`, thuongHieu);
  }



// Trong sanPhamService

  checkTrungChiTietSanPham(idSanPham: number, idMauSac: number, idSize: number, ma: string, ten: string): Observable<boolean> {
    const url = `http://localhost:8080/api/v1/chi_tiet_san_pham/check-trung?idSanPham=${idSanPham}&idMauSac=${idMauSac}&idSize=${idSize}&ma=${ma}&ten=${ten}`;
    return this.http.get<boolean>(url);
  }


}

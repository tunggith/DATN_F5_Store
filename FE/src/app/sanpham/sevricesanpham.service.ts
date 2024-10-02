import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SevricesanphamService {

  private apiUrl = 'http://localhost:8080/api/v1` /san-pham/getAll';  // API của bạn
  private defaultSize = 5;  // Kích thước mặc định là 5

  constructor(private http: HttpClient) { }

  // Hàm lấy danh sách sản phẩm có phân trang, mặc định size là 5
  getAllSanPham(page: number, size: number = this.defaultSize): Observable<any> {
    const url = `${this.apiUrl}?page=${page}&size=${size}`; // Tạo URL với tham số trang và kích thước
    return this.http.get<any>(url);
  }
  
  // Phương thức gọi API để lấy chi tiết sản phẩm
  getChiTietSanPham(idSanPham: number): Observable<any> {
    const apiUrl = `http://localhost:8080/api/v1/chi_tiet_san_pham/getall-phan_trang/${idSanPham}?currentPage=0`;
    return this.http.get<any>(apiUrl); // Trả về Observable để sử dụng sau này
  }

  
}

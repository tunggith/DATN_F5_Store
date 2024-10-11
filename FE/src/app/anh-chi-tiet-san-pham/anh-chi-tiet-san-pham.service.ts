import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnhChiTietSanPhamService {
  private baseUrl = 'http://localhost:8080/api/v1/anh-chi-tiet-san-pham'; // Địa chỉ API của bạn

  constructor(private http: HttpClient) { }

  // Phương thức để lấy danh sách sản phẩm
  getProducts(page: number, size: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/getAllAnhChiTietSanPham_TimKiem_PhanTrang?page=${page}&size=${size}`);
  }
 // Phương thức để lấy danh sách chi tiết sản phẩm
  getChiTietSanPham(page: number, size: number): Observable<any> {
    return this.http.get(`http://localhost:8080/api/v1/chi_tiet_san_pham/getall-phan_trang?page=${page}&size=${size}`);
  }
  // Phương thức để thêm sản phẩm
  addProduct(product: any, chiTietSanPhamId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/addAnhChiTietSanPham?chiTietSanPhamId=${chiTietSanPhamId}`, product);
  }
  // Phương thức để cập nhật sản phẩm
  updateProduct(id: number, product: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/updateAnhChiTietSanPham/${id}`, product);
  }

 
}

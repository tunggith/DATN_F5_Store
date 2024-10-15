import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiaChiKhachHangService {
  private baseUrlDiaChi = 'http://localhost:8080/api/v1/dia-chi-khach-hang'; // Địa chỉ API của bạn

  constructor(private http: HttpClient) {}

  // Lấy danh sách địa chỉ khách hàng với phân trang
  getAllAddresses(page: number, size: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrlDiaChi}/getAllDiaChiKhachHang_PhanTrang_TimKiem?page=${page}&size=${size}`);
  }
  addDiaChiKhachHang(customerAddress: any): Observable<any> {
    return this.http.post(`${this.baseUrlDiaChi}/addDiaChiKhachHang`, customerAddress); // Địa chỉ API thêm khách hàng
  }
  updateDiaChiKhachHang(id: number, customerAddress: any): Observable<any> {
    return this.http.put(`${this.baseUrlDiaChi}/updateDiaChiKhachHang/${id}`, customerAddress); // Địa chỉ API cập nhật khách hàng
  }
}

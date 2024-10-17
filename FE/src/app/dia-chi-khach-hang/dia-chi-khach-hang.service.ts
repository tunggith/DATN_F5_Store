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
  getAllAddresses(id:number,page:number,size:number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrlDiaChi}/get-by-khach-hang/${id}?page=${page}&size=${size}`);
  }
  addDiaChiKhachHang(customerAddress: any): Observable<any> {
    return this.http.post(`${this.baseUrlDiaChi}/addDiaChiKhachHang`, customerAddress);
  }
  updateDiaChiKhachHang(id: number, customerAddress: any): Observable<any> {
    return this.http.put(`${this.baseUrlDiaChi}/updateDiaChiKhachHang/${id}`, customerAddress);
  }
  chiTietDiaChi(id:number):Observable<any>{
    return this.http.get(`${this.baseUrlDiaChi}/chi-tiet-dia-chi/${id}`);
  }
}

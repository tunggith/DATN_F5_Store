import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private baseUrl = 'http://localhost:8080/api/v1/khach-hang';
  private baseUrlDiaChi = 'http://localhost:8080/api/v1/dia-chi-khach-hang';
  private readonly defaultSize = 5;

  constructor(private http: HttpClient) { }

  getAllKh(page: number, size: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/getAllKhachHang_PhanTrang_TimKiem?page=${page}&size=${size}`);
  }
  addKhachHang(customer: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/addKhachHang`, customer); // Địa chỉ API thêm khách hàng
  }

  updateKhachHang(id: number, customer: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/updateKhachHang/${id}`, customer); // Địa chỉ API cập nhật khách hàng
  }

  searchKhachHang(page: number, size: number, keyword: string): Observable<any> {
    let params = `?page=${page}&size=${size}&ten=${keyword}&ma=${keyword}&email=${keyword}&sdt=${keyword}`;
    return this.http.get(`${this.baseUrl}/find-by-ten-ma-email-sdt${params}`);
  }
  

}

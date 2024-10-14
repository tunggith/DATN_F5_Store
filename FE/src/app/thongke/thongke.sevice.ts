import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThongkeService {
  private apiUrl = 'http://localhost:8080/api/v1/thong-ke'; // URL gốc API cho thống kê sản phẩm

  constructor(private http: HttpClient) { }

  // Phương thức để gọi API lấy top 10 sản phẩm bán chạy nhất
  getTop10SanPhamBanChay(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/top10-banchay`);
  }


  getDoanhThuTheoThang(year: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/theo-thang?year=${year}`);
  }

  getDoanhThuTheoQuy(year: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/theo-quy?year=${year}`);
  }

  getDoanhThuTheoNam(startYear: number, endYear: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/theo-nam?startYear=${startYear}&endYear=${endYear}`);
  }

   // Phương thức để gọi API lấy thống kê theo ngày
   getDoanhThuTheoNgay(startDate: string, endDate: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/theo-ngay?startDate=${startDate}&endDate=${endDate}`);
  }

  getTopSanPhamTheoThang(year: number) {
    return this.http.get<any[]>(`${this.apiUrl}/top-san-pham/theo-thang?year=${year}`);
  }

  getTopSanPhamTheoQuy(year: number) {
    return this.http.get<any[]>(`${this.apiUrl}/top-san-pham/theo-quy?year=${year}`);
  }

  getTopSanPhamTheoNgay(startDate: string, endDate: string) {
    return this.http.get<any[]>(`${this.apiUrl}/top-san-pham/theo-ngay?startDate=${startDate}&endDate=${endDate}`);
  }
  getTopSanPhamTheoNam(startYear: number, endYear: number) {
    return this.http.get<any[]>(`${this.apiUrl}/top-san-pham/theo-khoang-nam?startYear=${startYear}&endYear=${endYear}`);
  }
  

}

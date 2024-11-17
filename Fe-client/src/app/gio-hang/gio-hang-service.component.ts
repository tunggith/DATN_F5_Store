
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class GioHangService {
 
  private apiFindGh = 'http://localhost:8080/api/v1/customer/getByGioHang';
  private apiGh = 'http://localhost:8080/api/v1/customer/createGh';
  private apiGh2 = 'http://localhost:8080/api/v1/customer/createGh2';
 


  constructor(private http: HttpClient) {}


 
  // Trong dangNhapService, bạn có thể gọi API lấy danh sách hóa đơn cho khách hàng theo id
  getHoaDonByKhachHang(id: string): Observable<any> {
    return this.http.get<any>(`http://localhost:8080/api/v1/customer/getByKhachHang/${id}`); // Thay đổi URL này theo API thực tế của bạn
  }

  deleteGioHangCt(id: number): Observable<any> {
    return this.http.delete<any>(`http://localhost:8080/api/v1/customer/deleteGhct/${id}`); 
  }
  

  createGioHang(newGioHang: any): Observable<any> {
    const url = 'http://localhost:8080/api/v1/customer/CreatedGioHang';
    return this.http.post<any>(url, newGioHang);
  }

  addToCart(idGioHang: number, idChiTietSanPham: number, soLuong: number): Observable<any> {
    const requestBody = {
      idGioHang: idGioHang,
      idChiTietSanPham: idChiTietSanPham,
      soLuong: soLuong
    };

    return this.http.post<any>(this.apiGh, requestBody);
  }

  addToCart2(idGioHang: number, idChiTietSanPham: number, soLuong: number): Observable<any> {
    const requestBody = {
      idGioHang: idGioHang,
      idChiTietSanPham: idChiTietSanPham,
      soLuong: soLuong
    };

    return this.http.post<any>(this.apiGh2, requestBody);
  }

  getByGh(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiFindGh}/${id}`); 
  }
  

  
}

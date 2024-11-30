
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class GioHangService {
  private API_URL = 'http://localhost:8080/api/v1/customer';
  private api = "http://localhost:8080/api/v1/customer";
  public vnPayUrl = 'http://localhost:8080/vnpay';

  constructor(private http: HttpClient) { }
  getAllGioHang(id: string): Observable<any> {
    return this.http.get(`${this.API_URL}/get-all/${id}`);
  }
  getOneAnh(id: string): Observable<any> {
    return this.http.get(`${this.API_URL}/get-anh/${id}`);
  }
  // Thanh toán giỏ hàng
  thanhToan(request: any): Observable<any> {
    return this.http.post(
      `${this.API_URL}/thanh-toan`,
      request
    );
  }
  themSanPham(id: number, request: any): Observable<any> {
    return this.http.put(`${this.API_URL}/them-san-pham/${id}`, request);
  }
  xoaSanPham(id: number): Observable<any> {
    return this.http.get(`${this.API_URL}/xoa-san-pham/${id}`);
  }
  remove(id: number): Observable<any> {
    return this.http.get(`${this.API_URL}/remove/${id}`);
  }
  luuLocalStogate(request: any): Observable<any> {
    return this.http.post(`${this.API_URL}/luu`, request);
  }
  xuly(request: any): Observable<any> {
    return this.http.post(`${this.API_URL}/xu-ly`, request);
  }

  getvoucher(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/find-voucher`);
  }

  getdiaChi(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/getAllDiaChiKhachHang_PhanTrang_TimKiem`);
  }
  changeCheck(id:number):Observable<any>{
    return this.http.put(`${this.API_URL}/update-trang-thai/${id}`,{});
  }
  vnPay(amount: number): Observable<any> {
    return this.http.get(`${this.vnPayUrl}/createPay?amount=${amount}`);
  }
  getSoLuong(id:number):Observable<any>{
    return this.http.get(`${this.API_URL}/get-so-luong/${id}`);
  }
  getSoLuonghai(id:number):Observable<any>{
    return this.http.get(`${this.API_URL}/get-so-luong/${id}`);
  }
  getDiaChi(id:string):Observable<any>{
    return this.http.get(`${this.API_URL}/get-all-dia-chi/${id}`);
  }
}

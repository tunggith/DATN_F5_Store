import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DangNhapService {
  public baseUrl = "http://localhost:8080/api/v1/customer";
  constructor(private http: HttpClient) { }
  login(username:string,password:string):Observable<any>{
    return this.http.post(`${this.baseUrl}/login?username=${username}&password=${password}`,{});
  }
  detailKhachHang(id:string):Observable<any>{
    return this.http.get(`${this.baseUrl}/detail/${id}`);
  }
  diaChiKhachHang(id:string):Observable<any>{
    return this.http.get(`${this.baseUrl}/get-all-dia-chi/${id}`);
  }
  detailDiaChi(id:string):Observable<any>{
    return this.http.get(`${this.baseUrl}/detail-dia-chi/${id}`);
  }
  dangKy(KhachHang:any):Observable<any>{
    return this.http.post(`${this.baseUrl}/register`,KhachHang);
  }
  updateKhachHang(id: string, KhachHang: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${id}`, KhachHang);
  }
}

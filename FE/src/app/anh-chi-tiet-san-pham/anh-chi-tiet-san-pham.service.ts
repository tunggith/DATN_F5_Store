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
  getProducts(page: number, size: number,id:number): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-by-san-pham/${id}?page=${page}&size=${size}`);
  }
  create(anhNew:any):Observable<any>{
    return this.http.post(`${this.baseUrl}/create`,anhNew);
  }
  update(id:number,anhNew:any):Observable<any>{
    return this.http.put(`${this.baseUrl}/update/${id}`,anhNew);
  }
  detail(id:number):Observable<any>{
    return this.http.get(`${this.baseUrl}/detail/${id}`);
  }
 
}

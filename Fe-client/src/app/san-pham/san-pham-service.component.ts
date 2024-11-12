// customer.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SanPhamService {
  private apiUrl = 'http://localhost:8080/api/v1/customer';
  constructor(private http: HttpClient) {}

  getXuatXu(): Observable<any> {
    return this.http.get(`${this.apiUrl}/xuat-xu-getAll`);
  }

  getSize(): Observable<any> {
    return this.http.get(`${this.apiUrl}/size-getAll`);
  }

  getMauSac(): Observable<any> {
    return this.http.get(`${this.apiUrl}/mau-sac-getAll`);
  }

  getGioiTinh(): Observable<any> {
    return this.http.get(`${this.apiUrl}/gioi-tinh-getAll`);
  }

  getSanPhamPhanTrang(page: number, size: number): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    console.log('Params:', params.toString()); // Kiểm tra giá trị của params

    return this.http.get(`${this.apiUrl}/getSanPhamPhanTrang`, { params });
  }
 
  
}

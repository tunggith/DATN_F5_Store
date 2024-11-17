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

  getThuongHieu(): Observable<any> {
    return this.http.get(`${this.apiUrl}/thuong-hieu-getAll`);
  }
  
  getSanPhamPhanTrang(page: number, size: number): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    console.log('Params:', params.toString()); // Kiểm tra giá trị của params

    return this.http.get(`${this.apiUrl}/getSanPhamPhanTrang`, { params });
  }
 
  
  getSanPhamloc(gioiTinh: string, thuongHieu: string, xuatXu: string, giaMin: number, giaMax: number, mauSac: string, kichThuoc: string, page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('gioiTinh', gioiTinh)
      .set('thuongHieu', thuongHieu)
      .set('xuatXu', xuatXu)
      .set('giaMin', giaMin.toString())
      .set('giaMax', giaMax.toString())
      .set('mauSac', mauSac)
      .set('kichThuoc', kichThuoc)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get(`${this.apiUrl}/filter`, { params });
  }

  getSanPhamById(id: number): Observable<any> {
    return this.http.delete<any>(`http://localhost:8080/api/v1/customer/GetSanPhamById/${id}`); 
  }

}

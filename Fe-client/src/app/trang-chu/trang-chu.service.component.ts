import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrangChuServiceComponent {
     private api = "http://localhost:8080/api/v1/customer";
        
     constructor(private http: HttpClient) { }

  // Phương thức gọi API
  getSanPhamNew(): Observable<any[]> {
    return this.http.get<any[]>(this.api + '/new-san-pham');
  }

  getTop10MostSoldProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/top10-most-sold`);
  }

  getvoucher(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/find-voucher`);
  }
  
  findByChiTietSanPhamId(id: string, page: number = 0, size: number =6): Observable<any> {
    const url = `${this.api}/find-by-id?id=${id}&page=${page}&size=${size}`;
    return this.http.get<any>(url);
  }


  findBySanPhamId(id: number): Observable<any> {
    const url = `${this.api}/san-pham/${id}`;
    return this.http.get<any>(url);
  }


  getSize(): Observable<any> {
    return this.http.get(`${this.api}/size-getAll`);
  }

  getMauSac(): Observable<any> {
    return this.http.get(`${this.api}/mau-sac-getAll`);
  }

  getKhoangGia(idSanPham: number): Observable<any> {
    return this.http.get(`${this.api}/khoang-gia/${idSanPham}`, { responseType: 'text' });
  }

  getMau(idSanPham: number): Observable<any> {
    return this.http.get(`${this.api}/mauSac/${idSanPham}`);
  }

  getSizes(idSanPham: number): Observable<any> {
    return this.http.get(`${this.api}/sizes/${idSanPham}`);
  }


  getAnhByIdCtsp(idMauSac: number, idSize: number, idSanPham: number): Observable<any[]> {
    const params = new HttpParams()
      .set('idMauSac', idMauSac.toString())
      .set('idSize', idSize.toString())
      .set('idSanPham', idSanPham.toString());

    return this.http.get<any[]>(`${this.api}/get-anh-by-id-ctsp`, { params });
  }

  getCtsp(idMauSac: number, idSize: number, idSanPham: number): Observable<any[]> {
    const params = new HttpParams()
      .set('idMauSac', idMauSac.toString())
      .set('idSize', idSize.toString())
      .set('idSanPham', idSanPham.toString());

    return this.http.get<any[]>(`${this.api}/get-ctsp`, { params });
  }
}
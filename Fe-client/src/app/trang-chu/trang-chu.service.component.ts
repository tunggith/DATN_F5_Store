import { HttpClient } from '@angular/common/http';
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
}
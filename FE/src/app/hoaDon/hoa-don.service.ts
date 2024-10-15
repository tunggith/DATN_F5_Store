import { Injectable } from '@angular/core';
import { HttpClient,HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HoaDonService {
  private apigetAll = 'http://localhost:8080/api/v1/hoa-don/getAllHoaDon';
  private apiGetHoaDonChiTiet = 'http://localhost:8080/api/v1/hoa-don/get-chi-tiet-hoa-don';
  private apiXuatHoaDon  = 'http://localhost:8080/api/v1/pdf/download';

  constructor(private http: HttpClient) { }

  getAll(page: number, size: number): Observable<any> {
    const params = { page: page.toString(), size: size.toString() };
    return this.http.get<any>(this.apigetAll, { params });
  }

  getHoaDonChiTiet(id : number): Observable<any> {
    return this.http.get<any>(`${this.apiGetHoaDonChiTiet}/${id}`);
  }

  downloadPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.apiXuatHoaDon}?id=${id}`, { responseType: 'blob' });
  }


}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LichSuHoaDonService {

  private apiUrl = 'http://localhost:8080/api/v1/lich-su-hoa-don'; // Thay đổi URL cho phù hợp với API của bạn

  constructor(private http: HttpClient) { }

  getInvoiceHistory(page: number, size: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getAllLichSuHoaDon_PhanTrangOrTimKiem?page=${page}&size=${size}`);
  }
}

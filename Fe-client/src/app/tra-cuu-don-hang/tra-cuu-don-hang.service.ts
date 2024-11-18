import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // Service này sẽ được sử dụng toàn cục
})
export class TraCuuDonHangService {
  private apiUrl = 'http://localhost:8080/api/v1/customer/theo-doi-don-hang'; // Địa chỉ API backend từ controller của bạn

  constructor(private http: HttpClient) {}

  // Phương thức gọi API để tìm kiếm đơn hàng theo mã
  findDonHangByMa(ma: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${ma}`);
  }
}

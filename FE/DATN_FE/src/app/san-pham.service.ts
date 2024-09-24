import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SanPham } from './san-pham';

@Injectable({
  providedIn: 'root'
})
export class SanPhamService {

  public baseUrl = "http://localhost:8080/api/v1/san-pham"; // Chỉnh sửa để bỏ phần /find-by-ten-or-ma

  constructor(private http: HttpClient) { }

  // Lấy danh sách sản phẩm
  getSanPham(): Observable<SanPham[]> {
    return this.http.get<SanPham[]>(`${this.baseUrl}/find-by-ten-or-ma?page=0&size=3`);
  }

  // Tìm sản phẩm theo tên hoặc mã
  findByTenOrMa(page: number, size: number, ten?: string, ma?: string): Observable<Page<SanPham>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (ten) {
      params = params.set('ten', ten);
    }

    if (ma) {
      params = params.set('ma', ma);
    }

    // Gọi API với params đã tạo
    return this.http.get<Page<SanPham>>(`${this.baseUrl}/find-by-ten-or-ma`, { params });
  }

  addSanPham(sanPham: SanPham): Observable<SanPham>{
    return this.http.post<SanPham>(`${this.baseUrl}/create`,sanPham);
  }
}

// Model cho Page
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

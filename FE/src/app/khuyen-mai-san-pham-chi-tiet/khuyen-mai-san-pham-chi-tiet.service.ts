import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataResponse } from '../models/data-response.model';


@Injectable({
  providedIn: 'root'
})
export class KhuyenMaiSanPhamChiTietService {

  private apiUrl = 'http://localhost:8080/api/v1/khuyen-mai-ctsp/getAll';
  private apiThemKmSpct = 'http://localhost:8080/api/v1/khuyen-mai-ctsp/create';
  private apiXoaKmSpct = 'http://localhost:8080/api/v1/khuyen-mai-ctsp/delete';
  private apiUpdate = 'http://localhost:8080/api/v1/khuyen-mai-ctsp/update'; // Thêm API xóa
  private apiUrlKhuyenMai = 'http://localhost:8080/api/v1/khuyen-mai/getAll';
  private apiUrlCtsp = 'http://localhost:8080/api/v1/chi_tiet_san_pham/getall-phan_trangKm';
  private apitimKiemSp = 'http://localhost:8080/api/v1/chi_tiet_san_pham/searchsp';
  private apigetByKm = 'http://localhost:8080/api/v1/khuyen-mai-ctsp/getByKhuyenMai'; 
  

  constructor(private http: HttpClient) {}

  getAllKmCtSp(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
  getAllctsp(page: number, size: number = 5): Observable<any> {
    const params = { page: page.toString(), size: size.toString() };
    return this.http.get<any>(this.apiUrlCtsp, { params });
  }

  getAllKm(): Observable<any> {
    return this.http.get<any>(this.apiUrlKhuyenMai);
  }

  createKhuyenMaiChiTietSanPham(request: any): Observable<any> {
    return this.http.post<any>(`${this.apiThemKmSpct}`, request);
  }

  deleteKhuyenMaiChiTietSanPham(request: any): Observable<any> {
    return this.http.delete<any>(`${this.apiXoaKmSpct}`, request); // Gửi request xóa
  }
  
  updateKmctsp(id: number): Observable<DataResponse<any>> {
    return this.http.put<DataResponse<any>>(`${this.apiUpdate}/${id}`, null); // Không cần truyền body, truyền null
}

XoaKmctsp(id: number): Observable<DataResponse<any>> {
  return this.http.delete<DataResponse<any>>(`${this.apiXoaKmSpct}/${id}`); 
}

  getByKm(id: number): Observable<DataResponse<any>> {
    return this.http.get<DataResponse<any>>(`${this.apigetByKm}/${id}`); 
  }

  
  timTheoTenHoacMa(keyword : string,page: number, size: number): Observable<any> {
    const params = { page: page.toString(), size: size.toString(), keyword  };
    return this.http.get<any>(this.apitimKiemSp, { params });
  }

}

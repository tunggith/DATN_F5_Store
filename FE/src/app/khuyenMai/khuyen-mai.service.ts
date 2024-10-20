import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataResponse } from '../models/data-response.model';

@Injectable({
  providedIn: 'root'
})
export class KhuyenMaiService {
  private apiUrl = 'http://localhost:8080/api/v1/khuyen-mai/getAll'; 
  private apiUrlThem = 'http://localhost:8080/api/v1/khuyen-mai/create'; 
  private apiUrlSua = 'http://localhost:8080/api/v1/khuyen-mai/update';
  private apiCapNhapTrangThai = 'http://localhost:8080/api/v1/khuyen-mai/capNhapTrangThai';
  private apiTimTheoTenorMa = 'http://localhost:8080/api/v1/khuyen-mai/find-by-tenOrma';
  private apiTimTheoTrangThai = 'http://localhost:8080/api/v1/khuyen-mai/find-by-trangThai';
  private apiTimTheoNgay = 'http://localhost:8080/api/v1/khuyen-mai/find-by-date';
  private apiTimtheoId = 'http://localhost:8080/api/v1/khuyen-mai/finById';

  constructor(private http: HttpClient) {}
  private selectedKhuyenMai: any;


  getAll(page: number, size: number): Observable<any> {
    const params = { page: page.toString(), size: size.toString()};
    return this.http.get<any>(this.apiUrl,{ params });
  }

  create(khuyenMai: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrlThem}`, khuyenMai);
  }

  update(khuyenMai: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrlSua}/${khuyenMai.id}`, khuyenMai);
  }

  capnhap(khuyenMai: any): Observable<any> {
    return this.http.put<any>(`${this.apiCapNhapTrangThai}?id=${khuyenMai.id}`, khuyenMai);
  }

  timTheoTenHoacMa(page: number, size: number, tim: string): Observable<any> {
    const params = { page: page.toString(), size: size.toString(), tim };
    return this.http.get<any>(this.apiTimTheoTenorMa, { params });
  }

  timTheoTrangThai(page: number, size: number, trangThai: string): Observable<any> {
    const params = { page: page.toString(), size: size.toString(), trangThai };
    return this.http.get<any>(this.apiTimTheoTrangThai, { params });
  }
  
  timTheoNgay(page: number, size: number, fromDate: string | null, toDate: string | null): Observable<any> {
    let params = `?page=${page}&size=${size}`;

    if (fromDate && toDate) {
      // Nếu cả hai tham số đều có giá trị, thêm cả hai vào URL
      params += `&ngayBatDau=${fromDate}&ngayKetThuc=${toDate}`;
  } else if (fromDate && !toDate) {
      // Nếu chỉ có fromDate, thêm nó vào URL
      params += `&ngayBatDau=${fromDate}`;
  } else if (toDate && !fromDate) {
      // Nếu chỉ có toDate, thêm nó vào URL
      params += `&ngayKetThuc=${toDate}`;
  }
    return this.http.get<any>(`${this.apiTimTheoNgay}${params}`);
}


private selectedKhuyenMaiId: number | null = null;

setSelectedKhuyenMaiId(id: number) {
  this.selectedKhuyenMaiId = id;
}

getSelectedKhuyenMaiId(): number | null {
  return this.selectedKhuyenMaiId;
}


getKhuyenMaiById(id: number): Observable<DataResponse<any>> {
  return this.http.get<DataResponse<any>>(`${this.apiTimtheoId}/${id}`);
}

}

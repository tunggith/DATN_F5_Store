import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapsService {

  private apiUrl = 'http://localhost:8080/api/nhan-vien';

  constructor( private http: HttpClient) { }

  //Lay danh sach nhan vien(GET)
  getAllNhanVien(page: number, size: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getAll?page=${page}&size=${size}`);
  }

  // Tìm kiếm nhân viên theo mã hoặc tên
  searchNhanVien(page: number, pageSize: number, keyword: string): Observable<any> {
    let params = `?page=${page}&size=${pageSize}&ten=${keyword}&ma=${keyword}`;
    return this.http.get(`${this.apiUrl}/find-by-ten-or-ma${params}`);
  }

  //Them moi nhan vien(POST)
  createNhanVien(nhanVienData: any): Observable<any>{
    return this.http.post(`${this.apiUrl}/create`, nhanVienData)
        .pipe(
            catchError(this.handleError)
        );
  }

  //Hàm bắt lỗi
  private handleError(error: HttpErrorResponse) {
    if (error.status === 400) {
      // Trả về lỗi validation từ backend
      return throwError(error.error);  // Trả về object lỗi JSON
    }
    return throwError('Có lỗi xảy ra, vui lòng thử lại sau.');
  }

  //Cap nhat nhan vien(PUT)
  updateNhanVien(id: number, nhanVienData: any): Observable<any>{
    return this.http.put(`${this.apiUrl}/update/${id}`, nhanVienData);
  }

  //Xoa nhan vien
  deleteNhanVien(id: number): Observable<any>{
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

}

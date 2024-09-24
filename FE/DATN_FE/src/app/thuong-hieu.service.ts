import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ThuongHieu } from './thuong-hieu';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThuongHieuService {
  public baseUrl = "http://localhost:8080/api/v1/thuong-hieu";

  constructor(private http: HttpClient) { }
  //lấy danh sách thương hiệu
  getThuongHieu(): Observable<ThuongHieu[]>{
    return this.http.get<ThuongHieu[]>(`${this.baseUrl}/getAll`);
  }
}

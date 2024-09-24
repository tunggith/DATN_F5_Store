import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { XuatXu } from './xuat-xu';

@Injectable({
  providedIn: 'root'
})
export class XuatXuService {
  public baseUrl = "http://localhost:8080/api/v1/xuat-xu";

  constructor(private http: HttpClient) { }
  // lấy danh sách sản phẩm
  getXuatXu(): Observable<XuatXu[]>{
    return this.http.get<XuatXu[]>(`${this.baseUrl}/getAll`);
  }
}

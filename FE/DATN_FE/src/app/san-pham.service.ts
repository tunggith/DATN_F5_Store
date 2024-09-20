import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SanPham } from './san-pham';

@Injectable({
  providedIn: 'root'
})
export class SanPhamService {

  public baseUrl = "http://localhost:8080/api/v1/san-pham/getAll?page=0&size=3";
  constructor(private http:HttpClient) { }
  getSanPham(): Observable<SanPham[]>{
    return this.http.get<SanPham[]>(`${this.baseUrl}`);
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GiaoHangNhanhService {
  private apiUrl = 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2';
  private token = '337cc41f-844d-11ef-8e53-0a00184fe694';
  constructor(private http:HttpClient) { }
  createShippingOder(orderData: any):Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': this.token
    });
    return this.http.post(`${this.apiUrl}/shipping-order/fee`,orderData,{headers})
  }
}
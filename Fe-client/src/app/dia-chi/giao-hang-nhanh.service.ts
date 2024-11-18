import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GiaoHangNhanhService {
  private apiUrl = 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2';
  private addressUrl = 'https://dev-online-gateway.ghn.vn/shiip/public-api';
  private token = '337cc41f-844d-11ef-8e53-0a00184fe694';
  constructor(private http: HttpClient) { }
  createShippingOder(orderData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': this.token
    });
    return this.http.post(`${this.apiUrl}/shipping-order/fee`, orderData, { headers })
  }
  // Lấy danh sách tỉnh/thành phố
  getProvinces() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Token': this.token
    });
    return this.http.get(`${this.addressUrl}/master-data/province`, { headers });
  }

  // Lấy danh sách quận/huyện theo mã tỉnh
  getDistricts(provinceId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Token': this.token
    });

    // Ép kiểu provinceId thành số nguyên nếu cần
    const body = { "province_id": Number(provinceId) };

    return this.http.post(`${this.addressUrl}/master-data/district`, body, { headers });
  }

  // Lấy danh sách phường/xã theo mã quận
  getWards(districtId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Token': this.token
    });

    // Ép kiểu districtId thành số nguyên nếu cần
    const body = { "district_id": Number(districtId) };

    return this.http.post(`${this.addressUrl}/master-data/ward`, body, { headers });
  }

  // Hàm tìm ID tỉnh theo tên tỉnh
  getProvinceIdByName(provinceName: string): Observable<number | null> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Token': this.token
    });
  
    return this.http.get<any>(`${this.addressUrl}/master-data/province`, { headers })
      .pipe(
        map(response => {
          console.log('API Response:', response);  // In ra toàn bộ response để kiểm tra
  
          // Kiểm tra nếu response và response.data tồn tại
          if (response && response.data) {
            console.log('All provinces:', response.data);  // In ra toàn bộ danh sách các tỉnh
  
            // Tìm kiếm trong danh sách các tỉnh
            const province = response.data.find((p: any) => {
              console.log('Comparing:', p, 'with', provinceName);  // In ra từng phần tử trong mảng data để kiểm tra
              return p.province_name && p.province_name.toLowerCase() === provinceName.toLowerCase();
            });
  
            if (province) {
              console.log('Found Province:', province);  // In ra tỉnh nếu tìm thấy
              return province.province_id;  // Trả về ID tỉnh
            } else {
              console.log('Không tìm thấy tỉnh thành');
              return null;  // Trả về null nếu không tìm thấy tỉnh
            }
          } else {
            console.error('No provinces data found in the response');
            return null;  // Trả về null nếu không có data
          }
        })
      );
  }
  
  
  
  
}

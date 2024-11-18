import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DangNhapService {
  public baseUrl = "http://localhost:8080/api/v1/customer";
  constructor(private http: HttpClient) { }
  login(username:string,password:string):Observable<any>{
    return this.http.post(`${this.baseUrl}/login?username=${username}&password=${password}`,{});
  }
  detailKhachHang(id:string):Observable<any>{
    return this.http.get(`${this.baseUrl}/detail/${id}`);
  }
  diaChiKhachHang(id:string):Observable<any>{
    return this.http.get(`${this.baseUrl}/get-all-dia-chi/${id}`);
  }
  detailDiaChi(id:string):Observable<any>{
    return this.http.get(`${this.baseUrl}/detail-dia-chi/${id}`);
  }
  dangKy(KhachHang:any):Observable<any>{
    return this.http.post(`${this.baseUrl}/register`,KhachHang);
  }
  updateKhachHang(id: string, KhachHang: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${id}`, KhachHang);
  }


  updateDiaChi(id: number, diaChiData: any): Observable<any> {
    const url = `http://localhost:8080/api/v1/customer/update-dia-chi/${id}`;
    return this.http.put(url, diaChiData, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
//  api địa chỉ 
  private baseUrlDiaChi = 'http://localhost:8080/api/v1/dia-chi-khach-hang'; // Địa chỉ API của bạn

  // Lấy danh sách địa chỉ khách hàng với phân trang
  getAllAddresses(id:number,page:number,size:number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrlDiaChi}/get-by-khach-hang/${id}?page=${page}&size=${size}`);
  }
  addDiaChiKhachHang(customerAddress: any): Observable<any> {
    return this.http.post(`${this.baseUrlDiaChi}/addDiaChiKhachHang`, customerAddress);
  }
  updateDiaChiKhachHang(id: number, customerAddress: any): Observable<any> {
    return this.http.put(`${this.baseUrlDiaChi}/updateDiaChiKhachHang/${id}`, customerAddress);
  }
  chiTietDiaChi(id:number):Observable<any>{
    return this.http.get(`${this.baseUrlDiaChi}/chi-tiet-dia-chi/${id}`);
  }
  // api giao hàng 
  private apiUrl = 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2';
  private addressUrl = 'https://dev-online-gateway.ghn.vn/shiip/public-api';
  private token = '337cc41f-844d-11ef-8e53-0a00184fe694';

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

  addDiaChi(params: {
    idKhachHang: number;
    soNha: string;
    sdt: string;
    duong: string;
    phuongXa: string;
    quanHuyen: string;
    tinhThanh: string;
    quocGia: string;
    loaiDiaChi: string;
    trangThai: string;
  }): Observable<any> {
    const queryParams = new HttpParams()
      .set('idKhachHang', params.idKhachHang)
      .set('soNha', params.soNha)
      .set('sdt', params.sdt)
      .set('duong', params.duong)
      .set('phuongXa', params.phuongXa)
      .set('quanHuyen', params.quanHuyen)
      .set('tinhThanh', params.tinhThanh)
      .set('quocGia', params.quocGia)
      .set('loaiDiaChi', params.loaiDiaChi)
      .set('trangThai', params.trangThai);

    return this.http.post(`${this.baseUrl}/add-dia-chi`, null, { params: queryParams });
  }


 
}

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BanHangService {
  
  public url = 'http://localhost:8080/api/v1/chi_tiet_san_pham';
  public hoaDonUrl = 'http://localhost:8080/api/v1/hoa-don';
  public voucherUrl = 'http://localhost:8080/api/v1/voucher';
  public thanhToanUrl = 'http://localhost:8080/api/v1/phuong-thuc-thanh-toan';
  public khachHangUrl = 'http://localhost:8080/api/v1/khach-hang';
  private exportHoaDonUrl = 'http://localhost:8080/api/v1/pdf/download';
  private lichSuHoaDonUrl = 'http://localhost:8080/api/v1/lich-su-hoa-don';
  private thuocTinhUrl = 'http://localhost:8080/api/v1';
  public nhanVienUrl = 'http://localhost:8080/api/nhan-vien/find-by-username';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Phương thức gọi API lấy danh sách sản phẩm
  getSanPham(pageSize: number, pageNumber: number, keyword?: string, sizeId?: string, mauSacId?: string, thuongHieuId?: string, xuatXuId?: string, gioiTinhId?: string): Observable<any> {
    let params = new HttpParams()
        .set('size', pageSize.toString())
        .set('page', pageNumber.toString());

    if (keyword) {
        params = params.set('keyword', keyword);
    }
    if (mauSacId) {
        params = params.set('mauSac', mauSacId);
    }
    if (sizeId) {
        params = params.set('sizeSpct', sizeId);
    }
    if (thuongHieuId) {
        params = params.set('thuongHieu', thuongHieuId);
    }
    if (xuatXuId) {
        params = params.set('xuatXu', xuatXuId);
    }
    if (gioiTinhId) {
        params = params.set('gioiTinh', gioiTinhId);
    }

    return this.http.get(`${this.url}/get-by-trang-thai`, { params});
  }
  // Ví dụ gọi các API khác với token
  getHoaDon(): Observable<any> {
    return this.http.get(`${this.hoaDonUrl}/getAll`);
  }
  getChiTietHoaDon(id: number): Observable<any> {
    return this.http.get(`${this.hoaDonUrl}/get-chi-tiet-hoa-don/${id}`);
  }
  getVoucher(): Observable<any> {
    return this.http.get(`${this.voucherUrl}/get-trang-thai`);
  }
  getPhuongThucThanhToan(): Observable<any> {
    return this.http.get(`${this.thanhToanUrl}/getAll`);
  }
  createHoaDon(hoaDonData: any): Observable<any> {
    return this.http.post(`${this.hoaDonUrl}/create`, hoaDonData);
  }
  removeHoaDon(idHoaDon: number): Observable<any> {
    return this.http.put(`${this.hoaDonUrl}/huy-hoa-don/${idHoaDon}`, {});
  }
  selectProduct(idSanPham: number, sanPhamData: any): Observable<any> {
    return this.http.post(`${this.hoaDonUrl}/chon-san-pham/${idSanPham}`, sanPhamData);
  }
  removeHoaDonChiTiet(idHoaDonChiTiet: number): Observable<any> {
    return this.http.delete(`${this.hoaDonUrl}/delete-hoa-don-chi-tiet/${idHoaDonChiTiet}`);
  }
  removeSoLuongHoaDonChiTiet(idHoaDonChiTiet: number): Observable<any> {
    return this.http.put(`${this.hoaDonUrl}/delete-single-san-pham/${idHoaDonChiTiet}`, {});
  }
  thanhToanHoaDOn(idHoaDon: number, hoaDonData: any): Observable<any> {
    return this.http.put(`${this.hoaDonUrl}/thanh-toan/${idHoaDon}`, hoaDonData);
  }
  getKhachHang(search?: String): Observable<any> {
    return this.http.get(`${this.khachHangUrl}/get-all-khach-hang?ten=${search}`);
  }
  addKhachHang(customer: any): Observable<any> {
    return this.http.post(`${this.khachHangUrl}/create`, customer);
  }
  updateKhachHang(idHoaDon: number, idKhachHang: number): Observable<any> {
    return this.http.put(`${this.hoaDonUrl}/update-khach-hang/${idHoaDon}?idKhachHang=${idKhachHang}`, {});
  }
  getByTrangThai(page: number, size: number, keywork: string): Observable<any> {
    return this.http.get(`${this.hoaDonUrl}/find-by-trang-thai?page=${page}&size=${size}&keyWord=${keywork}`);
  }
  getDetailHoaDonCho(id: number): Observable<any> {
    return this.http.get(`${this.hoaDonUrl}/detail-hoa-don-cho/${id}`);
  }
  updateTrangThaiHoaDon(id: number): Observable<any> {
    return this.http.put(`${this.hoaDonUrl}/update-trang-thai-don-hang/${id}`, {});
  }

  downloadPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.exportHoaDonUrl}?id=${id}`, { responseType: 'blob' });
  }
  getLichSuHoaDon(id: number): Observable<any> {
    return this.http.get(`${this.lichSuHoaDonUrl}/get-by-hoa-don/${id}`);
  }
  updateDiaChiNhanHang(id: number, hoaDon: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.hoaDonUrl}/update-dia-chi-nhan-hang/${id}`, hoaDon, { headers });
  }
  getSize():Observable<any>{
    return this.http.get(`${this.thuocTinhUrl}/size/getAll`);
  }
  getMauSac():Observable<any>{
    return this.http.get(`${this.thuocTinhUrl}/mau-sac/getAll`);
  }
  getThuongHieu():Observable<any>{
    return this.http.get(`${this.thuocTinhUrl}/thuong-hieu/getAll`);
  }
  getXuatXu():Observable<any>{
    return this.http.get(`${this.thuocTinhUrl}/xuat-xu/getAll`);
  }
  getGioiTinh():Observable<any>{
    return this.http.get(`${this.thuocTinhUrl}/gioi-tinh/getAll`);
  }
  getNhanVien(username:string):Observable<any>{
    return this.http.get(`${this.nhanVienUrl}/${username}`);
  }
}

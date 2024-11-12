import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { BanHangComponent } from '../../ban-hang/./ban-hang.component';
import { SanphamComponent } from '../../sanpham/sanpham.component'; // Đường dẫn tới component sản phẩm
import { IconsComponent } from '../../khuyenMai/icons.component';
import { VoucherComponent } from '../../voucher/voucher.component';
import { NhanVienComponent } from '../../nhan-vien/nhan-vien.component';
import { DiaChiKhachHangComponent } from '../../dia-chi-khach-hang/dia-chi-khach-hang.component';
import { KhachHangComponent } from '../../khach-hang/KhachHang.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { KhuyenMaiChiTietSanPhamComponent } from '../../khuyen-mai-san-pham-chi-tiet/khuyen-mai-san-pham-chi-tiet.component';
import { ThongkeComponent } from 'app/thongke/thongke.component';
import { SecurityComponent } from 'app/layouts/security/security.component';
import { authGuard } from 'app/auth.guard';
import { LoiQuyenComponent } from 'app/loi-quyen/loi-quyen.component';
import { PopupSanPhamComponent } from 'app/popup-san-pham/popup-san-pham.component';

export const AdminLayoutRoutes: Routes = [
  { path: 'ban-hang', component: BanHangComponent, canActivate: [authGuard], data: { expectedRole: ['admin', 'user'] } },
  { path: 'san-pham', component: SanphamComponent, canActivate: [authGuard], data: { expectedRole: ['admin', 'user'] } },
  { path: 'thong-ke', component: ThongkeComponent, canActivate: [authGuard], data: { expectedRole: ['admin', 'user'] } },
  { path: 'khuyen-mai', component: IconsComponent, canActivate: [authGuard], data: { expectedRole: ['admin', 'user'] } },
  { path: 'nhan-vien', component: NhanVienComponent, canActivate: [authGuard], data: { expectedRole: ['admin'] } },
  { path: 'khach-hang', component: KhachHangComponent, canActivate: [authGuard], data: { expectedRole: ['admin'] } },
  { path: 'upgrade', component: UpgradeComponent, canActivate: [authGuard], data: { expectedRole: ['admin'] } },
  { path: 'voucher', component: VoucherComponent, canActivate: [authGuard], data: { expectedRole: ['admin', 'user'] } },
  { path: 'khuyen-mai-chi-tiet-san-pham/:id', component: KhuyenMaiChiTietSanPhamComponent, canActivate: [authGuard], data: { expectedRole: ['admin'] } },
  { path: 'dia-chi-khach-hang', component: DiaChiKhachHangComponent, canActivate: [authGuard], data: { expectedRole: ['admin'] } },
  { path: 'khong-co-quyen-truy-cap', component: LoiQuyenComponent },
  { path: 'popup-san-pham', component: PopupSanPhamComponent }
];

@NgModule({
  imports: [
    // Các module cần thiết khác
  ],
  declarations: [],
})
export class AdminLayoutRoutingModule { }

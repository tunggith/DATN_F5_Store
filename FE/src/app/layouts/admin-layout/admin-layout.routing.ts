import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { BanHangComponent } from '../../ban-hang/./ban-hang.component';
import { SanphamComponent } from '../../sanpham/sanpham.component'; // Đường dẫn tới component sản phẩm
import { IconsComponent } from '../../khuyenMai/icons.component';
import { VoucherComponent } from '../../voucher/voucher.component';
import { MapsComponent } from '../../maps/maps.component';
import { DiaChiKhachHangComponent } from '../../dia-chi-khach-hang/dia-chi-khach-hang.component'; 
import { KhachHangComponent } from '../../khach-hang/KhachHang.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { KhuyenMaiChiTietSanPhamComponent } from '../../khuyen-mai-san-pham-chi-tiet/khuyen-mai-san-pham-chi-tiet.component';
import { TableListComponent } from 'app/hoaDon/table-list.component';
import { AnhChiTietSanPhamComponent } from 'app/anh-chi-tiet-san-pham/anh-chi-tiet-san-pham.component';
import { ThongkeComponent } from 'app/thongke/thongke.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'ban-hang',      component: BanHangComponent },
    { path: 'sanpham', component: SanphamComponent }, // Định tuyến cho sản phẩm
    { path: 'thong-ke',     component: ThongkeComponent },
    { path: 'khuyenMai',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'khach-hang',  component: KhachHangComponent },
    { path: 'upgrade',        component: UpgradeComponent },
    { path: 'voucher',        component: VoucherComponent },
    { path: 'khuyen-mai-chi-tiet-san-pham/:id', component: KhuyenMaiChiTietSanPhamComponent },
    { path: 'dia-chi-khach-hang',        component: DiaChiKhachHangComponent },
    { path: 'anh-chi-tiet-san-pham',        component: AnhChiTietSanPhamComponent },
];

@NgModule({
  imports: [
    // Các module cần thiết khác
  ],
  declarations: [],
})
export class AdminLayoutRoutingModule {}
import { NgModule } from '@angular/core';
import { LichSuHoaDonComponent } from './../../lich-su-hoa-don/lich-su-hoa-don.component';
import { Routes } from '@angular/router';
import { BanHangComponent } from '../../ban-hang/./ban-hang.component';
import { SanphamComponent } from '../../sanpham/sanpham.component'; // Đường dẫn tới component sản phẩm
import { ThongkeComponent } from '../../thongke/thongke.component';
import { IconsComponent } from '../../khuyenMai/icons.component';
import { VoucherComponent } from '../../voucher/voucher.component';
import { MapsComponent } from '../../maps/maps.component';
import { DiaChiKhachHangComponent } from '../../dia-chi-khach-hang/dia-chi-khach-hang.component'; 
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { KhuyenMaiChiTietSanPhamComponent } from '../../khuyen-mai-san-pham-chi-tiet/khuyen-mai-san-pham-chi-tiet.component';
import { TableListComponent } from 'app/hoaDon/table-list.component';
import { AnhChiTietSanPhamComponent } from 'app/anh-chi-tiet-san-pham/anh-chi-tiet-san-pham.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'ban-hang',      component: BanHangComponent },
    { path: 'sanpham', component: SanphamComponent }, // Định tuyến cho sản phẩm
    { path: 'hoaDon',     component: TableListComponent },
    { path: 'thongke',     component: ThongkeComponent },
    { path: 'khuyenMai',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'notifications',  component: NotificationsComponent },
    { path: 'upgrade',        component: UpgradeComponent },
    { path: 'voucher',        component: VoucherComponent },
    { path: 'khuyen-mai-chi-tiet-san-pham/:id', component: KhuyenMaiChiTietSanPhamComponent },
    { path: 'dia-chi-khach-hang',        component: DiaChiKhachHangComponent },
    { path: 'lich-su-hoa-don',        component: LichSuHoaDonComponent },
    { path: 'anh-chi-tiet-san-pham',        component: AnhChiTietSanPhamComponent },
];

@NgModule({
  imports: [
    // Các module cần thiết khác
  ],
  declarations: [],
})
export class AdminLayoutRoutingModule {}

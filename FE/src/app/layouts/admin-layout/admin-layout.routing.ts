import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';

import { BanHangComponent } from '../../ban-hang/./ban-hang.component';
import { SanphamComponent } from '../../sanpham/sanpham.component'; // Đường dẫn tới component sản phẩm
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../khuyenMai/icons.component';
import { VoucherComponent } from '../../voucher/voucher.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { KhuyenMaiChiTietSanPhamComponent } from '../../khuyen-mai-san-pham-chi-tiet/khuyen-mai-san-pham-chi-tiet.component';
import { TableListComponent } from 'app/hoaDon/table-list.component';

export const AdminLayoutRoutes: Routes = [
    // {
    //   path: '',
    //   children: [ {
    //     path: 'dashboard',
    //     component: BanHangComponent
    // }]}, {
    // path: '',
    // children: [ {
    //   path: 'userprofile',
    //   component: UserProfileComponent
    // }]
    // }, {
    //   path: '',
    //   children: [ {
    //     path: 'icons',
    //     component: IconsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'notifications',
    //         component: NotificationsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'maps',
    //         component: MapsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'typography',
    //         component: TypographyComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'upgrade',
    //         component: UpgradeComponent
    //     }]
    // }
    { path: 'ban-hang',      component: BanHangComponent },
    { path: 'sanpham', component: SanphamComponent }, // Định tuyến cho sản phẩm
    { path: 'hoaDon',     component: TableListComponent },
    { path: 'typography',     component: TypographyComponent },
    { path: 'khuyenMai',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'notifications',  component: NotificationsComponent },
    { path: 'upgrade',        component: UpgradeComponent },
    { path: 'voucher',        component: VoucherComponent },
    { path: 'khuyen-mai-chi-tiet-san-pham/:id', component: KhuyenMaiChiTietSanPhamComponent },
];

@NgModule({
  imports: [
    // Các module cần thiết khác
  ],
  declarations: [],
})
export class AdminLayoutRoutingModule {}

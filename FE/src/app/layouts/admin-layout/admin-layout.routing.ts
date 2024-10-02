import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { SanphamComponent } from '../../sanpham/sanpham.component'; // Đường dẫn tới component sản phẩm
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';

export const AdminLayoutRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'sanpham', component: SanphamComponent }, // Định tuyến cho sản phẩm
  { path: 'table-list', component: TableListComponent },
  { path: 'typography', component: TypographyComponent },
  { path: 'icons', component: IconsComponent },
  { path: 'maps', component: MapsComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'upgrade', component: UpgradeComponent },
  // Thêm các định tuyến khác nếu cần
];

@NgModule({
  imports: [
    // Các module cần thiết khác
  ],
  declarations: [],
})
export class AdminLayoutRoutingModule {}

import { AnhChiTietSanPhamComponent } from './../../anh-chi-tiet-san-pham/anh-chi-tiet-san-pham.component';
import { LichSuHoaDonComponent } from './../../lich-su-hoa-don/lich-su-hoa-don.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { BanHangComponent } from '../../ban-hang/./ban-hang.component';
import { SanphamComponent } from '../../sanpham/sanpham.component'; // Đường dẫn tới file mới
import { TableListComponent } from '../../hoaDon/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../khuyenMai/icons.component';
import { VoucherComponent } from '../../voucher/voucher.component';
import { KhuyenMaiChiTietSanPhamComponent } from '../../khuyen-mai-san-pham-chi-tiet/khuyen-mai-san-pham-chi-tiet.component';
import { MapsComponent } from '../../maps/maps.component';
import { DiaChiKhachHangComponent } from '../../dia-chi-khach-hang/dia-chi-khach-hang.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { CustomerPopupComponent } from 'app/customer-popup/customer-popup.component';
import { TimelineModule } from 'primeng/timeline';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    TimelineModule,
  ],
  declarations: [
    BanHangComponent,
    SanphamComponent,  // Đổi UserProfileComponent thành SanphamComponent
    TableListComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    UpgradeComponent,
    CustomerPopupComponent,
    VoucherComponent,
    KhuyenMaiChiTietSanPhamComponent,
    DiaChiKhachHangComponent,
    LichSuHoaDonComponent,
    AnhChiTietSanPhamComponent,
  ]
})

export class AdminLayoutModule {}

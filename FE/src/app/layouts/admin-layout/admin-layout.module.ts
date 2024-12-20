import { AnhChiTietSanPhamComponent } from './../../anh-chi-tiet-san-pham/anh-chi-tiet-san-pham.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { BanHangComponent } from '../../ban-hang/./ban-hang.component';
import { SanphamComponent } from '../../sanpham/sanpham.component'; // Đường dẫn tới file mới
import { TableListComponent } from '../../hoaDon/table-list.component';
import { IconsComponent } from '../../khuyenMai/icons.component';
import { VoucherComponent } from '../../voucher/voucher.component';
import { KhuyenMaiChiTietSanPhamComponent } from '../../khuyen-mai-san-pham-chi-tiet/khuyen-mai-san-pham-chi-tiet.component';
import { NhanVienComponent } from '../../nhan-vien/nhan-vien.component';
import { DiaChiKhachHangComponent } from '../../dia-chi-khach-hang/dia-chi-khach-hang.component';
import { KhachHangComponent } from '../../khach-hang/KhachHang.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { CustomerPopupComponent } from 'app/customer-popup/customer-popup.component';
import { TimelineModule } from 'primeng/timeline';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { AutoCompleteModule } from 'primeng/autocomplete';
import { HistoryPopupComponent } from 'app/history-popup/history-popup.component';
import { ThongkeComponent } from 'app/thongke/thongke.component';
import { NgChartsModule } from 'ng2-charts';
import { NotificationsComponent } from 'app/notifications/notifications.component';
import { LoiQuyenComponent } from 'app/loi-quyen/loi-quyen.component';
import { HoaDonChoComponent } from 'app/hoa-don-cho/hoa-don-cho.component';
import { PopupSanPhamComponent } from 'app/popup-san-pham/popup-san-pham.component';
import { ThongTinDonHangComponent } from 'app/thong-tin-don-hang/thong-tin-don-hang.component';
import { PopupQrComponent } from 'app/popup-qr/popup-qr.component';
import { QrScannerComponent } from 'app/qr-scanner/qr-scanner.component';


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
    MatAutocompleteModule,
    TimelineModule,
    AutoCompleteModule,
    NgChartsModule,
  ],
  declarations: [
    BanHangComponent,
    SanphamComponent,  
    TableListComponent,
    ThongkeComponent,
    IconsComponent,
    NhanVienComponent,
    KhachHangComponent,
    UpgradeComponent,
    CustomerPopupComponent,
    VoucherComponent,
    KhuyenMaiChiTietSanPhamComponent,
    DiaChiKhachHangComponent,
    AnhChiTietSanPhamComponent,
    HistoryPopupComponent,
    NotificationsComponent,
    LoiQuyenComponent,
    HoaDonChoComponent,
    PopupSanPhamComponent,
    ThongTinDonHangComponent,
    PopupQrComponent,
    QrScannerComponent,
  ],
})

export class AdminLayoutModule {}

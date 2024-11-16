import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLayoutRoutes, AdminLayoutRouting } from './admin-layout.routing';
import { TrangChuComponent } from 'src/app/trang-chu/trang-chu.component';
import { RouterModule } from '@angular/router';
import { SanPhamComponent } from 'src/app/san-pham/san-pham.component';
import { VeChungToiComponent } from 'src/app/ve-chung-toi/ve-chung-toi.component';
import { LienHeComponent } from 'src/app/lien-he/lien-he.component';
import { GioHangComponent } from 'src/app/gio-hang/gio-hang.component';
import { TaiKhoanComponent } from 'src/app/tai-khoan/tai-khoan.component';
import { FormsModule } from '@angular/forms';
import { TraCuuDonHangComponent } from 'src/app/tra-cuu-don-hang/tra-cuu-don-hang.component';



@NgModule({
  declarations: [
    TrangChuComponent,
    SanPhamComponent,
    VeChungToiComponent,
    LienHeComponent,
    GioHangComponent,
    TaiKhoanComponent,
    TraCuuDonHangComponent,
  ],
  imports: [
    CommonModule,
    AdminLayoutRouting,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
  ]
})
export class AdminLayoutModule { }

import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { LienHeComponent } from 'src/app/lien-he/lien-he.component';
import { SanPhamComponent } from 'src/app/san-pham/san-pham.component';
import { TaiKhoanComponent } from 'src/app/tai-khoan/tai-khoan.component';
import { TraCuuDonHangComponent } from 'src/app/tra-cuu-don-hang/tra-cuu-don-hang.component';
import { TrangChuComponent } from 'src/app/trang-chu/trang-chu.component';
import { VeChungToiComponent } from 'src/app/ve-chung-toi/ve-chung-toi.component';

export const AdminLayoutRoutes: Routes = [
  { path: 'trang-chu', component: TrangChuComponent },
  { path: 'san-pham', component: SanPhamComponent },
  { path: 've-chung-toi', component: VeChungToiComponent },
  { path: 'lien-he', component: LienHeComponent },
  { path: 'tai-khoan', component: TaiKhoanComponent },
  { path: 'tra-cuu-don-hang', component: TraCuuDonHangComponent },
];

@NgModule({
  imports: [

  ],
  exports: []
})
export class AdminLayoutRouting { }

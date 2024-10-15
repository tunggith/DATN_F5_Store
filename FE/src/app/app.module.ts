import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { CustomerService } from './notifications/notifications.service';
import { DiaChiKhachHangComponent } from './dia-chi-khach-hang/dia-chi-khach-hang.component';
import { AnhChiTietSanPhamComponent } from './anh-chi-tiet-san-pham/anh-chi-tiet-san-pham.component';
import { LichSuHoaDonComponent } from './lich-su-hoa-don/lich-su-hoa-don.component';


@NgModule({
  imports: [
    BrowserAnimationsModule, 
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    // Do NOT declare SanphamComponent here if it's already declared in AdminLayoutModule
  ],
  providers: [CustomerService],
  bootstrap: [AppComponent]
})
export class AppModule { }

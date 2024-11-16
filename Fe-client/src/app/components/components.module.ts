import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { DangNhapComponent } from '../dang-nhap/dang-nhap.component';
import { DangKyComponent } from '../dang-ky/dang-ky.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    DangNhapComponent,
    DangKyComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports:[
    FooterComponent,
    NavbarComponent,
    SidebarComponent
  ],
  providers: [
    DatePipe // Thêm DatePipe vào đây
  ],
})
export class ComponentsModule { }

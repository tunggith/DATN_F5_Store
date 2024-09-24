import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { SanPhamComponent } from './san-pham/san-pham.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FormsModule } from '@angular/forms';
import { XuatXuComponent } from './xuat-xu/xuat-xu.component';
import { ThuongHieuComponent } from './thuong-hieu/thuong-hieu.component';
import { ChatLieuComponent } from './chat-lieu/chat-lieu.component';

@NgModule({
  declarations: [
    AppComponent,
    SanPhamComponent,
    NavBarComponent,
    XuatXuComponent,
    ThuongHieuComponent,
    ChatLieuComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent,NavBarComponent]
})
export class AppModule { }

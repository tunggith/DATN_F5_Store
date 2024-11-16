import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { ComponentsModule } from "./components/components.module";
import { HttpClientModule } from '@angular/common/http';
import { TraCuuDonHangComponent } from './tra-cuu-don-hang/tra-cuu-don-hang.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ComponentsModule,
    HttpClientModule,
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

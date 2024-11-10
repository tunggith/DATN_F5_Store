import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

const routes: Routes = [
  {
    path:'',
    redirectTo:'trang-chu',
    pathMatch:'full'
  },
  {
    path:'',
    component: AdminLayoutComponent,
    children:[{
      path:'',
      loadChildren:()=> import('./layouts/admin-layout/admin-layout.module').then(m=> m.AdminLayoutModule)
    }]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    CommonModule,
    BrowserModule,

  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

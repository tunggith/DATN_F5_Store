import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurityComponent } from './security.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChangePasswordComponent } from '../change-password/change-password.component';

const routes: Routes = [
  {
    path: '',
    component: SecurityComponent,
  },
];

@NgModule({
  declarations: [
    SecurityComponent,
    ChangePasswordComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule
  ]
})
export class SecurityModule {}

import { Component, OnInit } from '@angular/core';

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: '/ban-hang', title: 'Bán Hàng', icon: 'shopping_cart', class: '' },
  { path: '/san-pham', title: 'Sản phẩm', icon: 'inventory_2', class: '' },
  { path: '/thong-ke', title: 'Thống kê', icon: 'query_stats', class: '' },
  { path: '/khuyen-mai', title: 'Khuyến mãi', icon: 'confirmation_number', class: '' },
  { path: '/nhan-vien', title: 'Nhân viên', icon: 'person', class: '' },
  { path: '/voucher', title: 'Voucher', icon: 'confirmation_number', class: '' },
  { path: '/khach-hang', title: 'Khách hàng', icon: 'groups', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };
}

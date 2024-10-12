import { Component, OnInit } from '@angular/core';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/ban-hang', title: 'Bán Hàng',  icon: 'shopping_cart', class: '' },
    { path: '/sanpham', title: 'Sản phẩm',  icon:'inventory_2', class: '' },
    { path: '/hoaDon', title: 'Hóa đơn',  icon:'content_paste', class: '' },
    { path: '/thongke', title: 'Thống kê',  icon:'query_stats', class: '' },
    { path: '/khuyenMai', title: 'Khuyến mãi',  icon:'confirmation_number', class: '' },
    { path: '/maps', title: 'Nhân viên',  icon:'person', class: '' },
    { path: '/voucher', title: 'Voucher',  icon:'confirmation_number', class: '' },
    { path: '/notifications', title: 'Khách hàng',  icon:'groups', class: '' },
    { path: '/dia-chi-khach-hang', title: 'Địa chỉ khách hàng',  icon:'local_library', class: '' },   
    { path: '/anh-chi-tiet-san-pham', title: 'Ảnh chi tiết sản phẩm',  icon:'image', class: '' },   
    { path: '/lich-su-hoa-don', title: 'Lịch sử hóa đơn',  icon:'history', class: '' },   
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

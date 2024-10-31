import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token'); // Lấy token từ localStorage
  const role = localStorage.getItem('role'); // Lấy role từ localStorage
  const expectedRoles = route.data.expectedRole; // Lấy expectedRole từ route

  if (token) {
    // Kiểm tra xem role có trong expectedRoles hay không
    if (expectedRoles && !expectedRoles.includes(role)) {
      // Nếu role không phù hợp, chuyển hướng về trang login
      router.navigate(['/khong-co-quyen-truy-cap']);
      return false;
    }
    return true; // Cho phép truy cập nếu có token và role hợp lệ
  } else {
    router.navigate(['/login']); // Chuyển hướng về trang login nếu không có token
    return false;
  }
};

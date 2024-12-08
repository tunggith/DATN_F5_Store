import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { LoadingService } from './loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private loadingService: LoadingService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Request started');
    this.loadingService.show(); // hiển thị loading
  
    return next.handle(request).pipe(
      finalize(() => {
        console.log('Request completed');
        this.loadingService.hide(); // Tắt loading khi API hoàn tất
      })
    );
  }
  
}

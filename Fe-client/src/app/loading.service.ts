import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  constructor() { }
  
  private loadingSubject  = new BehaviorSubject<Boolean>(false);
  loading$ = this.loadingSubject.asObservable();
  show(){
    this.loadingSubject.next(true);
  }
  hide(){
    this.loadingSubject.next(false);
  }
}

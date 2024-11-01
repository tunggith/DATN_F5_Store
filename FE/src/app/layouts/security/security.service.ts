import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  public baseUrl = 'http://localhost:8080/api/v1/auth';
  constructor(private http: HttpClient) {}
  login(username: string,password:string):Observable<any>{
    return this.http.post(`${this.baseUrl}/login?username=${username}&password=${password}`,{});
  }
  changePassword(username:string,passwordOld:string,passwordNew:string){
    return this.http.post(`${this.baseUrl}/reset-password?username=${username}&passwordOld=${passwordOld}&passwordNew=${passwordNew}`,{});
  }
}

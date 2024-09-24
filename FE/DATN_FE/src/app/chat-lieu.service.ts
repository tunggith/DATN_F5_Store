import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatLieu } from './chat-lieu';

@Injectable({
  providedIn: 'root'
})
export class ChatLieuService {
  public baseUrl = "http://localhost:8080/api/v1/chat-lieu";

  constructor(private http: HttpClient) { }
  //lấy danh sách chất liệu
  getChatLieu(): Observable<ChatLieu[]>{
    return this.http.get<ChatLieu[]>(`${this.baseUrl}/getAll`);
  }
}

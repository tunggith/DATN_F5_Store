import { Component, OnInit } from '@angular/core';
import { SecurityService } from './security.service';
import { AuthService } from 'app/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent implements OnInit{
  constructor(
    private securityService: SecurityService,
    private authService: AuthService,
    private router: Router
  ){}
  ngOnInit(): void {
  }
  username: string='';
  password: string='';
  login():void{
    this.securityService.login(this.username, this.password).subscribe(
      response => {
        this.authService.setToken(response.token, response.role); // Lưu token và role
        alert('Login thành công');
        this.router.navigate(['/ban-hang']);
      },
      error => {
        console.error('Login thất bại', error);
      }
    );
  }
  getTokenLocalStorage():void{
    localStorage.getItem('token');
    localStorage.getItem('role');
  }

}


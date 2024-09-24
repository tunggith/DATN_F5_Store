import { Component, OnInit } from '@angular/core';
import { XuatXu } from '../xuat-xu';
import { XuatXuService } from '../xuat-xu.service';

@Component({
  selector: 'app-xuat-xu',
  templateUrl: './xuat-xu.component.html',
  styleUrls: ['./xuat-xu.component.scss']
})
export class XuatXuComponent implements OnInit{
  public xuatXuList: XuatXu[] = [];
  constructor(private XuatXuService: XuatXuService){}
  ngOnInit(): void {
    this.XuatXuService.getXuatXu().subscribe((data:any)=>{
      this.xuatXuList = data.result.content;
    })
  }
}

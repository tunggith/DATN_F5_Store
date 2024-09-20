import { Component, OnInit } from '@angular/core';
import { SanPhamService } from '../san-pham.service';
import { SanPham } from '../san-pham';

@Component({
  selector: 'app-san-pham',
  templateUrl: './san-pham.component.html',
  styleUrls: ['./san-pham.component.scss']
})
export class SanPhamComponent implements OnInit {
  public SanPham: SanPham[] =[];
  constructor(private SanPhamService: SanPhamService){ }
  ngOnInit(): void {
    this.SanPhamService.getSanPham().subscribe((data: any)=>{
      console.log(data);
      this.SanPham=data.result.content.content;
    });
  }

}

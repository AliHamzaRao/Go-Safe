import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BrandsService } from '../../../_core/_AppServices/Brand.service';
import { Brand, PagingResponse } from '../../../_interfaces/DBresponse.model';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent implements OnInit, AfterViewInit{
  Columns:any[];
  Data:MatTableDataSource<Brand>;
  @ViewChild(MatPaginator) paginator : MatPaginator;
  constructor( public BrandsService :BrandsService) {
    this.Columns = ["id","name","actions"];
  }
  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    this.getbrands();
  }
  getbrands(){
    this.BrandsService.getBrands(1).subscribe((response:PagingResponse<Brand[]>)=>{
      if(response.code >=200){
        this.Data=new MatTableDataSource(response.data); 
        this.Data.paginator = this.paginator
      }
    })
  }
}

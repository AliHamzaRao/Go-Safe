import { Component, OnInit } from '@angular/core';
import { BrandsService } from '../../../_core/_AppServices/Brand.service';
import { Brand, PagingResponse } from '../../../_interfaces/DBresponse.model';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent implements OnInit {
  Columns:any[];
  Data:Brand[];
  constructor( public BrandsService :BrandsService) {
    this.Columns = ["brn_id","brn_name"];
  }
  ngOnInit() {
    // this.getbrands()
  }
  getbrands(){
    this.BrandsService.getBrands(1).subscribe((response:PagingResponse<Brand[]>)=>{
      debugger;
      if(response.code >=200){
        this.Data = response.data
      }
    })
  }
}

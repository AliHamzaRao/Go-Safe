import { Component, OnInit } from '@angular/core';
import { CountryService } from '../../../_core/_AppServices/Country.service';
import { Country, PagingResponse, SharedGridColumnModel, GridColumnType } from '../../../_interfaces/DBresponse.model';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-Countries',
  templateUrl: './Countries.component.html',
  styleUrls: ['./Countries.component.scss']
})
export class CountriesComponent implements OnInit {
  Data : MatTableDataSource<Country>;
  Columns: Array<SharedGridColumnModel>
  Title:string ='Countires'
  constructor(private CountryService: CountryService) {
    this.Columns = [
      new SharedGridColumnModel('cnt_id',GridColumnType.Text,'string',true,'ID',true),
      new SharedGridColumnModel('cnt_name',GridColumnType.Text,'string',true,'Name',true),
      new SharedGridColumnModel('cnt_currency',GridColumnType.Text,'string',true,'Currency',true),
      new SharedGridColumnModel('cnt_currency_abbr',GridColumnType.Text,'string',true,'Currency Abbrivations',true),
    ]
  }

  ngOnInit() {
    this.getCountries()
  }
  getCountries(){
    this.CountryService.getCountries().subscribe((response:PagingResponse<Country>)=>{
      this.Data =new MatTableDataSource(response.data);
    })
  }

}

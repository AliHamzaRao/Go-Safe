import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { City, SharedGridColumnModel, SharedGridActions, GridColumnType, GridActionType } from '../../../_interfaces/DBresponse.model';
import { CityService } from '../../../_core/_AppServices/City.service';

@Component({
  selector: 'app-Cities',
  templateUrl: './Cities.component.html',
  styleUrls: ['./Cities.component.scss']
})
export class CitiesComponent implements OnInit {
Title:string = 'Cities'  
Data: MatTableDataSource<City>;
Columns:Array<SharedGridColumnModel>;
dataLoaded:boolean = false;
RequestGridActions: Array<SharedGridActions>
  constructor(private CityService:CityService) {
    this.Columns = [
      new SharedGridColumnModel('cty_id',GridColumnType.Text,'string',true,'ID',false),
      new SharedGridColumnModel('cty_name',GridColumnType.Text,'string',true,'City Name',false),
      new SharedGridColumnModel('cnt_name',GridColumnType.Text,'string',true,'Country Name',false),
      new SharedGridColumnModel('Actions',GridColumnType.Actions,'string',true,'Actions',false),
    ];
    this.RequestGridActions=[
      new SharedGridActions(GridActionType.Edit,'mode_edit','edit','primary'),
      new SharedGridActions(GridActionType.Edit,'delete','delete','warn'),
    ]
  }

  ngOnInit() {
    this.getCities()
  }
  getCities(){
    this.CityService.getCities().subscribe(response=>{
      this.Data = new MatTableDataSource(response.data)
      this.dataLoaded = true
    })
  }
  onGridAction(action){
    console.log(action);
  }
}

import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BrandVersionType, SharedGridColumnModel, SharedGridActions, GridColumnType, GridActionType, RootResponse } from '../../../_interfaces/DBresponse.model';
import { BrandTypesVersionService } from '../../../_core/_AppServices/BrandTypesVersion.service copy';

@Component({
  selector: 'app-BrandVersions',
  templateUrl: './BrandVersions.component.html',
  styleUrls: ['./BrandVersions.component.scss']
})
export class BrandVersionsComponent implements OnInit {
  Title:string="Brand Versions"
  Data:MatTableDataSource<BrandVersionType>;
  Columns: Array<SharedGridColumnModel>;
  dataLoaded:boolean=false;
  RequestGridActions:Array<SharedGridActions>
  constructor(private BrandTypeVersions:BrandTypesVersionService) {
    this.Columns=[
      new SharedGridColumnModel('brn_type_ver',GridColumnType.Text ,'string',true,'ID',false),
      new SharedGridColumnModel('ver_name',GridColumnType.Text ,'string',true,'Version Name',false),
      new SharedGridColumnModel('brn_type_name',GridColumnType.Text ,'string',true,'Brand Type Nmae',false),
      new SharedGridColumnModel('brn_name',GridColumnType.Text ,'string',true,'Brand Name',false),
      new SharedGridColumnModel('Actions',GridColumnType.Actions ,'string',true,'Actions',false)
    ],
    this.RequestGridActions=[
      new SharedGridActions(GridActionType.Edit,'mode-edit','edit',"primary"),
      new SharedGridActions(GridActionType.Edit,'delete','delete',"warn"),
    ]
  }
  ngOnInit() {
    this.getBrandTypesVersion()  
  }
  getBrandTypesVersion(){
    this.BrandTypeVersions.getBrandTypes().subscribe((response:RootResponse<BrandVersionType>)=>{
      if(response.status){
        this.Data = new MatTableDataSource(response.data)
      }
    })
  }
}

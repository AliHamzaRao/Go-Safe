import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BrandTypesService } from '../../../_core/_AppServices/BrandTypes.service';
import { BrandTypes, PagingResponse, SharedGridColumnModel, GridColumnType, SharedGridActions, GridActionType } from '../../../_interfaces/DBresponse.model';

@Component({
  selector: 'app-BrandTypes',
  templateUrl: './BrandTypes.component.html',
  styleUrls: ['./BrandTypes.component.scss']
})
export class BrandTypesComponent implements OnInit {
  Data: MatTableDataSource<BrandTypes>
  Columns:Array<SharedGridColumnModel>;
  Title:string='Brand Types';
  dataLoaded:boolean=false;
  RequestGridActions:Array<SharedGridActions>
  constructor(private BrandTypesService: BrandTypesService) { 
    this.Columns = [
      new SharedGridColumnModel('brn_typ_id',GridColumnType.Text,'string',true, 'ID',false),
      new SharedGridColumnModel('brn_typ_name',GridColumnType.Text,'string',true, 'Brand Type Name',false),
      new SharedGridColumnModel('brn_name',GridColumnType.Text,'string',true, 'Brand Name',false),
      new SharedGridColumnModel("Actions",GridColumnType.Actions,'string',true,'Actions',true),
    ],
    this.RequestGridActions=[
      new SharedGridActions(GridActionType.Edit,'mode_edit','edit','primary'),
      new SharedGridActions(GridActionType.Edit,'delete','delete','warn'),
    ]
  }
  ngOnInit(){
    this.getBrandTypes()
  }
  getBrandTypes(){
    this.BrandTypesService.getBrandTypes().subscribe((response:PagingResponse<BrandTypes>)=>{
      this.Data = new MatTableDataSource(response.data)
      this.dataLoaded = true
    })
  }
  OnGridAction(action){
    console.log(action)
  }
}

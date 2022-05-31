import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BrandsService } from '../../../_core/_AppServices/Brand.service';
import { Brand, GridActionType, GridColumnType, PagingResponse, SharedGridActions, SharedGridColumnModel, commandPostResponse } from '../../../_interfaces/DBresponse.model';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent implements OnInit, AfterViewInit {
  Columns: Array<SharedGridColumnModel>;
  Data: MatTableDataSource<Brand>;
  Title: string = 'Brands';
  dataLoaded:boolean=false;
  RequestGridActions: Array<SharedGridActions>;
  constructor(public BrandsService: BrandsService, public Toast:ToastrService) {
    this.Columns = [
      new SharedGridColumnModel('brn_id', GridColumnType.Text, 'number', true, 'ID', false),
      new SharedGridColumnModel('brn_name', GridColumnType.Text, 'string', true, 'Name'),
      new SharedGridColumnModel("Actions", GridColumnType.Actions, 'string', true, 'Actions', true),
    ];
    this.RequestGridActions = [
      new SharedGridActions(GridActionType.Edit, 'mode_edit', 'edit', 'primary'),
      new SharedGridActions(GridActionType.Delete, 'delete', 'delete', 'warn')
    ];
  }
  ngOnInit(): void {
    console.log(this.Columns)
  }
  ngAfterViewInit(): void {
    this.getbrands();
  }
  getbrands() {
    this.BrandsService.getBrands().subscribe((response: PagingResponse<Brand>) => {
      if (response.code >= 200) {
        this.Data = new MatTableDataSource(response.data);
        this.dataLoaded = true;
        // this.Data.paginator = this.paginator
      }
    })
  }
  deleteBrand(id){
    this.dataLoaded = false;
    this.BrandsService.deleteBrand(id).subscribe((response:commandPostResponse) => {
      if(response._object.Message.toString().length){
        this.Toast.success(response._object.Message.toString(),'Deleted Successfully')
        this.dataLoaded = true;
      }
      else{
        this.dataLoaded = true;
        this.Toast.info("Couldn't Process request",'Deleted Successfully')
      }
    })
    this.getbrands()
  }
  OnGridAction(action) {
    if (action.actionType == 'DELETE') {
      this.deleteBrand(action.row.brn_id)
    }
  }
  onCreate(action){
    console.log(action);
  }
}

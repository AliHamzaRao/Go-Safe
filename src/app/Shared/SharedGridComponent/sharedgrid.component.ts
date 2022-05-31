import { Component, Input, ViewChild, OnInit, Output, EventEmitter, SimpleChange, OnChanges, SimpleChanges } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { SharedGridActions, SharedGridColumnModel, TableButtonAction ,GridColumnType, GridActionType} from '../../_interfaces/DBresponse.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector:"app-sharedgrid",
templateUrl:'./sharedgrid.component.html',
styleUrls:['./sharedgrid.component.scss']
})

export class SharedGridComponent implements OnInit, OnChanges{
    static sharedGridStaticInstance: SharedGridComponent;
    @Input() Title: string;
    @Input() Columns: Array<SharedGridColumnModel>;
    @Input() Data: MatTableDataSource<any>;
    @Output() invokeGridColumnAction: EventEmitter<any>;
    @Output() invokeGridAction: EventEmitter<any>;
    @Output() invokeCreateEvent: EventEmitter<any>;
    @Input() actions: Array<SharedGridActions>;
    @Input() canAdd: boolean;
    @Input() dataLoaded:boolean;
    displayedColumns:Array<any>;
    @ViewChild(MatPaginator) paginator :MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    name: string;
    constructor(){
        SharedGridComponent.sharedGridStaticInstance = this;
        this.Columns=new Array<SharedGridColumnModel>();
        this.displayedColumns=[];
        this.invokeGridColumnAction = new EventEmitter<any>();
        this.actions = new Array<SharedGridActions>();
        this.invokeGridAction = new EventEmitter<any>();
    }
    public get GridColumnType() {
        return GridColumnType;
      }
      public get GridActionType() {
        return GridActionType;
      }
    ngOnInit(): void {
        this.displayedColumns = this.displayedColumns.concat(this.Columns.map(x => x.dataField));
        console.log(this.displayedColumns, "displayedColumns");
        
    }
    ngOnChanges(data: SimpleChanges): void {
    if(data){
        this.Data.paginator = this.paginator;
        this.Data.sort = this.sort;
    }
    }
    getRow(data){
      let row=data;
      console.log(row);
    }
    gridButtonClick(column, row) {
        this.invokeGridColumnAction.emit({ column, Id: row.key });
    }
    addGridRow(name){
      debugger;
      SharedGridComponent.sharedGridStaticInstance.invokeCreateEvent.emit({actionType:name})
    }
    gridActionClick(row,name) {
      SharedGridComponent.sharedGridStaticInstance.invokeGridAction.emit({ row, actionType: name });
    }
      
}
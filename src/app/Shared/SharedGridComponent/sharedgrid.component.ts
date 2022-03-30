import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Brand, Data } from '../../_interfaces/DBresponse.model';
import { MatTableDataSource } from '@angular/material/table';

@Component({
selector:"app-sharedgrid",
templateUrl:'./sharedgrid.component.html',
styleUrls:['./sharedgrid.component.scss']
})

export class SharedGridComponent implements OnChanges{
    @Input() Title: string;
    @Input() Columns: any;
    @Input() Data: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator :MatPaginator;
    constructor(){
    }
    ngOnChanges(data:SimpleChanges): void {
        console.log(data)
        if(data){
            this.Data.paginator = this.paginator
        }
    }
}
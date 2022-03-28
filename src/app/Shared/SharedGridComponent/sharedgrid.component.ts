import { Component, Input, OnInit } from '@angular/core';
import { Brand } from '../../_interfaces/DBresponse.model';

@Component({
selector:"app-sharedgrid",
templateUrl:'./sharedgrid.component.html',
styleUrls:['./sharedgrid.component.scss']
})

export class SharedGrid implements OnInit{
    @Input() Columns: string[];
    @Input() Data: Brand[];

    constructor(){
    }
    ngOnInit(): void {
        console.log(this.Data, this.Columns)
    }
}
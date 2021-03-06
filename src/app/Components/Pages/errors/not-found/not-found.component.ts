import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppSettings } from '../../../../_core/settings/app.settings';
import { Settings } from '../../../../_core/settings/app.settings.model';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html'
})
export class NotFoundComponent implements OnInit{
  location:string;
  public settings: Settings;
  constructor(public appSettings:AppSettings, public router:Router) {
    this.settings = this.appSettings.settings; 
  }
  ngOnInit(): void {
    // this.location  = window.location.pathname;
    // if(this.location == "/createfence/vehicles"|| "/showgeofence/vehicles"){
    //   this.router.navigate(['/vehicles'])
    // } if(this.location == "/createfence/vehicles"|| "/showgeofence/vehicles"){
    //   this.router.navigate(['/vehicles'])
    // }
  }
  searchResult(): void {
    this.router.navigate(['/search']);
  }

  ngAfterViewInit(){
    this.settings.loadingSpinner = false; 
  }

}
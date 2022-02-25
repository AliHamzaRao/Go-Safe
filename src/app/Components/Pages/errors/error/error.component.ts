import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppSettings } from '../../../../_core/settings/app.settings';
import { Settings } from '../../../../_core/settings/app.settings.model';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html'
})
export class ErrorComponent {
  public settings: Settings;
  constructor(public appSettings:AppSettings, public router:Router) {
    this.settings = this.appSettings.settings; 
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  ngAfterViewInit(){
    this.settings.loadingSpinner = false;  
  } 

}
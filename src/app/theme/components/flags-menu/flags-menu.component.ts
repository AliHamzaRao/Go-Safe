import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppSettings } from '../../../_core/settings/app.settings';
import { Settings } from '../../../_core/settings/app.settings.model';

@Component({
  selector: 'app-flags-menu',
  templateUrl: './flags-menu.component.html',
  styleUrls: ['./flags-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FlagsMenuComponent implements OnInit {

  public settings: Settings;
  constructor(public appSettings:AppSettings){
      this.settings = this.appSettings.settings; 
  }

  ngOnInit() {
  }

}

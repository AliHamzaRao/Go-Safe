declare const require: any;
import { Component } from '@angular/core';
import { AppSettings } from './_core/settings/app.settings';
import { Settings } from './_core/settings/app.settings.model';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public settings: Settings;
  constructor(public appSettings: AppSettings) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
  }
}
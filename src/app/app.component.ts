declare const require: any;
import { Component } from '@angular/core';
import { AppSettings } from './_core/settings/app.settings';
import { Settings } from './_core/settings/app.settings.model';
// const ftp = require('basic-ftp');
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
    // async () => {
    //   const client = new ftp.Client();
    //   client.ftp.verbose = true;
    //   try {
    //     await client.access({
    //       host: "148.66.136.10",
    //       user: "cmpInfo@gosafesystem.com.pk",
    //       password: "kwxjC]3dxInh",
    //       secure: false,
    //     });
    //     console.log(await client.list());
    //     await client.downloadTo("CompanyInfo.json", "companyInfo.json");
    //   } catch (err) {
    //     console.log(err);
    //   }
    // }
  }
}
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Setting } from "src/app/_interfaces/DBresponse.model";
import {SettingsService} from "../../../../_core/_AppServices/SettingsService"
import {SettingTypeService} from "../../../../_core/_AppServices/SettingTypeService"
import { SettingDialogComponent } from "../SettingDialog/SettingDialog.component";
import { RootResponse } from '../../../../_interfaces/DBresponse.model';

@Component({
    selector: 'app-all-settings-dialog',
    templateUrl: './AllSettingsDialog.html',
    styleUrls: [
        "../../../pages/pages.component.scss",
        "../ControlDialog/ControlDialog.scss",]
  })
  export class AllSettingsDialogComponent implements OnInit {
    AllSettings: Setting[] = [{
      check_status: false,
      fb_id: 0,
      p_cmd_id: 0,
      Name: "",
      p_cell_no: '',
      p_IpAddress: "",
      p_tcp_port: "",
      url: "",
      apn: "",
      user_name: "",
      pwd: "",
      mileage: "",
      cmd_type: "",
      p_dev_id: "",
      channel: ""
    }]
    constructor(public SettingsService: SettingsService, public SettingTypeService: SettingTypeService, public dialog: MatDialog) { }
    ngOnInit(): void {
      this.SettingsService.GetSettings().subscribe((settings:RootResponse<Setting>) => this.AllSettings = settings.data)
    }
    OpenSettingDialog(name, id) {
      this.SettingTypeService.setSetting(name);
      this.SettingTypeService.setSettingId(id)
      this.dialog.open(SettingDialogComponent)
    }
    closeDialog() {
      this.dialog.closeAll();
    }
  }
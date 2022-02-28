import { Component, OnInit, AfterViewInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Toast, ToastrService } from "ngx-toastr";
import { Command, Setting } from "src/app/_interfaces/DBresponse.model";
import { CommandsService } from "../../../../_core/_AppServices/CommandsService";
import { CommandTypeService } from "../../../../_core/_AppServices/CommandTypeService";
import { SettingsService } from "../../../../_core/_AppServices/SettingsService";
import { SettingTypeService } from "../../../../_core/_AppServices/SettingTypeService";
import { ControlDialogComponent } from "../ControlDialog/ControlDialog.component";
import { SettingDialogComponent } from "../SettingDialog/SettingDialog.component";
@Component({
  selector: "app-all-controls-dialog",
  templateUrl: "./AllControlsDialog.html",
  styleUrls: [
    "../../../pages/pages.component.scss",
    "../../../pages/Dialogs/ControlDialog/ControlDialog.scss",
  ],
})
export class AllControlsDialogComponent implements OnInit, AfterViewInit {
  loading: boolean = true;
  AllCommands: Command[] = [
    {
      Name: "No data available",
      camera_channel: "",
      channel: "No data available",
      check_status: false,
      fb_id: 0,
      p_cell_no: "",
      p_cmd_id: 1,
      p_dev_id: 0,
      _picQ: "",
    },
  ];
  AllSettings: Setting[] = [
    {
      check_status: false,
      fb_id: 0,
      p_cmd_id: 0,
      Name: "",
      p_cell_no: "",
      p_IpAddress: "",
      p_tcp_port: "",
      url: "",
      apn: "",
      user_name: "",
      pwd: "",
      mileage: "",
      cmd_type: "",
      p_dev_id: "",
      channel: "",
    },
  ];
  constructor(
    public dialog: MatDialog,
    public CommandsService: CommandsService,
    public CommandTypeService: CommandTypeService,
    public SettingsService: SettingsService,
    public SettingTypeService: SettingTypeService,
    public toast: ToastrService
  ) {}
  ngOnInit(): void {
    this.CommandsService.GetCommands().subscribe((commands) => {
      if (commands.status) {
        this.AllCommands = commands.data;
        this.SettingsService.GetSettings().subscribe((settings) => {
          if (settings.status) {
            this.AllSettings = settings.data;
          } else {
            this.toast.clear();
            this.toast.error(
              settings.message,
              `command failed to execute due to response code ${settings.code}`
            );
          }
          this.loading = false;
        });
      } else {
        this.toast.clear();
        this.toast.error(
          commands.message,
          `command failed to execute due to response code ${commands.code}`
        );
      }
    });
  }
  ngAfterViewInit(): void {}
  ngOnDestroy() {}
  OpenSettingDialog(name, id): void {
    this.SettingTypeService.setSetting(name);
    this.SettingTypeService.setSettingId(id);
    this.dialog.open(SettingDialogComponent, { disableClose: true });
  }
  OpenCommandDialog(name, id): void {
    this.CommandTypeService.setCommand(name);
    this.CommandTypeService.setCommandId(id);
    setTimeout(() => {
      this.dialog.open(ControlDialogComponent, { disableClose: true });
    }, 400);
  }
  closeDialog() {
    this.AllCommands = [];
    this.AllSettings = [];
    this.dialog.closeAll();
  }
}

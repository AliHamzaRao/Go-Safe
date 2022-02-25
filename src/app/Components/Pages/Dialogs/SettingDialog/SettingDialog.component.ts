import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { AllControlsDialogComponent } from "../AllControlsDialog/AllControlsDialog.component";
import { DeviceIdService } from '../../../../_core/_AppServices/DeviceId.service';
import {SettingsService} from "../../../../_core/_AppServices/SettingsService"
import {SettingTypeService} from "../../../../_core/_AppServices/SettingTypeService"

@Component({
    selector: 'app-settings-dialog',
    templateUrl: './SettingsDialog.html',
    styleUrls: [
      "../../../pages/pages.component.scss",
      "../ControlDialog/ControlDialog.scss",]
  })
  export class SettingDialogComponent implements OnInit {
    deviceId: number;
    settingName: string;
    settingId: number;
    channel: string;
    phoneNumber: string;
    ipAddress: string;
    port: string;
    url: string;
    apn: string;
    username: string;
    password: string;
    inputType: string = "text";
    mileage: string;
    textCommand: string;
    hidden: boolean = true;
    constructor(public SettingsService: SettingsService, public SettingTypeService: SettingTypeService, public dialog: MatDialog, public Toast: ToastrService,public DeviceIdService: DeviceIdService) { }
    ngOnInit(): void {
      this.SettingTypeService.currnetSetting.subscribe(setting => this.settingName = setting)
      this.SettingTypeService.currentSettingId.subscribe(id => this.settingId = id)
      this.DeviceIdService.deviceId.subscribe(id => this.deviceId = id)
    }
  
    ChannelChange(e) {
      this.channel = e.value;
    }
    numberChange(e) {
      this.phoneNumber = e.target.value;
    }
    togglePassword() {
      this.hidden = !this.hidden;
    }
    //#region Send Request
    sendRequest() {
      if (this.settingName == 'Set Message Center Number') {
        let data = {
          check_status: false,
          fb_id: 1,
          p_cmd_id: this.settingId,
          Name: this.settingName,
          p_cell_no: this.phoneNumber,
          p_IpAddress: "",
          p_tcp_port: "",
          url: "",
          apn: "",
          user_name: "",
          pwd: "",
          mileage: "",
          cmd_type: "",
          p_dev_id: this.deviceId.toString(),
          channel: this.channel
        }
        if (this.channel && this.phoneNumber) {
          this.SettingsService.SendSettings(data).subscribe(res => {
            if (isNaN(res._object.Message) ){
              this.Toast.clear()
              this.Toast.error(res._object.Message.toString())
            }
            else {
              data.check_status = true;
              data.fb_id = res._object.Message;
              this.SettingsService.SendSettings(data).subscribe(newRes => {
                if (newRes._object.Message.toString() == "") {
                  this.Toast.clear()
                  this.Toast.success(`${this.settingName} command successfully executed`, "Success")
                  this.dialog.closeAll();
                  this.dialog.open(AllControlsDialogComponent)
                }
              })
            }
          })
        }
        else {
          this.Toast.clear()
          this.Toast.error('Please Fill the Form', "Couldn't Request")
        }
      }
      if (this.settingName == 'Reset to Factory Default') {
        let data = {
          check_status: false,
          fb_id: 1,
          p_cmd_id: this.settingId,
          Name: this.settingName,
          p_cell_no: '',
          p_IpAddress: "",
          p_tcp_port: "",
          url: "",
          apn: "",
          user_name: "",
          pwd: "",
          mileage: "",
          cmd_type: "",
          p_dev_id: this.deviceId.toString(),
          channel: this.channel
        }
        if (this.channel) {
          this.SettingsService.SendSettings(data).subscribe(res => {
            if (isNaN(res._object.Message) ){
              this.Toast.clear()
              this.Toast.error(res._object.Message.toString())
            }
            else {
              data.check_status = true;
              data.fb_id = res._object.Message;
              this.SettingsService.SendSettings(data).subscribe(newRes => {
                if (newRes._object.Message.toString() == "") {
                  this.Toast.clear()
                  this.Toast.success(`${this.settingName} command successfully executed`, "Success")
                  this.dialog.closeAll();
                  this.dialog.open(AllControlsDialogComponent)
                }
              })
            }
          })
        }
        else {
          this.Toast.clear()
          this.Toast.error('Please Fill the Form', "Couldn't Request")
        }
      }
      if (this.settingName == 'Change IP') {
        this.ipAddress = $('.ipAddressInput').val().toString();
        this.port = $('.portInput').val().toString();
        if (this.ipAddress && this.port) {
          let data = {
            check_status: false,
            fb_id: 1,
            p_cmd_id: this.settingId,
            Name: this.settingName,
            p_cell_no: '',
            p_IpAddress: this.ipAddress,
            p_tcp_port: this.port,
            url: "",
            apn: "",
            user_name: "",
            pwd: "",
            mileage: "",
            cmd_type: "",
            p_dev_id: this.deviceId.toString(),
            channel: this.channel
          }
          if (this.channel) {
            this.SettingsService.SendSettings(data).subscribe(res => {
              if (isNaN(res._object.Message) ){
                this.Toast.clear()
                this.Toast.error(res._object.Message.toString())
              }
              else {
                data.check_status = true;
                data.fb_id = res._object.Message;
                this.SettingsService.SendSettings(data).subscribe(newRes => {
                  if (newRes._object.Message.toString() == "") {
                    this.Toast.clear()
                    this.Toast.success(`${this.settingName} command successfully executed`, "Success")
                    this.dialog.closeAll();
                    this.dialog.open(AllControlsDialogComponent)
                  }
                })
              }
            })
          }
          else {
            this.Toast.clear()
            this.Toast.error('Please Fill the Form', "Couldn't Request")
          }
        }
        else {
          this.Toast.clear()
          this.Toast.error("Please Enter IP and PORT")
        }
      }
      if (this.settingName == 'Change Domain') {
        this.url = $('.urlInput').val().toString().toLowerCase();
        this.port = $('.portInput').val().toString();
        if (this.url && this.port) {
          let data = {
            check_status: false,
            fb_id: 1,
            p_cmd_id: this.settingId,
            Name: this.settingName,
            p_cell_no: '',
            p_IpAddress: '',
            p_tcp_port: this.port,
            url: this.url,
            apn: "",
            user_name: "",
            pwd: "",
            mileage: "",
            cmd_type: "",
            p_dev_id: this.deviceId.toString(),
            channel: this.channel
          }
          if (this.channel) {
            this.SettingsService.SendSettings(data).subscribe(res => {
              if (isNaN(res._object.Message) ){
                this.Toast.clear()
                this.Toast.error(res._object.Message.toString())
              }
              else {
                data.check_status = true;
                data.fb_id = res._object.Message;
                this.SettingsService.SendSettings(data).subscribe(newRes => {
                  if (newRes._object.Message.toString() == "") {
                    this.Toast.clear()
                    this.Toast.success(`${this.settingName} command successfully executed`, "Success")
                    this.dialog.closeAll();
                    this.dialog.open(AllControlsDialogComponent)
                  }
                })
              }
            })
          }
          else {
            this.Toast.clear()
            this.Toast.error('Please Fill the Form', "Couldn't Request")
          }
        }
        else {
          this.Toast.clear()
          this.Toast.error("Please Enter URL and PORT")
        }
      }
      if (this.settingName == 'Change APN') {
        this.apn = $('.apnInput').val().toString();
        if (this.apn) {
          let data = {
            check_status: false,
            fb_id: 1,
            p_cmd_id: this.settingId,
            Name: this.settingName,
            p_cell_no: '',
            p_IpAddress: '',
            p_tcp_port: '',
            url: '',
            apn: this.apn,
            user_name: "",
            pwd: "",
            mileage: "",
            cmd_type: "",
            p_dev_id: this.deviceId.toString(),
            channel: this.channel
          }
          if (this.channel) {
            this.SettingsService.SendSettings(data).subscribe(res => {
              if (isNaN(res._object.Message) ){
                this.Toast.clear()
                this.Toast.error(res._object.Message.toString())
              }
              else {
                data.check_status = true;
                data.fb_id = res._object.Message;
                this.SettingsService.SendSettings(data).subscribe(newRes => {
                  if (newRes._object.Message.toString() == "") {
                    this.Toast.clear()
                    this.Toast.success(`${this.settingName} command successfully executed`, "Success")
                    this.dialog.closeAll();
                    this.dialog.open(AllControlsDialogComponent)
                  }
                })
              }
            })
          }
          else {
            this.Toast.clear()
            this.Toast.error('Please Fill the Form', "Couldn't Request")
          }
        }
        else {
          this.Toast.clear()
          this.Toast.error("Please Enter APN")
        }
      }
      if (this.settingName == 'Change APN User name and Password') {
        this.username = $('.usernameInput').val().toString();
        this.password = $('.passwordInput').val().toString();
        if (this.username && this.password) {
          let data = {
            check_status: false,
            fb_id: 1,
            p_cmd_id: this.settingId,
            Name: this.settingName,
            p_cell_no: '',
            p_IpAddress: '',
            p_tcp_port: '',
            url: '',
            apn: '',
            user_name: this.username,
            pwd: this.password,
            mileage: "",
            cmd_type: "",
            p_dev_id: this.deviceId.toString(),
            channel: this.channel
          }
          if (this.channel) {
            this.SettingsService.SendSettings(data).subscribe(res => {
              if (isNaN(res._object.Message) ){
                this.Toast.clear()
                this.Toast.error(res._object.Message.toString())
              }
              else {
                data.check_status = true;
                data.fb_id = res._object.Message;
                this.SettingsService.SendSettings(data).subscribe(newRes => {
                  if (newRes._object.Message.toString() == "") {
                    this.Toast.clear()
                    this.Toast.success(`${this.settingName} command successfully executed`, "Success")
                    this.dialog.closeAll();
                    this.dialog.open(AllControlsDialogComponent)
                  }
                })
              }
            })
          }
          else {
            this.Toast.clear()
            this.Toast.error('Please Fill the Form', "Couldn't Request")
          }
        }
        else {
          this.Toast.clear()
          this.Toast.error("Please Enter Username and Password")
        }
      }
      if (this.settingName == 'Reset Odometer') {
        this.mileage = $('.mileageInput').val().toString();
        if (this.mileage) {
          let data = {
            check_status: false,
            fb_id: 1,
            p_cmd_id: this.settingId,
            Name: this.settingName,
            p_cell_no: '',
            p_IpAddress: '',
            p_tcp_port: '',
            url: '',
            apn: '',
            user_name: '',
            pwd: '',
            mileage: this.mileage,
            cmd_type: "",
            p_dev_id: this.deviceId.toString(),
            channel: this.channel
          }
          if (this.channel) {
            this.SettingsService.SendSettings(data).subscribe(res => {
              if (isNaN(res._object.Message) ){
                this.Toast.clear()
                this.Toast.error(res._object.Message.toString())
              }
              else {
                data.check_status = true;
                data.fb_id = res._object.Message;
                this.SettingsService.SendSettings(data).subscribe(newRes => {
                  if (newRes._object.Message.toString() == "") {
                    this.Toast.clear()
                    this.Toast.success(`${this.settingName} command successfully executed`, "Success")
                    this.dialog.closeAll();
                    this.dialog.open(AllControlsDialogComponent)
                  }
                })
              }
            })
          }
          else {
            this.Toast.clear()
            this.Toast.error('Please Fill the Form', "Couldn't Request")
          }
        }
        else {
          this.Toast.clear()
          this.Toast.error("Please Enter Milage to Reset the Odometer")
        }
      }
      if (this.settingName == 'Text Command(6600,7700,GS Series)') {
        this.textCommand = $('.textCommandInput').val().toString();
        if (this.textCommand) {
          let data = {
            check_status: false,
            fb_id: 1,
            p_cmd_id: this.settingId,
            Name: this.settingName,
            p_cell_no: '',
            p_IpAddress: '',
            p_tcp_port: '',
            url: '',
            apn: '',
            user_name: '',
            pwd: '',
            mileage: '',
            cmd_type: this.textCommand,
            p_dev_id: this.deviceId.toString(),
            channel: this.channel
          }
          if (this.channel) {
            this.SettingsService.SendSettings(data).subscribe(res => {
              if (isNaN(res._object.Message) ){
                this.Toast.clear()
                this.Toast.error(res._object.Message.toString())
              }
              else {
                data.check_status = true;
                data.fb_id = res._object.Message;
                this.SettingsService.SendSettings(data).subscribe(newRes => {
                  if (newRes._object.Message.toString() == "") {
                    this.Toast.clear()
                    this.Toast.success(`${this.settingName} command successfully executed`, "Success")
                    this.dialog.closeAll();
                    this.dialog.open(AllControlsDialogComponent)
                  }
                })
              }
            })
          }
          else {
            this.Toast.clear()
            this.Toast.error('Please Fill the Form', "Couldn't Request")
          }
        }
        else {
          this.Toast.clear()
          this.Toast.error("Please Enter Milage to Reset the Odometer")
        }
      }
    }
    //#endregion
    cancelRequest() {
      this.dialog.closeAll();
      this.dialog.open(AllControlsDialogComponent)
    }
  }
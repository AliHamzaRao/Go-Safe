import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { AllControlsDialogComponent } from "../AllControlsDialog/AllControlsDialog.component";
import {CommandsService} from "../../../../_core/_AppServices/CommandsService"
import {CommandTypeService} from "../../../../_core/_AppServices/CommandTypeService"
import { DeviceIdService } from '../../../../_core/_AppServices/DeviceId.service';
@Component({
    selector: 'app-control-dialog',
    templateUrl: './ControlDialog.html',
    styleUrls: [
      "../../../pages/pages.component.scss",
      "./ControlDialog.scss",]
  })
  export class ControlDialogComponent implements OnInit {
    deviceId:number;
    commandType: string;
    commandId: number;
    channel: string;
    picQualtity: string;
    camChannel: string;
    phoneNumber: string;
    constructor(public CommandTypeService: CommandTypeService, public CommandsService: CommandsService, public Toast: ToastrService, public dialog: MatDialog ,  public DeviceIdService: DeviceIdService) { }
    ngOnInit(): void {
      this.CommandTypeService.currnetCommand.subscribe(command => this.commandType = command)
      this.CommandTypeService.currentCommandId.subscribe(id => this.commandId = id)
      this.DeviceIdService.deviceId.subscribe(deviceId=> this.deviceId = deviceId)
    }
    ChannelChange(e) {
      this.channel = e.value;
    }
    camChannelChange(e) {
      this.camChannel = e.value
    }
    picQualityChange(e) {
      this.picQualtity = e.value;
    }
    numberChange(e) {
      this.phoneNumber = e.target.value;
    }
    //#region Send Request
    sendRequest() {
      if (this.commandType == "Alarm Reset") {
        if (this.channel) {
          let data = {
            check_status: false,
            fb_id: 1,
            p_cmd_id: this.commandId,
            Name: this.commandType,
            _picQ: "",
            camera_channel: "",
            p_cell_no: "",
            p_dev_id: this.deviceId,
            channel: this.channel
          }
          this.CommandsService.SendCommand(data).subscribe(res => {
            if (isNaN(res._object.Message) ){
              this.Toast.clear()
              this.Toast.error(res._object.Message.toString())
            }
            else {
              data.check_status = true;
              data.fb_id = res._object.Message;
              this.CommandsService.SendCommand(data).subscribe(newRes => {
                if (newRes._object.Message.toString() == "") {
                  this.Toast.success(`${this.commandType} command successfully executed`, "Success")
                  this.dialog.closeAll();
                  this.dialog.open(AllControlsDialogComponent)
                }
              })
            }
          })
        }
        else {
          this.Toast.clear()
          this.Toast.error("Please select request channel", "Couldn't send Request")
        }
      }
      if (this.commandType == "Take Picture") {
        if (this.channel && this.camChannel && this.picQualtity) {
          let data = {
            check_status: false,
            fb_id: 1,
            p_cmd_id: this.commandId,
            Name: this.commandType,
            _picQ: this.picQualtity,
            camera_channel: this.camChannel,
            p_cell_no: "",
            p_dev_id: this.deviceId,
            channel: this.channel
          }
          this.CommandsService.SendCommand(data).subscribe(res => {
            if (isNaN(res._object.Message) ){
              data.check_status = true;
              data.fb_id = res._object.Message;
              this.CommandsService.SendCommand(data).subscribe(newRes => {
                if (newRes._object.Message.toString() == "") {
                  this.Toast.clear()
                  this.Toast.success(`${this.commandType} command successfully executed`, "Success")
                  this.dialog.closeAll();
                  this.dialog.open(AllControlsDialogComponent)
                }
              })
            }
            else {
              this.Toast.clear()
              this.Toast.error(res._object.Message.toString())
              this.dialog.closeAll();
              this.dialog.open(AllControlsDialogComponent)
            }
          })
        }
        else {
          this.Toast.error("Make Selection from every section", "Couldn't send Request")
        }
      }
      if (this.commandType == "Canbus Data Upload") {
        if (this.channel) {
          let data = {
            check_status: false,
            fb_id: 1,
            p_cmd_id: this.commandId,
            Name: this.commandType,
            _picQ: "",
            camera_channel: "",
            p_cell_no: "",
            p_dev_id: this.deviceId,
            channel: this.channel
          }
          this.CommandsService.SendCommand(data).subscribe(res => {
            if (isNaN(res._object.Message) ){
              this.Toast.clear()
              this.Toast.error(res._object.Message.toString())
            }
            else {
              data.check_status = true;
              data.fb_id = res._object.Message;
              this.CommandsService.SendCommand(data).subscribe(newRes => {
                if (newRes._object.Message.toString() == "") {
                  this.Toast.clear()
                  this.Toast.success(`${this.commandType} command successfully executed`, "Success")
                  this.dialog.closeAll();
                  this.dialog.open(AllControlsDialogComponent)
                }
              })
            }
          })
        }
        else {
          this.Toast.error("Please select request channel", "Couldn't send Request")
        }
      }
      if (this.commandType == "Device Reboot") {
        if (this.channel) {
          let data = {
            check_status: false,
            fb_id: 1,
            p_cmd_id: this.commandId,
            Name: this.commandType,
            _picQ: "",
            camera_channel: "",
            p_cell_no: "",
            p_dev_id: this.deviceId,
            channel: this.channel
          }
          this.CommandsService.SendCommand(data).subscribe(res => {
            if (isNaN(res._object.Message) ){
              this.Toast.clear()
              this.Toast.error(res._object.Message.toString())
            }
            else {
              data.check_status = true;
              data.fb_id = res._object.Message;
              this.CommandsService.SendCommand(data).subscribe(newRes => {
                if (newRes._object.Message.toString() == "") {
                  this.Toast.clear()
                  this.Toast.success(`${this.commandType} command successfully executed`, "Success")
                  this.dialog.closeAll();
                  this.dialog.open(AllControlsDialogComponent)
                }
              })
            }
          })
        }
        else {
          this.Toast.clear()
          this.Toast.error("Please select request channel", "Couldn't send Request")
        }
      }
      if (this.commandType == "Output2 on") {
        if (this.channel) {
          let data = {
            check_status: false,
            fb_id: 1,
            p_cmd_id: this.commandId,
            Name: this.commandType,
            _picQ: "",
            camera_channel: "",
            p_cell_no: "",
            p_dev_id: this.deviceId,
            channel: this.channel
          }
          this.CommandsService.SendCommand(data).subscribe(res => {
            if (isNaN(res._object.Message) ){
              this.Toast.clear()
              this.Toast.error(res._object.Message.toString())
            }
            else {
              data.check_status = true;
              data.fb_id = res._object.Message;
              this.CommandsService.SendCommand(data).subscribe(newRes => {
                if (newRes._object.Message.toString() == "") {
                  this.Toast.clear()
                  this.Toast.success(`${this.commandType} command successfully executed`, "Success")
                  this.dialog.closeAll();
                  this.dialog.open(AllControlsDialogComponent)
                }
              })
            }
          })
        }
        else {
          this.Toast.clear()
          this.Toast.error("Please select request channel", "Couldn't send Request")
        }
      }
      if (this.commandType == "Output2 off") {
        if (this.channel) {
          let data = {
            check_status: false,
            fb_id: 1,
            p_cmd_id: this.commandId,
            Name: this.commandType,
            _picQ: "",
            camera_channel: "",
            p_cell_no: "",
            p_dev_id: this.deviceId,
            channel: this.channel
          }
          this.CommandsService.SendCommand(data).subscribe(res => {
            if (isNaN(res._object.Message) ){
              this.Toast.clear()
              this.Toast.error(res._object.Message.toString())
            }
            else {
              data.check_status = true;
              data.fb_id = res._object.Message;
              this.CommandsService.SendCommand(data).subscribe(newRes => {
                if (newRes._object.Message.toString() == "") {
                  this.Toast.clear()
                  this.Toast.success(`${this.commandType} command successfully executed`, "Success")
                  this.dialog.closeAll();
                  this.dialog.open(AllControlsDialogComponent)
                }
              })
            }
          })
        }
        else {
          this.Toast.clear()
          this.Toast.error("Please select request channel", "Couldn't send Request")
        }
      }
      if (this.commandType == "Output3 on") {
        if (this.channel) {
          let data = {
            check_status: false,
            fb_id: 1,
            p_cmd_id: this.commandId,
            Name: this.commandType,
            _picQ: "",
            camera_channel: "",
            p_cell_no: "",
            p_dev_id: this.deviceId,
            channel: this.channel
          }
          this.CommandsService.SendCommand(data).subscribe(res => {
            if (isNaN(res._object.Message) ){
              this.Toast.clear()
              this.Toast.error(res._object.Message.toString())
            }
            else {
              data.check_status = true;
              data.fb_id = res._object.Message;
              this.CommandsService.SendCommand(data).subscribe(newRes => {
                if (newRes._object.Message.toString() == "") {
                  this.Toast.clear()
                  this.Toast.success(`${this.commandType} command successfully executed`, "Success")
                  this.dialog.closeAll();
                  this.dialog.open(AllControlsDialogComponent)
                }
              })
            }
          })
        }
        else {
          this.Toast.clear()
          this.Toast.error("Please select request channel", "Couldn't send Request")
        }
      }
      if (this.commandType == "Output3 off") {
        if (this.channel) {
          let data = {
            check_status: false,
            fb_id: 1,
            p_cmd_id: this.commandId,
            Name: this.commandType,
            _picQ: "",
            camera_channel: "",
            p_cell_no: "",
            p_dev_id: this.deviceId,
            channel: this.channel
          }
          this.CommandsService.SendCommand(data).subscribe(res => {
            if (isNaN(res._object.Message) ){
              this.Toast.clear()
              this.Toast.error(res._object.Message.toString())
            }
            else {
              data.check_status = true;
              data.fb_id = res._object.Message;
              this.CommandsService.SendCommand(data).subscribe(newRes => {
                if (newRes._object.Message.toString() == "") {
                  this.Toast.clear()
                  this.Toast.success(`${this.commandType} command successfully executed`, "Success")
                  this.dialog.closeAll();
                  this.dialog.open(AllControlsDialogComponent)
                }
              })
            }
          })
        }
        else {
          this.Toast.clear()
          this.Toast.error("Please select request channel", "Couldn't send Request")
        }
      }
      if (this.commandType == "Output1(Imb) On") {
        if (this.channel) {
          let data = {
            check_status: false,
            fb_id: 1,
            p_cmd_id: this.commandId,
            Name: this.commandType,
            _picQ: "",
            camera_channel: "",
            p_cell_no: "",
            p_dev_id: this.deviceId,
            channel: this.channel
          }
          this.CommandsService.SendCommand(data).subscribe(res => {
            if (isNaN(res._object.Message) ){
              this.Toast.clear()
              this.Toast.error(res._object.Message.toString())
            }
            else {
              data.check_status = true;
              data.fb_id = res._object.Message;
              this.CommandsService.SendCommand(data).subscribe(newRes => {
                if (newRes._object.Message.toString() == "") {
                  this.Toast.clear()
                  this.Toast.success(`${this.commandType} command successfully executed`, "Success")
                  this.dialog.closeAll();
                  this.dialog.open(AllControlsDialogComponent)
                }
              })
            }
          })
        }
        else {
          this.Toast.clear()
          this.Toast.error("Please select request channel", "Couldn't send Request")
        }
      }
      if (this.commandType == "Output1(Imb) Off") {
        if (this.channel) {
          let data = {
            check_status: false,
            fb_id: 1,
            p_cmd_id: this.commandId,
            Name: this.commandType,
            _picQ: "",
            camera_channel: "",
            p_cell_no: "",
            p_dev_id: this.deviceId,
            channel: this.channel
          }
          this.CommandsService.SendCommand(data).subscribe(res => {
            if (isNaN(res._object.Message) ){
              this.Toast.clear()
              this.Toast.error(res._object.Message.toString())
            }
            else {
              data.check_status = true;
              data.fb_id = res._object.Message;
              this.CommandsService.SendCommand(data).subscribe(newRes => {
                if (newRes._object.Message.toString() == "") {
                  this.Toast.clear()
                  this.Toast.success(`${this.commandType} command successfully executed`, "Success")
                  this.dialog.closeAll();
                  this.dialog.open(AllControlsDialogComponent)
                }
              })
            }
          })
        }
        else {
          this.Toast.clear()
          this.Toast.error("Please select request channel", "Couldn't send Request")
        }
      }
      if (this.commandType == "Location") {
        if (this.channel) {
          let data = {
            check_status: false,
            fb_id: 1,
            p_cmd_id: this.commandId,
            Name: this.commandType,
            _picQ: "",
            camera_channel: "",
            p_cell_no: "",
            p_dev_id: this.deviceId,
            channel: this.channel
          }
          this.CommandsService.SendCommand(data).subscribe(res => {
            if (isNaN(res._object.Message) ){
              this.Toast.clear()
              this.Toast.error(res._object.Message.toString())
            }
            else {
              data.check_status = true;
              data.fb_id = res._object.Message;
              this.CommandsService.SendCommand(data).subscribe(newRes => {
                if (newRes._object.Message.toString() == "") {
                  this.Toast.clear()
                  this.Toast.success(`${this.commandType} command successfully executed`, "Success")
                  this.dialog.closeAll();
                  this.dialog.open(AllControlsDialogComponent)
                }
              })
            }
          })
        }
        else {
          this.Toast.clear()
          this.Toast.error("Please select request channel", "Couldn't send Request")
        }
      }
      if (this.commandType == "Voice Monitor") {
        if (this.channel && this.phoneNumber) {
          let data = {
            check_status: false,
            fb_id: 1,
            p_cmd_id: this.commandId,
            Name: this.commandType,
            _picQ: "",
            camera_channel: "",
            p_cell_no: this.phoneNumber,
            p_dev_id: this.deviceId,
            channel: this.channel
          }
          this.CommandsService.SendCommand(data).subscribe(res => {
            if (isNaN(res._object.Message) ){
              this.Toast.clear()
              this.Toast.error(res._object.Message.toString())
            }
            else {
              data.check_status = true;
              data.fb_id = res._object.Message;
              this.CommandsService.SendCommand(data).subscribe(newRes => {
                if (newRes._object.Message.toString() == "") {
                  this.Toast.clear()
                  this.Toast.success(`${this.commandType} command successfully executed`, "Success")
                  this.dialog.closeAll();
                  this.dialog.open(AllControlsDialogComponent)
                }
              })
            }
          })
        }
        else {
          this.Toast.clear()
          this.Toast.error("Please select request channel", "Couldn't send Request")
        }
      }
    }
    //#endregion
    cancelRequest() {
      this.dialog.closeAll();
      this.dialog.open(AllControlsDialogComponent)
    }
  }
import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import {historyService} from "../../../../_core/_AppServices/historyService";
import {historyDataService} from "../../../../_core/_AppServices/HistoryDataService";
import { RegistrationNoService } from '../../../../_core/_AppServices/RegistrationNoService';
import { mapTypeService } from '../../../../_core/_AppServices/MapTypeService';
@Component({
    selector: "app-history-dialog",
    templateUrl: "./historyDialog.html",
    styleUrls: ["./historyDialog.component.scss"],
  })
  export class historyDialogComponent implements OnInit {
    loading: boolean = false;
    markerData = [];
    response: any;
    history: any;
    speed: boolean;
    lat: any;
    lng: any;
    currentState: number = 0;
    setTime: any;
    interval: number = 500;
    formValid: boolean = false;
    dateValid: boolean = false;
    reg_no:string;
    mapType:string;
    public form: FormGroup;
    constructor(
      public dialog: MatDialog,
      public historyService: historyService,
      public historyDataService: historyDataService,
      public Toast: ToastrService,
      public RegistrationNoService : RegistrationNoService,
      public mapTypeService : mapTypeService,
    ) { }
    ngOnInit() { 
        this.RegistrationNoService.regNumber.subscribe(regno => this.reg_no = regno)
        this.mapTypeService.newMap.subscribe(map => this.mapType = map)
    }
    onCheck(e) {
      this.speed = e.target.checked;
    }
  
    closeDialog() {
      this.dialog.closeAll();
    }
    periodTypeChange(e){
      let date: Date = new Date;
        console.log(e.target.value);
        let currentPeriod: string = e.target.value;
        switch(currentPeriod){
        case "Today":
          $("#de_start").val(date.toLocaleDateString()+ ' '+ date.toLocaleTimeString()).prop('disabled');
          $("#de_end").val(date.toLocaleDateString()+ ' '+ date.toLocaleTimeString()).prop('disabled');
          break;
        case "Monthly":
          let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
          $("#de_start").val(firstDay.toLocaleDateString()+ ' ' + firstDay.toLocaleTimeString()).prop('disabled');
          $("#de_end").val(date.toLocaleDateString()+ ' '+ date.toLocaleTimeString()).prop('disabled');
          break;
        case 'Weekly':
        var first = date.getDate() - date.getDay();
        var firstDayofWeek = new Date(date.setDate(first));
        $("#de_start").val(firstDayofWeek.toLocaleDateString()+ ' ' + firstDayofWeek.toLocaleTimeString()).prop('disabled');
        $("#de_end").val(date.toLocaleDateString()+ ' '+ date.toLocaleTimeString()).prop('disabled');
        break;
        default:
          break;
      }
    }
    onSubmit() {
      let History_type = $("#historyType").val();
      let dateStart = $("#de_start").val().toLocaleString().replace("T", " ");
      let dateEnd = $("#de_end").val().toLocaleString().replace("T", " ");
      let speed = this.speed;
      let veh_reg_no = this.reg_no;
      // var data = {
      //   veh_reg_no: "G1C-2424",
      //   History_type: "Replay",
      //   de_start: "2021-04-01 00:00:00.000",
      //   de_end: "2021-04-15 00:00:00.000",
      //   speed: false,
      // };
      if (History_type && dateStart && dateEnd && speed && veh_reg_no) {
        this.formValid = true;
        if (Date.parse(dateStart) > Date.parse(dateEnd)) {
          this.dateValid = false;
          this.formValid = false;
          this.Toast.clear()
          this.Toast.error('Start Date cannot be bigger than End Date')
        }
        if (Date.parse(dateStart) < Date.parse(dateEnd)) {
          this.dateValid = true;
          this.formValid = true;
        }
        if (this.dateValid) {
          if (this.formValid) {
            this.loading = true;
            var data = {
              veh_reg_no: veh_reg_no,
              History_type: History_type,
              de_start: dateStart,
              de_end: dateEnd,
              speed: speed,
            };
            this.historyService.DeviceHistory(data).subscribe((res) => {
              if (res.status) {
              this.historyDataService.setNewMarkers(res.data.History);
                if (res.data.History.length) {
                  // res.data.History.forEach((el, i) => {
                  //   this.markerData.push([
                  //     parseFloat(el.Latitude),
                  //     parseFloat(el.Longitude),
                  //   ]);
                  //   this.lat = parseFloat(el.Latitude);
                  //   this.lng = parseFloat(el.Longitude);
                  // });
                  this.Toast.clear()
                  this.Toast.success(res.data.ErrorMessage, res.message);
                  // map.setView([this.lat, this.lng], 10);
                  // L.polyline(this.markerData).addTo(map);
                  this.dialog.closeAll();
                  if (this.mapType == "Google Maps") {
                    $(".googleMapRecord").removeClass("d-none");
                    $('.closeHistoryGoogle').removeClass('d-none')
                  } else {
                    $(".recordDialogOffset").removeClass("d-none");
                    $('.closeHistory').removeClass('d-none')
                  }
                  $(".vehicleCard").addClass("d-none");
                  $(".vehicleCardMore").addClass("d-none");
                  $(".vehicleCardLeaflet").addClass("d-none");
                  $(".vehicleCardLeafletMore").addClass("d-none");
                } else {
                  this.Toast.clear()
                  this.Toast.error(res.data.ErrorMessage, res.message);
                  this.loading = false;
                }
              } else {
                this.Toast.clear()
                this.Toast.error(
                  "We cannot proceed to your request now please check your network connection",
                  "Error Drawing Route"
                );
              }
            });
          }
          else {
            this.Toast.clear()
            this.Toast.error('Please fillout all the fields')
          }
        }
      }
      else {
        this.Toast.clear()
        this.Toast.error('Please Fill out all the fields')
      }
    }
  }
  
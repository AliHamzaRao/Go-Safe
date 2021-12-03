import { Component, OnInit } from "@angular/core";
import { AppSettings } from "../../_core/settings/app.settings";
import { Settings } from "../../_core/settings/app.settings.model";
import { MatDialog } from "@angular/material/dialog";
import { markerService } from "src/app/_core/_AppServices/MarkerService";
import { mapTypeService } from "src/app/_core/_AppServices/MapTypeService";
import { AllDevicesDataService } from "src/app/_core/_AppServices/AllDevicesDataService";
import { historyDataService } from "src/app/_core/_AppServices/HistoryDataService";
import { SingleDeviceDataService } from "src/app/_core/_AppServices/SingleDeviceDataService";
import { ToastrService } from "ngx-toastr";
import { GeoFencingService } from "src/app/_core/_AppServices/GeoFencingService";
import { fenceTypo } from "src/app/_interfaces/fenceTypo.model";
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  public settings: Settings;
  el: any;
  map: any;
  lat = 0;
  lng = 0;
  zoom = 3;
  googleMapType = "roadmap";
  TREE_DATA: any = [];
  AllDevices: any = [];
  singleDeviceData: any = [];
  mapType: any;
  markers: any = [];
  mapBounds: any = [];
  img: any;
  message: string;
  latitude = 0;
  longitude = 0;
  interval = 1000;
  markerData = [];
  markersData = [];
  setTime: any;
  gpsTime: any;
  currentState: number = 0;
  geoFence: any;
  geoFenceData: [];
  iconUrl: string = "../../../assets/img/vendor/leaflet/new-icon/marker-icon.png";


  managerOptions = {
    drawingControl: true,
    drawingControlOptions: {
      drawingModes: ['polygon', 'circle', 'rectangle'],
    },
    polygonOptions: {
      draggable: true,
      editable: true,
    },
    rectangleOptions: {
      draggable: true,
      editable: true,
    },
    circleOptions: {
      draggable: true,
      editable: true,
    },
    drawingMode: 'polygon',
  };

  //#region Constructor
  constructor(
    public appSettings: AppSettings,
    public dialog: MatDialog,
    public markerService: markerService,
    public mapTypeService: mapTypeService,
    public AllDeviceDataService: AllDevicesDataService,
    public historyDataService: historyDataService,
    public singleDeviceDataService: SingleDeviceDataService,
    public Toast: ToastrService,
    public GeoFencingService: GeoFencingService,
  ) {
    this.settings = this.appSettings.settings;
  }
  //#endregion

  //#region OnInit Hook
  ngOnInit() {
    this.mapTypeService.newMap.subscribe((mapType) => (this.mapType = mapType));
    this.markerService.newMarkers.subscribe(
      (markers) => (this.markers = JSON.parse(markers))
    );
    // this.singleDeviceDataService.singleDevice.subscribe((data) => this.singleDeviceData = JSON.parse(data))
    this.AllDeviceDataService.AllDevices.subscribe(
      (data) => this.AllDevices = JSON.parse(data));
    this.GeoFencingService.currentFence.subscribe(data => {
      this.geoFence = new fenceTypo(JSON.parse(data));
      this.geoFenceData = { ...this.geoFence };
      if (this.geoFence.fenceParam.length) {
        this.latitude = this.geoFence.fenceParam.lat
        this.longitude = this.geoFence.fenceParam.lng
      }
    })
    $(".mapDropdown").on("change", ($event) => {
      this.mapType = $(".mapDropdown").find(":selected").val();
      this.mapTypeService.SetMap(this.mapType);
    });
    if ($('.googleMap').is(":visible")) {
      this.AllDeviceDataService.AllDevices.subscribe(
        (data) => (this.AllDevices = JSON.parse(data))
      );
    }
  }
  //#endregion
  //#region After View Init Hook
  ngAfterViewInit() {

  }
  // polygonCreated($event) {
  //   let Data = {data: ...$event };
  // }
  drawIt(e) {
    console.log(e)
    // console.log(e.bounds) //for rectangle
    // console.log(e.radius) //for circle
  }
  //#endregion
  stop() {
    $('.leaflet-marker-icon.leaflet-zoom-animated.leaflet-clickable').remove()
    $('.leaflet-marker-shadow.leaflet-zoom-animated').remove()
    this.currentState = 0;
    this.pause();
    this.interval = 1000;
    this.latitude = 0;
    this.longitude = 0;
  }
  drawLine() {
    this.historyDataService.newMarkers.subscribe(data => this.markersData = JSON.parse(data))
    this.markersData.forEach((el) => {
      this.markerData.push([el.Latitude, el.Longitude])
    })
  }
  speed() {
    if (this.markerData.length) {
      this.pause();
      clearInterval(this.interval)
      this.interval = null;
      this.interval = 1000;
      this.interval = this.interval - 500
      this.play();
    }
    else {
      clearInterval(this.interval)
      this.interval = null;
      this.interval = 1000;
      this.interval = this.interval - 500
    }
  }
  toggleDisplay() {
    $(".vehicleCard").addClass('d-none');
    $('.vehicleCardMore').addClass('d-none')
  }
  export() {
    $('.export').toggleClass('d-none')
  }
  toggleInfoCard() {
    $('.infoCard').toggleClass('d-none')
  }


  pause() {
    clearInterval(this.setTime);
    this.markerData = [];
    this.historyDataService.newMarkers.subscribe((data) => {
      this.markersData = JSON.parse(data);
    });

    this.markersData.forEach((element) => {
      this.markerData.push({
        latitude: parseFloat(element.Latitude),
        longitude: parseFloat(element.Longitude),
      });
    });
    $('.pauseBtn').addClass("d-none")
    $('.playBtn').removeClass('d-none')
  }
  play() {
    this.historyDataService.newMarkers.subscribe((data) => {
      this.markersData = JSON.parse(data);
    });
    this.markersData.forEach((element) => {
      this.markerData.push({
        latitude: parseFloat(element.Latitude),
        longitude: parseFloat(element.Longitude),
      });
    });
    $('.playBtn').addClass("d-none")
    $('.pauseBtn').removeClass("d-none")
    this.move()
  }
  move() {
    if (this.currentState !== this.markerData.length - 1) {
      this.setTime = setInterval(() => {
        this.latitude = this.markerData[this.currentState].latitude;
        this.longitude = this.markerData[this.currentState].longitude;
        this.currentState++;
        if (this.currentState === this.markerData.length - 1) {
          clearInterval(this.setTime)
          this.interval = null;
        }
      }, this.interval);
    }
  }
  //#region Selected Marker Info
  getMarkerInfo(info: any[]) {
    let singleDevice = this.AllDevices.filter(
      (item: { device_id: any }) => item.device_id === info[0]
    );
    if (singleDevice.length) {
      this.singleDeviceData = [...singleDevice];
      if ($('.recordDialogOffset').is(":visible") || $(".googleMapRecord").is(":visible")) {
        this.Toast.error("Cannot Show device detail, until History is opened", "Error Showing device Details")
        return null;
      }
      else {
        $(".vehicleCard").removeClass("d-none");
        $(".vehicleCardMore").addClass("d-none");
        if (
          $(".vehicleCard").is(":visible") ||
          $(".vehicleCardMore").is(":visible")
        ) {
          setTimeout(() => {
            this.closeDetails();
          }, 10000);
        }
      }
    }
    else {
      this.Toast.info("The Data you requested for was not found", "Data Not found")
    }
  }
  //#endregion

  //#region toggleVehicleDetailCard
  toggleInfo() {
    $(".vehicleCard").toggleClass("d-none");
    $(".vehicleCardMore").toggleClass("d-none");
  }
  closeDetails() {
    $(".vehicleCard").addClass("d-none");
    $(".vehicleCardMore").addClass("d-none");
  }
  //#endregion

  draw() {
    $(".shapeSelect").toggleClass("d-none")
  }
}
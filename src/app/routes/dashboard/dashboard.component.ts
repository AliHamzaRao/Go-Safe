import { Component, OnInit, ɵɵtrustConstantResourceUrl } from "@angular/core";
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
import { GeoFencePostService } from "src/app/_core/_AppServices/GeoFencePostingService";
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  public settings: Settings;
  map: any;
  lat = 0;
  lng = 0;
  zoom = 3;
  googleMapType = "roadmap";
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
  fenceType: any;
  polygon: any;
  rectangle: any;
  circle: any;
  iconUrl: string = "../../../assets/img/vendor/leaflet/new-icon/marker-icon.png";
  FenceParam: any;
  fenceName: any;
  countryName: any;
  cityName: any;
  gf_diff: any;
  managerOptions = {
    drawingControl: true,
    drawingControlOptions: {
      drawingModes: ['polygon', 'circle', 'rectangle'],
    },
    polygonOptions: {
      draggable: false,
      editable: false,
      strokeOpacity: "0.6",
      strokeWeight: "2",
      fillColor: "#FF0000",
      fillOpacity: "0.5"
    },
    rectangleOptions: {
      fillColor: "#2876FC",
      fillOpacity: "0.5",
      strokeColor: "#2876FC",
      strokeOpacity: "0.6",
      strokeWeight: "2"
    },
    circleOptions: {
      fillColor: "#03C291",
      fillOpacity: "0.5",
      strokeColor: "#03C291",
      strokeOpacity: "0.6",
      strokeWeight: "2",
    }
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
    public PostFence: GeoFencePostService
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
      console.log(this.geoFence)
      if (this.geoFence.fenceParam.length) {
        this.geoFence.fenceParam.forEach((item) => {
          this.latitude = item.lat
          this.longitude = item.lng
        })
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
    // alert("test")
  }
  mapLoad($event) {
    this.map = $event;
    setTimeout(() => {
      $('.gmnoprint').addClass('d-none')
    }, 3000)
  }
  drawCircle(e) {
    console.log(e)
    this.circle = e;
    let lat = e.getCenter().lat();
    let lng = e.getCenter().lng();
    let circleArr = [[lat, lng]];
    if (circleArr.length == 1) {
      $('.GooglefenceTypeSelect').val('Circle')
      this.fenceType = 'Circle'
      $('.circleField').val(e.radius);
      let param: string = "";
      this.FenceParam = circleArr.forEach((item: any[]) => {
        param = item[0] + "," + item[1]
      })
      this.FenceParam = param.slice(0, param.length - 1)
      this.gf_diff = e.radius;
    }
  }
  drawRectangle(e) {
    console.log(e)
    this.rectangle = e;
    this.rectangle.visible = false;
    console.log(this.rectangle)
    const len = e.getBounds()
    const rectArray = [[len.Ab.g, len.Ab.h], [len.Ra.g, len.Ra.h]]
    if (rectArray.length == 2) {
      $('.GooglefenceTypeSelect').val('Rectangle')
      this.fenceType = 'Rectangle'
      let param: string = "";
      this.FenceParam = rectArray.forEach((item: any[]) => {
        param += item.toString() + "|"
      })
      this.FenceParam = param.slice(0, param.length - 1)
    }
  }
  drawPolygon(e) {
    console.log(e)
    this.polygon = e;
    const len = this.polygon.getPath().getLength();
    const polyArrayLatLng = [];
    for (let i = 0; i < len; i++) {
      const vertex = this.polygon.getPath().getAt(i);
      const vertexLatLng = [vertex.lat(), vertex.lng()];
      polyArrayLatLng.push(vertexLatLng);
    }
    polyArrayLatLng.push(polyArrayLatLng[0]);
    if (polyArrayLatLng.length > 2) {
      $('.GooglefenceTypeSelect').val('Polygon')
      this.fenceType = 'Polygon'
      let param: string = "";
      this.FenceParam = polyArrayLatLng.forEach((item: any[]) => {
        param += item.toString() + "|"
      })
      this.FenceParam = param.slice(0, param.length - 1)
    }
  }
  sendPolygon() {
    this.cityName = $('.cityGoogle').val();
    this.countryName = $('.countryGoogle').val()
    this.fenceName = $('.fenceNameGoogle').val();
    let polyparams = {
      cmp_id: 0,
      cust_id: 0,
      gf_name: this.fenceName,
      gf_type: this.fenceType,
      gf_type_name: this.fenceType,
      CityNCountry: this.cityName + ', ' + this.countryName,
      FenceParam: this.FenceParam
    }
    if (this.cityName.length && this.countryName.length && this.fenceName.length) {
      this.PostFence.addGeoFence(polyparams).subscribe(data => {
        if (data.status) {
          this.Toast.success(data.message, "Polygon Created Successfully")
        }
        else {
          this.Toast.error(data.message, `Failed to execute command due to code ${data.code}`)
        }
      })
    }
    else {
      this.Toast.warning('Please Fill up all the fields', "Invalid Input")
    }
  }
  sendRectangle() {
    this.cityName = $('.cityGoogle').val();
    this.countryName = $('.countryGoogle').val()
    this.fenceName = $('.fenceNameGoogle').val();
    let rectParam = {
      cmp_id: 0,
      cust_id: 0,
      gf_name: this.fenceName,
      gf_type: this.fenceType,
      gf_type_name: this.fenceType,
      CityNCountry: this.cityName + ', ' + this.countryName,
      FenceParam: this.FenceParam
    }
    if (this.cityName.length && this.countryName.length && this.fenceName.length) {
      this.PostFence.addGeoFence(rectParam).subscribe(data => {
        if (data.status) {
          this.Toast.success(data.message, "Rectangle Created Successfully")
        }
        else {
          this.Toast.error(data.message, `Failed to execute command due to code ${data.code}`)
        }
      })
    }
    else {
      this.Toast.warning('Please Fill up all the fields', "Invalid Input")
    }
  }
  sendCircle() {

    this.cityName = $('.cityGoogle').val();
    this.countryName = $('.countryGoogle').val()
    this.fenceName = $('.fenceNameGoogle').val();
    let circleParams = {
      cmp_id: 0,
      cust_id: 0,
      gf_name: this.fenceName,
      gf_type: this.fenceType,
      gf_diff: this.gf_diff,
      gf_type_name: this.fenceType,
      CityNCountry: this.cityName + ', ' + this.countryName,
      FenceParam: this.FenceParam
    }
    if (this.cityName.length && this.countryName.length && this.fenceName.length) {
      this.PostFence.addGeoFence(circleParams).subscribe(data => {
        if (data.status) {
          this.Toast.success(data.message, "Rectangle Created Successfully")
        }
        else {
          this.Toast.error(data.message, `Failed to execute command due to code ${data.code}`)
        }
      })
    }
    else {
      this.Toast.warning('Please Fill up all the fields', "Invalid Input")
    }
  }
  onInputChange(e) {
    this.fenceType = e.target.value;
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
  closeCreateFencingGoogle() {
    // $('.gmnoprint').addClass('d-none');
    // $('.createFenceGoogleMap').addClass('d-none')
    const event = this.map.getRenderingType();
    console.log(event)
    // this.map.set(null)
  }
}
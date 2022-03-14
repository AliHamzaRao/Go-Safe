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
import { GeoFencePostService } from "src/app/_core/_AppServices/GeoFencePostingService";
import { ExportService } from "src/app/_core/_AppServices/exportService";
import { RegistrationNoService } from '../../_core/_AppServices/RegistrationNoService';
import { Router } from "@angular/router";
import { City, Country, GeoFenceVM } from '../../_interfaces/DBresponse.model';
import { CityService } from '../../_core/_AppServices/City.service';
import { CountryService } from '../../_core/_AppServices/Country.service';
declare const google: any;
var Historydata = [];
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  public settings: Settings;
  map: any;
  lat = 31.4884152;
  lng = 74.3704655;
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
  geoFenceData:GeoFenceVM;
  fenceType: any;
  polygon: any;
  rectangle: any;
  circle: any;
  iconUrl: string =
    "./assets/img/vendor/google-maps/car-marker.png";
  FenceParam: any;
  fenceName: any;
  countryName: any;
  cityName: any;
  gf_diff: any;
  nullplgn: any;
  nullcircle: any;
  nullrect: any;
  managerOptions = {
    drawingControl: true,
    drawingMode: null,
    drawingControlOptions: {
      drawingModes: ["circle", "polygon", "rectangle"],
    },
    polygonOptions: {
      draggable: false,
      editable: false,
      strokeOpacity: "0.6",
      strokeWeight: "2",
      fillColor: "#FF0000",
      fillOpacity: "0.5",
    },
    rectangleOptions: {
      fillColor: "#2876FC",
      fillOpacity: "0.5",
      strokeColor: "#2876FC",
      strokeOpacity: "0.6",
      strokeWeight: "2",
    },
    circleOptions: {
      fillColor: "#03C291",
      fillOpacity: "0.5",
      strokeColor: "#03C291",
      strokeOpacity: "0.6",
      strokeWeight: "2",
    },
  };

  historyInfo: any = {
    GPSDateTime: "test",
    Speed: "0",
    RPM: "test",
    ACC: "test",
    Alarm: "test",
    Status: "test",
    Dir: "test",
    Distance: "test",
    Latitude: "test",
    Longitude: "test",
    Location: "test",
    RECDateTime: "test",
    Index: -1,
  };
  reg_no: string = "";
  AllCountries: Country[];
  AllCities: City[];
  AvailableCities: City[];
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
    public PostFence: GeoFencePostService,
    public ExportService: ExportService,
    public RegistrationNoService: RegistrationNoService,
    public Router: Router,
    public CityService: CityService,
    public CountryService : CountryService
  ) {
    this.settings = this.appSettings.settings;
  }
  //#endregion

  //#region OnInit Hook
  ngOnInit() {
    this.mapTypeService.newMap.subscribe((mapType) => (this.mapType = mapType));
    this.RegistrationNoService.regNumber.subscribe((data) => {

      this.reg_no = data
    })
    this.markerService.newMarkers.subscribe(
      (markers) => (this.markers = markers)
    );
    this.singleDeviceDataService.singleDevice.subscribe((data) => this.singleDeviceData = data);
    this.AllDeviceDataService.AllDevices.subscribe(
      (data) => (this.AllDevices = data)
    );
    this.GeoFencingService.currentFence.subscribe((data: GeoFenceVM) => { 
      this.geoFenceData = data;
      if (data.fenceParam.length) {
        data.fenceParam.forEach((item) => {
          this.lat = item.lat;
          this.lng = item.lng;
        });
      }
    });
    this.historyDataService.newMarkers.subscribe((data) => {
      this.markersData = data;
      Historydata = this.markersData
    });
    this.CountryService.getCountries().subscribe(data=>{
      if(data.status){
        this.AllCountries = data.data
      }
    })
    $(".mapDropdown").on("change", ($event) => {
      this.mapType = $(".mapDropdown").find(":selected").val();
      this.mapTypeService.SetMap(this.mapType);
    });
    if ($(".googleMap").is(":visible")) {
      this.AllDeviceDataService.AllDevices.subscribe(
        (data) => (this.AllDevices = data)
      );
    }
    if(window.location.pathname != '/createfence' ){
    setTimeout(() => {
      $(".gmnoprint").addClass("d-none");
    }, 3000);
  }
  }
  //#endregion

  //#region After View Init Hook
  ngAfterViewInit() {
  }
  mapLoad(e) {
    this.map = e;
    if (window.location.pathname != '/createfence') {
      $(".gmnoprint").removeClass("d-none");
    }
  }
  onCoutryChange = (e)=>{
    console.log(e.target.value)
    this.countryName = e.target.value
    this.AvailableCities = this.AllCities.filter((cities:City)=>cities.cnt_id == this.countryName)
    console.log(this.AvailableCities)
  }
  onCityChange = (e)=>{
    this.cityName = e.target.value  
  }
  drawCircle(e) {
    if (this.circle) {
      this.circle.setMap(null)
    }
    if (this.rectangle) {
      this.rectangle.setMap(null)
    }
    this.circle = e;
    let lat = e.getCenter().lat();
    let lng = e.getCenter().lng();
    let circleArr = [[lat, lng]];
    if (circleArr.length == 1) {
      $(".GooglefenceTypeSelect").val("Circle");
      this.fenceType = "Circle";
      $(".circleField").val(e.radius);
      let param: string = "";
      this.FenceParam = circleArr.forEach((item: any[]) => {
        param = item[0] + "," + item[1];
      });
      this.FenceParam = param.slice(0, param.length - 1);
      this.gf_diff = e.radius;
    }
  }
  drawRectangle(e) {
    if (this.rectangle) {
      this.rectangle.setMap(null)
    }
    if (this.circle) {
      this.circle.setMap(null)
    }
    this.rectangle = e;
    const len = e.getBounds();
    const rectArray = [
      [len.Ab.g, len.Ra.g],
      [len.Ab.h, len.Ra.h],
    ];
    if (rectArray.length == 2) {
      $(".GooglefenceTypeSelect").val("Rectangle");
      this.fenceType = "Rectangle";
      let param: string = "";
      this.FenceParam = rectArray.forEach((item: any[]) => {
        param += item.toString() + "|";
      });
      this.FenceParam = param.slice(0, param.length - 1);
    }
  }
  drawPolygon(e) {
    this.managerOptions.drawingMode = null;
    // this.Router.navigateByUrl('/asset-trip-trip', { skipLocationChange: true }).then(() => {
    //   this.Router.navigate(['/']);
    // });
    if (this.circle) {
      this.circle.setMap(null)
    }
    if (this.rectangle) {
      this.rectangle.setMap(null)
    }
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
      $(".GooglefenceTypeSelect").val("Polygon");
      this.fenceType = "Polygon";
      let param: string = "";
      this.FenceParam = polyArrayLatLng.forEach((item: any[]) => {
        param += item.toString() + "|";
      });
      this.FenceParam = param.slice(0, param.length - 1);
    }
  }
  sendPolygon() {
    // this.cityName = $(".cityGoogle").val();
    // this.countryName = $(".countryGoogle").val();
    this.fenceName = $(".fenceNameGoogle").val();
    let polyparams = {
      cmp_id: 0,
      cust_id: 0,
      gf_name: this.fenceName,
      gf_type: this.fenceType,
      gf_type_name: this.fenceType,
      CityNCountry: this.cityName + ", " + this.countryName,
      FenceParam: this.FenceParam,
    };
    if (this.fenceName.length) {
      this.PostFence.addGeoFence(polyparams).subscribe((data) => {
        if (data.status) {
          this.Toast.success(data.message, "Polygon Created Successfully");
        } else {
          this.Toast.error(
            data.message,
            `Failed to execute command due to code ${data.code}`
          );
        }
      });
    } else {
      this.Toast.warning("Please Fill up all the fields", "Invalid Input");
    }
  }
  sendRectangle() {
    // this.cityName = $(".cityGoogle").val();
    // this.countryName = $(".countryGoogle").val();
    this.fenceName = $(".fenceNameGoogle").val();
    let rectParam = {
      cmp_id: 0,
      cust_id: 0,
      gf_name: this.fenceName,
      gf_type: this.fenceType,
      gf_type_name: this.fenceType,
      CityNCountry: this.cityName + ", " + this.countryName,
      FenceParam: this.FenceParam,
    };
    if (this.fenceName.length) {
      this.PostFence.addGeoFence(rectParam).subscribe((data) => {
        if (data.status) {
          this.Toast.success(data.message, "Rectangle Created Successfully");
        } else {
          this.Toast.error(
            data.message,
            `Failed to execute command due to code ${data.code}`
          );
        }
      });
    } else {
      this.Toast.warning("Please Fill up all the fields", "Invalid Input");
    }
  }
  sendCircle() {
    // this.cityName = $(".cityGoogle").val();
    // this.countryName = $(".countryGoogle").val();
    this.fenceName = $(".fenceNameGoogle").val();
    let circleParams = {
      cmp_id: 0,
      cust_id: 0,
      gf_name: this.fenceName,
      gf_type: this.fenceType,
      gf_diff: this.gf_diff,
      gf_type_name: this.fenceType,
      CityNCountry: this.cityName + ", " + this.countryName,
      FenceParam: this.FenceParam,
    };
    if (this.fenceName.length) {
      this.PostFence.addGeoFence(circleParams).subscribe((data) => {
        if (data.status) {
          this.Toast.success(data.message, "Rectangle Created Successfully");
        } else {
          this.Toast.error(
            data.message,
            `Failed to execute command due to code ${data.code}`
          );
        }
      });
    } else {
      this.Toast.warning("Please Fill up all the fields", "Invalid Input");
    }
  }
  onInputChange(e) {
    this.fenceType = e.target.value;
  }
  //#endregion
  stop() {
    $(".leaflet-marker-icon.leaflet-zoom-animated.leaflet-clickable").remove();
    $(".leaflet-marker-shadow.leaflet-zoom-animated").remove();
    this.currentState = 0;
    this.pause();
    this.interval = 1000;
    this.latitude = 0;
    this.longitude = 0;
  }
  speed() {
    if (this.markerData.length) {
      this.pause();
      clearInterval(this.interval);
      this.interval = null;
      this.interval = 1000;
      this.interval = this.interval - 500;
      this.play();
    } else {
      clearInterval(this.interval);
      this.interval = null;
      this.interval = 1000;
      this.interval = this.interval - 500;
    }
  }
  toggleDisplay() {
    $(".vehicleCard").addClass("d-none");
    $(".vehicleCardMore").addClass("d-none");
  }
  export() {
    $(".export").toggleClass("d-none");
  }
  exportToExcel() {
    this.historyDataService.newMarkers.subscribe((data) => {
      this.markersData = data
      Historydata = this.markersData
    });
    this.ExportService.downloadExcelFile(Historydata, this.reg_no);
  }
  exportToPDF() {
    this.historyDataService.newMarkers.subscribe((data) => {
      this.markersData = data
      Historydata = this.markersData
    });
    this.ExportService.downloadPDF(Historydata, this.reg_no);
  }
  toggleInfoCard() {
    $(".infoCard").toggleClass("d-none");
  }

  pause() {
    clearInterval(this.setTime);
    this.markerData = [];
    this.historyDataService.newMarkers.subscribe((data) => {
      this.markersData = data
    });

    this.markersData.forEach((element, index) => {
      this.markerData.push({
        latitude: parseFloat(element.Latitude),
        longitude: parseFloat(element.Longitude),
      });
    });
    $(".pauseBtn").addClass("d-none");
    $(".playBtn").removeClass("d-none");
  }
  play() {
    
    this.markersData.forEach((element) => {
      this.markerData.push({
        latitude: parseFloat(element.Latitude),
        longitude: parseFloat(element.Longitude),
      });
    });
    $(".playBtn").addClass("d-none");
    this.move();
    $(".pauseBtn").removeClass("d-none");
  }
  move() {
    if (this.currentState !== this.markerData.length - 1) {
      this.setTime = setInterval(() => {
        this.latitude = this.markerData[this.currentState].latitude;
        this.longitude = this.markerData[this.currentState].longitude;
        this.historyInfo = Historydata[this.currentState];
        this.currentState++;
        if (this.currentState === this.markerData.length - 1) {
          clearInterval(this.setTime);
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
      if (
        $(".recordDialogOffset").is(":visible") ||
        $(".googleMapRecord").is(":visible")
      ) {
        this.Toast.error(
          "Cannot Show device detail, until History is opened",
          "Error Showing device Details"
        );
        return null;
      } else {
        $(".vehicleCard").removeClass("d-none");
        $(".vehicleCardMore").addClass("d-none");
      }
    } else {
      this.Toast.info(
        "The Data you requested for was not found",
        "Data Not found"
      );
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
  CloseHistory() {
    $(".googleMapRecord").addClass("d-none");
    $('.closeHistoryGoogle').addClass('d-none')
    this.Router.navigateByUrl('/asset-trip-trip', { skipLocationChange: true }).then(() => {
      this.Router.navigate(['/']);
      $(".gmnoprint").addClass("d-none");
    })
  }
  closeCreateFencingGoogle() {
    this.Router.navigate(['/'])
  }
  RemoveFencing() {
    this.Router.navigate(['/']).then(() => {
      this.Router.navigate(['/showgeofence'])
    })
  }
}

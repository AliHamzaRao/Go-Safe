import { Component, OnInit, Input } from "@angular/core";
import { AppSettings } from "../../_core/settings/app.settings";
import { Settings } from "../../_core/settings/app.settings.model";
import { dashboardService } from "../../_core/_AppServices/dashboard.service";
import { ActivatedRoute, Router } from "@angular/router";
import { PacketParser } from "./PacketParser";
import { MatDialog } from "@angular/material/dialog";
import "leaflet-map";
import { markerService } from "src/app/_core/_AppServices/MarkerService";
import { mapTypeService } from "src/app/_core/_AppServices/MapTypeService";
import { AllDevicesDataService } from "src/app/_core/_AppServices/AllDevicesDataService";
import { historyDataService } from "src/app/_core/_AppServices/HistoryDataService";
// declare var L;
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
  zoom = 6;
  googleMapType = "roadmap";
  TREE_DATA: any = [];
  AllDevices: any = [];
  singleDeviceData: any = [];
  mapType: any;
  markers: any = [];
  mapBounds: any = [];
  img: any;
  message: string;
  latitude = 31.488415;
  longitude = 74.370465;
  interval = 500;
  markerData = [];
  markersData = [];
  setTime: any;
  gpsTime: any;
  currentState: number = 0;
  //#region Constructor
  constructor(
    private dashboardSer: dashboardService,
    private router: Router,
    public route: ActivatedRoute,
    public appSettings: AppSettings,
    public dialog: MatDialog,
    public markerService: markerService,
    public mapTypeService: mapTypeService,
    public AllDeviceDataService: AllDevicesDataService,
    public historyDataService: historyDataService
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
    this.AllDeviceDataService.AllDevices.subscribe(
      (data) => (this.AllDevices = JSON.parse(data))
    );

    // this.route.data.subscribe((data) => {
    //   data["model"].data.forEach((item: any, index: any) => {
    //     this.TREE_DATA.push(item);
    //   });
    //   this.TREE_DATA[1].SubMenu.sort((a: { grp_name: number; }, b: { grp_name: number; }) => (a.grp_name > b.grp_name) ? 1 : ((b.grp_name > a.grp_name) ? -1 : 0))
    // });
    // this.treed();
    // this.mapType = $(".mapDropdown").find(':selected').val()
    $(".mapDropdown").on("change", ($event) => {
      // this.mapTypeService.newMap.subscribe((mapType) => this.mapType = mapType)
      //   this.markerService.newMarkers.subscribe((markers) => this.markers = JSON.parse(markers))
      //   // this.markerService.newMarkers.subscribe((markers) => this.markers = JSON.parse(markers))
      //   // this.markers = JSON.parse(this.message)
      //   // this.mapInfo.sendData("New Message")
      //   $(".vehicleCard").addClass('d-none');
      //   $('.vehicleCardMore').addClass('d-none')
      //   $('.agm-map-container-inner').addClass('rounded')
      this.mapType = $(".mapDropdown").find(":selected").val();
      this.mapTypeService.SetMap(this.mapType);
      //   this.loadLeafLetMap();
      //   setTimeout(() => {
      //     this.setLeafLetMarkers();
      //   }, 1000);
    });
  }
  //#endregion
  //#region After View Init Hook
  ngAfterViewInit() {
    // this.loadLeafLetMap();
  }
  //#endregion

  //#region Load Leaflet Map
  // loadLeafLetMap() {
  //   setTimeout(() => {
  //     this.el = document.getElementById("leaflet-map");
  //     L.Icon.Default.imagePath = 'assets/img/vendor/leaflet/';
  //     this.map = L.map(this.el).setView([this.lat, this.lng], 10);
  //     L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(this.map);
  //   });
  // }
  //#endregion
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
    // this.interval = this.interval - 200;
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
    this.move()
    // setInterval(() => {
    //   this.move()
    // }, 1000)
  }
  move() {
    if (this.currentState !== this.markerData.length - 1) {
      this.setTime = setInterval(() => {
        this.latitude = this.markerData[this.currentState].latitude;
        this.longitude = this.markerData[this.currentState].longitude;
        console.log(this.latitude, this.longitude, this.currentState, this.markerData.length)
        this.currentState++;
        console.log(this.interval)
        if (this.currentState === this.markerData.length - 1) {
          clearInterval(this.setTime)
          this.interval = null;
        }
      }, this.interval);

    }
  }
  //#region Set Markers to Leaflet Maps
  // setLeafLetMarkers() {
  //   this.markers.forEach((element: any, index: string | number) => {
  //     if (this.markers[index][1] === '0', this.markers[index][2] === '0') {
  //       return false;
  //     }
  //     else {
  //       new L.marker([this.markers[index][1], this.markers[index][2]])
  //         .addTo(this.map).on('click', () => {
  //           this.getMarkerInfo([this.markers[index][0], this.markers[index][1], this.markers[index][2]])
  //         })
  //       // $('.leaflet-marker-icon.leaflet-zoom-animated.leaflet-clickable').attr('id',this.markers[index][0])
  //       this.map.setView([this.lat, this.lng], 12);
  //       this.mapBounds.push([this.markers[index][1], this.markers[index][2]])
  //       this.map.fitBounds(this.mapBounds);
  //     }
  //   });
  // }
  //#endregion

  //#region Selected Marker Info
  getMarkerInfo(data: any[]) {
    // this.markerService.SetMarkers(JSON.parse(this.markers));
    let singleDevice = this.AllDevices.filter(
      (item: { device_id: any }) => item.device_id === data[0]
    );
    this.singleDeviceData = [...singleDevice];
    // this.map.setView([data[1], data[2]], 20)
    // this.lat = data[1];
    // this.lng = data[2];
    $(".vehicleCard").removeClass("d-none");
    $(".vehicleCardMore").addClass("d-none");
  }
  //#endregion

  //#region CloseDetails Card
  // closeDetails() {
  //   $('.vehicleCard').addClass('d-none')
  //   $('.vehicleCardMore').addClass('d-none')
  // }
  //#endregion

  //#region OnCheckBox
  // onCheck(e, DataTrack: string, _id: any) {
  //   $(".vehicleCard").addClass('d-none');
  //   $('.vehicleCardMore').addClass('d-none')
  //   let marker: string[];
  //   if (e.target.checked) {
  //     let newPacketParse = new PacketParser(DataTrack);
  //     let data = { ...newPacketParse };
  //     this.lat = parseFloat(data.lat);
  //     this.lng = parseFloat(data.lng);
  //     marker = [data.device_id, data.lat, data.lng];
  //     this.markers.push(marker);
  //     this.AllDevices.push(data);
  //     this.setLeafLetMarkers();
  //   }
  //   else {
  //     this.closeDetails();
  //     this.map.remove();
  //     this.loadLeafLetMap();
  //     setTimeout(() => {
  //       this.setLeafLetMarkers();
  //     }, 1000)
  //     let index = this.AllDevices.findIndex((item: { device_id: any; }) => item.device_id === _id)
  //     this.AllDevices.splice(index, 1)
  //     let MarkerIndex = this.markers.findIndex((item: any[]) => item[0] === _id);
  //     this.markers.splice(MarkerIndex, 1)
  //     if (!this.AllDevices.length) {
  //       $('.vehicleCard').addClass('d-none')
  //     }
  //   }
  // }
  //#endregion

  //#region toggleVehicleDetailCard
  toggleInfo() {
    $(".vehicleCard").toggleClass("d-none");
    $(".vehicleCardMore").toggleClass("d-none");
  }
  //#endregion

  //#region GetVehicleTreeList
  // GetVehicleTreeList() {
  //   this.dashboardSer.GetVehiclesTree().subscribe((res: any) => {
  //     res.data.forEach((item: any, index: any) => {
  //       this.TREE_DATA.push(item);
  //     });
  //   });
  // }
  //#endregion

  //#region initTree
  // treed() {
  //   $(document).ready(function () {
  //     $("#tree3").each(function () {
  //       var openedClass = "glyphicon-chevron-down";
  //       var closedClass = "glyphicon-chevron-right";
  //       var tree = $(this);
  //       tree.addClass("tree");
  //       tree
  //         .find("li")
  //         .has("ul")
  //         .each(function () {
  //           var branch = $(this);
  //           branch.prepend(
  //             "<i class='indicator glyphicon " + closedClass + "'></i>"
  //           );
  //           branch.addClass("branch");
  //           branch.on("click", function (e) {
  //             if (this == e.target) {
  //               var icon = $(this).children("i:first");
  //               icon.toggleClass(openedClass + " " + closedClass);
  //               $(this).children().children().toggle();
  //             }
  //           });
  //           branch.children().children().toggle();
  //         });
  //       tree.find(".branch .indicator").each(function () {
  //         $(this).on("click", function () {
  //           $(this).closest("li").click();
  //         });
  //       });
  //       tree.find(".branch>a").each(function () {
  //         $(this).on("click", function (e) {
  //           $(this).closest("li").click();
  //           e.preventDefault();
  //         });
  //       });
  //       tree.find(".branch>button").each(function () {
  //         $(this).on("click", function (e) {
  //           $(this).closest("li").click();
  //           e.preventDefault();
  //         });
  //       });
  //     });
  //   });
  // }
  //#endregion
}

import { Component, OnInit, ViewChild, HostListener, ViewChildren, QueryList, OnDestroy, Output } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { PerfectScrollbarDirective } from "ngx-perfect-scrollbar";
import { AppSettings } from "../../_core/settings/app.settings";
import { Settings } from "../../_core/settings/app.settings.model";
import { MenuService } from "src/app/theme/components/menu/menu.service";
import { PacketParser } from '../dashboard/PacketParser';
import { MatDialog } from "@angular/material/dialog";
import { markerService } from "src/app/_core/_AppServices/MarkerService";
import { mapTypeService } from "src/app/_core/_AppServices/MapTypeService";
import { AllDevicesDataService } from "src/app/_core/_AppServices/AllDevicesDataService";
import { historyDataService } from "src/app/_core/_AppServices/HistoryDataService";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { ToastrService } from "ngx-toastr";
import { SingleDeviceDataService } from "src/app/_core/_AppServices/SingleDeviceDataService";
import { GeoFenceService } from "src/app/_core/_AppServices/GeoFenceService";
import { GeoFencingService } from "src/app/_core/_AppServices/GeoFencingService";
import "leaflet";
import { AlarmsService } from "src/app/_core/_AppServices/AlarmsService";
import { GeoFencePostService } from "src/app/_core/_AppServices/GeoFencePostingService";
import { ExportService } from "src/app/_core/_AppServices/exportService";
import { Vehicles } from "src/app/_interfaces/vehicle.model";
import { dashboardService } from "src/app/_core/_AppServices/dashboard.service";
import { RegistrationNoService } from '../../_core/_AppServices/RegistrationNoService';
import { CurrentStateService } from '../../_core/_AppServices/CurrentStateService';
import { Alarm, GeoFence, History } from '../../_interfaces/DBresponse.model';
import { AllControlsDialogComponent } from "./Dialogs/AllControlsDialog/AllControlsDialog.component"
import { AllSettingsDialogComponent } from "./Dialogs/AllSettingsDialog/AllSettingsDialog.component"
import { DeviceIdService } from '../../_core/_AppServices/DeviceId.service';
import { AssetTripDialogComponent } from "./Dialogs/ReportsDialogs/AssetTripDialog/AssetTripDialog.component";
import { historyDialogComponent } from './Dialogs/HistoryDialog/historyDialog.component';
// Global Variables
declare var L;
var map;
var el;
var mapType;
var rect;
var circle;
var plgn;
var marker;
var dataArr: PacketParser[] = [];
// Global Variables
@Component({
  selector: "app-pages",
  templateUrl: "./pages.component.html",
  styleUrls: ["./pages.component.scss"],
  providers: [MenuService],
})
export class PagesComponent implements OnInit, OnDestroy {
  //#region Properties
  public settings: Settings;
  location: string = window.location.pathname
  reg_no:string;
  dev_id:string;
  treeLoaded: boolean = false;
  username: string;
  logo: string;
  lat = 31.4884152;
  lng = 74.3704655;
  zoom = 2;
  TREE_DATA: Vehicles[] = [];
  AllDevices: PacketParser[] = [];
  singleDeviceData: any = [];
  markers: any[] = [];
  mapBounds: any = [];
  newPacketParse: any;
  data: any;
  latitude: 0;
  longitude: 0;
  interval: number = 1000;
  markerData = [];
  markersData = [];
  currentState: number = 0;
  setTime: any;
  marker: any;
  notifications: Alarm[] = [];
  alarmsFound: boolean = false;
  geoFences: GeoFence[];
  searchedFences: GeoFence[] = [];
  fenceType: any;
  rectMarkers: any[] = [];
  polyMarkers: any[] = [];
  rectangle: any;
  polygon: any;
  circleRadius: any;
  FenceParam: any;
  cityName: any;
  countryName: any;
  fenceName: any;
  circleMarkers: any[] = [];
  currentMap = mapType;
  newCircle: any;
  checkedDevices: any[] = [];
  AllMarkers: any[] = [];
  childArray: Vehicles[] = [];
  isVehicles: boolean = false;
  isgeofence: boolean = false;
  isHistory: boolean = false;
  listLoading:boolean = true;
  onlineDevices: PacketParser[] = [];
  offlineDevices: PacketParser[] = [];
  AllVehicles: PacketParser[] = [];
  OnlineGroups: any[] = [];
  idArr: number[] = []
  SearchedDevices: PacketParser[] = []
  fenceListLoaded: boolean = false;
  polylineMarkers: any[] = [];
  historyInfo: History = {
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
  CarMarker = L.icon({
    iconUrl: './assets/img/vendor/google-maps/car-marker.png',
    iconSize:     [23, 50], 
    iconAnchor:   [ 0, 0], 
    // popupAnchor: [, ]
  });
  updateTree:any;
  @ViewChild(DashboardComponent, { static: true }) child: DashboardComponent;
  @ViewChild("sidenav") sidenav: any;
  @ViewChild("backToTop") backToTop: any;
  @ViewChildren(PerfectScrollbarDirective)
  pss: QueryList<PerfectScrollbarDirective>;
  public menus = ["vertical", "horizontal"];
  public menuOption: string;
  public menuTypes = ["default", "compact", "mini"];
  public menuTypeOption: string;
  public lastScrollTop: number = 0;
  public showBackToTop: boolean = false;
  public toggleSearchBar: boolean = false;
  private defaultMenu: string;
  //#endregion
  constructor(
    public appSettings: AppSettings,
    public router: Router,
    private menuService: MenuService,
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public markersService: markerService,
    public mapTypeService: mapTypeService,
    public AllDeviceDataService: AllDevicesDataService,
    public GeoFence: GeoFenceService,
    public historyDataService: historyDataService,
    public singleDeviceDataService: SingleDeviceDataService,
    public GeoFencingService: GeoFencingService,
    public Toast: ToastrService,
    public Alarms: AlarmsService,
    public PostFence: GeoFencePostService,
    public ExportService: ExportService,
    public dashboardService: dashboardService,
    public RegistrationNoService: RegistrationNoService,
    public CurrentStateService: CurrentStateService,
    public DeviceIdService: DeviceIdService
  ) {
    this.settings = this.appSettings.settings;
  }
  //#region OnInit
  ngOnInit() {
    this.ResetData();
    if (window.location.pathname == "/vehicles") {
      this.isVehicles = true;
    }
    if (window.location.pathname == "/showgeofence") {
      this.markersService.SetMarkers([[0, 0, 0]])
      this.isgeofence = true;
      this.GeoFencing();
      this.closeHistoryDialog();
      this.closeHistory();
      this.stop()
    }
    if (window.location.pathname == "/createfence") {

      this.isgeofence = true;
      this.CreateFencing()
      this.closeHistoryDialog();
      this.closeHistory();
      this.stop()
    }

    this.logo = localStorage.CompanyLogo ? 'data:image/png;base64,' + localStorage.getItem("CompanyLogo") : './assets/logos/logo 1-01.svg';
    this.username = localStorage.getItem("username") || null;
    this.mapTypeService.newMap.subscribe((data) => {
      mapType = data;
    });
    this.historyDataService.newMarkers.subscribe(
      (data) => {
        this.markersData = data
        if (data.length > 0)
          if (this.markersData.length) {
            this.isHistory = true
            this.markersData.forEach((el, i) => {
              this.polylineMarkers.push([
                parseFloat(el.Latitude),
                parseFloat(el.Longitude),
              ]);
              this.lat = parseFloat(el.Latitude);
              this.lng = parseFloat(el.Longitude);
            });
            map.setView([this.lat, this.lng], 10);
            L.polyline(this.polylineMarkers).addTo(map);
          }
      });
    this.AllDeviceDataService.AllDevices.subscribe((data) => (this.AllDevices = data));
    this.getVehTree();
    if(map){
      map.off()
    this.RefreshMap();
  }
    this.updateTree = setInterval(() => {
      if(!this.isgeofence || !this.isHistory){
        this.ResetData();
        this.getVehTree()
      }
      }, 60000)
      this.updateTree;
    this.currentMap = mapType;
    if (window.innerWidth <= 768) {
      this.settings.menu = "vertical";
      this.settings.sidenavIsOpened = false;
      this.settings.sidenavIsPinned = false;
    }
    this.menuOption = this.settings.menu;
    this.menuTypeOption = this.settings.menuType;
    this.defaultMenu = this.settings.menu;
  }
  //#endregion

  //#region TabChangeEvent
  tabChanged(e, devices = this.checkedDevices) {

    if (devices.length) {
      this.listLoading = true;
        devices.forEach((item) => {
          $(`[data-device_id]`).each((param, el) => {
            if (item.id == el.id) {
              console.log(item.id == el.id);
              $(el).prop('checked', true)
            }
            else {
              $(`#${el.id}`).removeProp('checked')
            }
          })
        })
      this.listLoading = false;
    }
  }
  expandedPanel(e) {
    if (this.checkedDevices.length) {
      setTimeout(() => {
        this.checkedDevices.forEach((item) => {
          $(`[data-device_id= ${item.id}]`).prop('checked', true)
        })
      })
    }
  }

  ResetData() {
    this.notifications = []
    dataArr = [];
    this.offlineDevices = [];
    this.onlineDevices = []
    this.childArray = [];
    this.OnlineGroups = [];
    this.markers = [];
    this.AllDevices = [];
    this.AllVehicles = [];
    this.AllMarkers = [];
    $('.notificationsUnread').addClass('d-none')
    $(".notificationPanel").addClass("d-none");
    $(".notificationsRead").addClass("d-none")
  }
  //#endregion

  //#region MapType change Event
  MapType(e) {
    mapType = e.target.innerText;
    this.mapTypeService.SetMap(mapType);
    this.currentMap = mapType;
    if(mapType == 'Google Maps'){
      map.off()
    }
    $(".selectionList").addClass("d-none");;
    $(".vehicleCard").addClass("d-none");
    $(".vehicleCardMore").addClass("d-none");
    $(".vehicleCardLeaflet").addClass("d-none");
    $(".vehicleCardLeafletMore").addClass("d-none");
    $(".agm-map-container-inner").addClass("rounded");
    if (mapType === "Google Maps" && $(".recordDialogOffset").is(":visible")) {
      $(".recordDialogOffset").toggleClass("d-none");
      $(".googleMapRecord").toggleClass("d-none");
    }
    if (
      mapType === "Open Street Maps" &&
      $(".googleMapRecord").is(":visible")
    ) {
      $(".recordDialogOffset").toggleClass("d-none");
      $(".googleMapRecord").toggleClass("d-none");
      setTimeout(() => {
        this.setLeafLetMarkers();
      }, 1000);
    }
    if (mapType === "Google Maps" && $(".createFence").is(":visible")) {
      $(".createFenceGoogleMap").remove("d-none");
      $(".createFence").addClass("d-none");
    }
    if (
      mapType === "Open Street Maps" &&
      $(".createFenceGoogleMap").is(":visible")
    ) {
      $(".createFence").removeClass("d-none");
      $(".createFenceGoogleMap").addClass("d-none");
    }
    if (mapType == "Open Street Maps") {
      this.RefreshMap();
      setTimeout(() => {
        this.setLeafLetMarkers();
      }, 1000);
    }
  }
  //#endregion
  SearchQueryChange($event) {
    let query: string = $event.target.value
    if (query.length) {
      this.SearchedDevices = this.AllVehicles.filter((item: PacketParser) => item.veh_reg_no.includes(query.toUpperCase()))
    }
    else {
      this.SearchedDevices = [];
    }
  }
  //#region Get Veh Data
  getVehTree() {
    let obj;
    let innerobj;
    try {
      this.treeLoaded = false;
      // this.route.data.subscribe((data) => {
      //   data["model"].data.forEach((item: any, index: any) => {
      //     this.TREE_DATA.push(item);
      //   });
      //   this.TREE_DATA[1].SubMenu.sort(
      //     (a: { grp_name: number }, b: { grp_name: number }) =>
      //       a.grp_name > b.grp_name ? 1 : b.grp_name > a.grp_name ? -1 : 0
      //   );
      // });
      this.dashboardService.GetVehiclesTree().subscribe((data) => {
        if (data.status) {
          dataArr=[];
          this.TREE_DATA = data.data;
          this.TREE_DATA[1].SubMenu.forEach((menu: Vehicles) => {
            let dataTrack;
            let parsed;
            if (menu.grp_name == null && menu.SubMenu.length == 0) {
              this.childArray.push(menu)
              dataTrack = menu.datatrack;
              parsed = dataTrack ? new PacketParser(dataTrack) : null
              parsed ? dataArr.push({ ...parsed }) : null;
            }
            else if (menu.grp_name != null && menu.SubMenu.length > 0) {
              menu.SubMenu.forEach((item: Vehicles) => {
                if (item.grp_name == null && item.SubMenu.length == 0) {
                  this.childArray.push(item)
                  dataTrack = item.datatrack
                  parsed = dataTrack ? new PacketParser(dataTrack) : null
                  parsed ? dataArr.push({ ...parsed }) : null;
                }
                else if (item.grp_name != null && item.SubMenu.length != 0) {
                  item.SubMenu.forEach((moreItem: Vehicles) => {
                    this.childArray.push(moreItem)
                    dataTrack = moreItem.datatrack
                    parsed = dataTrack ? new PacketParser(dataTrack) : null
                    parsed ? dataArr.push({ ...parsed }) : null;
                  })
                }
              })
            }
          });

        } else {
          this.Toast.clear()
          this.Toast.error(data.message, `Error Code ${data.code}`);
        }
        setTimeout(() => {
          this.AllVehicles = [];
          this.AllVehicles = dataArr;
          if (dataArr.length) {
            dataArr.forEach((item: PacketParser) => {
              if (item.Online == '1') {
                obj = this.TREE_DATA[1].SubMenu.find((data: Vehicles) => data.grp_id.toString() == item.group_id)
                obj.OnlineDevice = [];
                innerobj = obj.SubMenu.find((value: Vehicles) => value.device_id == item.device_id)
                if (innerobj['device_id'] == item.device_id) {
                  obj.OnlineDevice.push(item)
                  this.OnlineGroups.push(obj)
                  if (this.OnlineGroups.length) {
                    this.OnlineGroups.forEach((tempGP: Vehicles) => {
                      if (tempGP.grp_name !== obj.grp_name) {
                        this.OnlineGroups.push(obj)
                      }
                    })
                  }
                }
                this.onlineDevices.push(item)
              }
              else if (item.Online == '0') {
                this.offlineDevices.push(item)
              }
            })
          }
          if (this.checkedDevices.length !== 0) {
            this.AllMarkers.forEach((thismarker) => {
              map.removeLayer(thismarker)
            })
            this.markers = []
            this.setLeafLetMarkers();
            setTimeout(() => {
              this.checkedDevices.forEach((item) => {
                let tempObj = dataArr.find((Data: PacketParser) => Data.device_id == item.id)
                $(`[data-device_id= ${item.id}]`).prop('checked', true)
                this.MarkerSettingFunction(item.event, tempObj.dataTrack, item.id)
              })
            });
          }
          setTimeout(() => {
            $('.ref-location').each(function () {
              var refLo = $(this).attr('data-refLocation');
              var obj2 = dataArr.find(
                (item: PacketParser) => item.device_id == refLo
              );
              obj2 ? $(this).html(`<abbr title=${obj2.ref_location}>${obj2.ref_location}</abbr>`) : null;
            })
            $(".speedCheck").each(function () {
              var vehicle = $(this).attr("data-idforspeed");
              var obj = dataArr.find(
                (item: PacketParser) => item.device_id == vehicle
              );
              obj ? $(this).html(`${obj.speed} <br><span style="font-size:12px">km/h</span>`) : null;
            });
            $(".veh_status").each(function () {
              var device = $(this).attr("device-id-vrn");
              var object = dataArr.find(
                (item: PacketParser) => item.device_id == device
              );
              object ? object.veh_status.length && object.alarm_status == '1'
                ? $(this).html(
                  `<img style="height:100%; transform:rotate(90deg)"  src="./assets/icons/RedArrow.png" alt=${object.veh_status}>`
                ) :
                object.veh_status == "Idle"
                  ? $(this).html(
                    `<img style="height:100%;"  src="./assets/icons/BlueArrow.png" alt=${object.veh_status}>`
                  )
                  : object.veh_status == "Moving"
                    ? $(this).html(
                      `<img style="height:100%; transform:rotate(90deg)"  src="./assets/icons/GreenArrow.png" alt=${object.veh_status}>`
                    )
                    : object.veh_status == "Parked"
                      ? $(this).html(
                        `<img style="height:100%; transform:rotate(90deg)"  src="./assets/icons/YellowArrow.png" alt=${object.veh_status}>`
                      )
                      : object.veh_status == "Offline" ? $(this).html(
                        `<img style="height:100%; transform:rotate(90deg)"  src="./assets/icons/Disconected.png" alt=${object.veh_status}>`
                      ) : $(this).html(
                        `<img style="height:100%; transform:rotate(90deg)"  src="./assets/icons/Disconected.png" alt=${object.veh_status}>`)
                : null
            });
          })
        });
      });
      this.treeLoaded = true;
    } catch (err) {
      console.error(err, "Custom Error");
    }
  }
  //#endregion

  //#region AfterViewInit Hook
  ngAfterViewInit() {
    this.loadLeafLetMap();
    setTimeout(() => {
      this.settings.loadingSpinner = false;
    }, 300);
    this.backToTop.nativeElement.style.display = "none";
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (!this.settings.sidenavIsPinned) {
          this.sidenav.close();
        }
        if (window.innerWidth <= 768) {
          this.sidenav.close();
        }
      }
    });
    if (this.settings.menu == "vertical")
      this.menuService.expandActiveSubMenu(
        this.menuService.getVerticalMenuItems()
      );
  }
  //#endregion

  //#region Logout
  Logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("apiinfo");
    localStorage.removeItem("username");
    this.router.navigate(["/login"]);
  }
  //#endregion

  //#region Menu Events
  public chooseMenu() {
    this.settings.menu = this.menuOption;
    this.defaultMenu = this.menuOption;
    this.router.navigate(["/"]);
  }
  public chooseMenuType() {
    this.settings.menuType = this.menuTypeOption;
  }
  public changeTheme(theme) {
    this.settings.theme = theme;
  }
  public toggleSidenav() {
    this.sidenav.toggle();
  }
  public onPsScrollY(event) {
    event.target.scrollTop > 300
      ? (this.backToTop.nativeElement.style.display = "flex")
      : (this.backToTop.nativeElement.style.display = "none");
    if (this.settings.menu == "horizontal") {
      if (this.settings.fixedHeader) {
        var currentScrollTop =
          event.target.scrollTop > 56 ? event.target.scrollTop : 0;
        if (currentScrollTop > this.lastScrollTop) {
          document.querySelector("#horizontal-menu").classList.add("sticky");
          event.target.classList.add("horizontal-menu-hidden");
        } else {
          document.querySelector("#horizontal-menu").classList.remove("sticky");
          event.target.classList.remove("horizontal-menu-hidden");
        }
        this.lastScrollTop = currentScrollTop;
      } else {
        if (event.target.scrollTop > 56) {
          document.querySelector("#horizontal-menu").classList.add("sticky");
          event.target.classList.add("horizontal-menu-hidden");
        } else {
          document.querySelector("#horizontal-menu").classList.remove("sticky");
          event.target.classList.remove("horizontal-menu-hidden");
        }
      }
    }
  }
  public scrollToTop() {
    this.pss.forEach((ps) => {
      if (
        ps.elementRef.nativeElement.id == "main" ||
        ps.elementRef.nativeElement.id == "main-content"
      ) {
        ps.scrollToTop(0, 250);
      }
    });
  }
  @HostListener("window:resize")
  public onWindowResize(): void {
    if (window.innerWidth <= 768) {
      this.settings.sidenavIsOpened = false;
      this.settings.sidenavIsPinned = false;
      this.settings.menu = "vertical";
    } else {
      this.defaultMenu == "horizontal"
        ? (this.settings.menu = "horizontal")
        : (this.settings.menu = "vertical");
      this.settings.sidenavIsOpened = true;
      this.settings.sidenavIsPinned = true;
    }
  }
  public closeSubMenus() {
    let menu = document.querySelector(".sidenav-menu-outer");
    if (menu) {
      for (let i = 0; i < menu.children[0].children.length; i++) {
        let child = menu.children[0].children[i];
        if (child) {
          if (child.children[0].classList.contains("expanded")) {
            child.children[0].classList.remove("expanded");
            child.children[1].classList.remove("show");
          }
        }
      }
    }
  }
  //#endregion

  //#region Load Leaflet Maps

  loadLeafLetMap() {
    el = document.getElementById("leaflet-map");
    L.Icon.Default.imagePath = "assets/img/vendor/leaflet/";
    // L.Icon.Default.imagePath = "./assets/icons/GreenArrow.png";
    map = L.map(el).setView([this.lat, this.lng], 10);
    L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors',
    }).addTo(map);
  }
  //#endregion

  //#region Refresh Map
  RefreshMap() {
    $("#leafletContainer")
      .html("")
      .append(
        "<div id='leaflet-map' class='rounded' style='height:89vh !important;'></div>"
      );
    setTimeout(() => {
      this.loadLeafLetMap();
    });
    if(this.markerData.length){
    this.historyDataService.newMarkers.subscribe(
      (data) => {
        this.markersData = data
        if (data.length > 0)
          if (this.markersData.length) {
            this.markersData.forEach((el, i) => {
              this.polylineMarkers.push([
                parseFloat(el.Latitude),
                parseFloat(el.Longitude),
              ]);
              this.lat = parseFloat(el.Latitude);
              this.lng = parseFloat(el.Longitude);
            });
            map.setView([this.lat, this.lng], 10);
            L.polyline(this.polylineMarkers).addTo(map);
          }
      });
    }
  }
  //#endregion

  //#region All History Methods
  //#region Export History Data
  export() {
    $(".export").toggleClass("d-none");
  }
  exportToExcel() {
    this.ExportService.downloadExcelFile(this.markersData, this.reg_no);
  }
  exportToPDF() {
    this.ExportService.downloadPDF(this.markersData, this.reg_no);
  }
  //#endregion

  //#region History Play State Methods
  stop() {
    $(".leaflet-marker-icon.leaflet-zoom-animated.leaflet-clickable").remove();
    $(".leaflet-marker-shadow.leaflet-zoom-animated").remove();
    this.currentState = 0;
    this.pause();
    this.interval = 1000;
  }
  drawLine() {
    this.historyDataService.newMarkers.subscribe(
      (data) => (this.markersData = data)
    );
    this.markersData.forEach((el) => {
      this.markerData.push([el.Latitude, el.Longitude]);
    });
  }
  play() {
    this.drawLine();
    $(".pauseBtn").removeClass("d-none");
    $(".playBtn").addClass("d-none");
    if (this.currentState !== this.markerData.length - 1) {
      this.setTime = setInterval(() => {
        this.latitude = this.markerData[this.currentState][0];
        this.longitude = this.markerData[this.currentState][1];
        this.historyInfo = this.markersData[this.currentState];
        this.currentState++;
        if (this.currentState === this.markerData.length - 1) {
          this.pause();
          this.markerData = [];
        }
        this.marker = L.marker([this.latitude, this.longitude], { icon: this.CarMarker }).addTo(map);
        map.removeLayer(this.marker);
        $(
          ".leaflet-marker-icon.leaflet-zoom-animated.leaflet-clickable"
        ).remove();
        $(".leaflet-marker-shadow.leaflet-zoom-animated").remove();
        this.marker = L.marker([this.latitude, this.longitude], { icon: this.CarMarker, rotationAngle: this.historyInfo.Dir}).addTo(map)
        
        map.setView([this.latitude, this.longitude], 17);
      }, this.interval);
    }
  }
  pause() {
    $(".pauseBtn").addClass("d-none");
    $(".playBtn").removeClass("d-none");
    clearInterval(this.setTime);
    this.interval = null;
    this.interval = 500;
    this.markerData = [];
    this.interval = this.interval;
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
  //#endregion

  toggleDisplay() {
    $(".vehicleCardLeaflet").addClass("d-none");
    $(".vehicleCardLeafletMore").addClass("d-none");
  }

  draw() {
    L.polyline([
      this.markerData[0],
      this.markerData[this.markerData.length - 1],
    ]).addTo(map);
    map.setView([this.markerData[0]], 10);
  }
  toggleInfoCard() {
    $(".infoCard").toggleClass("d-none");
  }
  //#endregion

  //#region SetLeafLet Markers
  setLeafLetMarkers() {
    this.markers.length ?
      this.markers.forEach((element: any, index: string | number) => {
        if ((this.markers[index][1] === "0", this.markers[index][2] === "0")) {
          this.Toast.error('Cannot display marker having 0 coordinates', 'Error Marking Location')
          return false;
        } else {
          let currentMarker = new L.marker([
            this.markers[index][1],
            this.markers[index][2],
          ], { icon: this.CarMarker }).on("click", () => {
            this.getMarkerInfo([
              this.markers[index][0],
              parseFloat(this.markers[index][1]),
              parseFloat(this.markers[index][2]),
            ]);
          });
          this.lat = this.markers[this.markers.length - 1][1]
          this.lng = this.markers[this.markers.length - 1][2]
          let bounds = new L.LatLngBounds([[Math.max(this.lat), Math.max(this.lng)], [Math.min(this.lat), Math.min(this.lng)]]);
          map.fitBounds(bounds);
          currentMarker.addTo(map);
          this.AllMarkers.push(currentMarker);
        }
      }) : this.RefreshMap();
      
      if (this.markersData.length) {
        this.markersData.forEach((el, i) => {
          this.polylineMarkers.push([
            parseFloat(el.Latitude),
            parseFloat(el.Longitude),
          ]);
          this.lat = parseFloat(el.Latitude);
          this.lng = parseFloat(el.Longitude);
        });
        map.setView([this.lat, this.lng], 10);
        L.polyline(this.polylineMarkers).addTo(map);
      }
  }
  //#endregion

  //#region Selected Marker Info
  getMarkerInfo(info: any[]) {
    this.AllDeviceDataService.AllDevices.subscribe(
      (data) => (this.AllDevices = data)
    );

    let singleDevice = this.AllDevices.filter(
      (item: { device_id: any }) => item.device_id === info[0]
    );
    if (singleDevice.length > 1) {
      this.singleDeviceData = [singleDevice[singleDevice.length - 1]];
    } else {
      this.singleDeviceData = singleDevice;
    }
    this.lat = info[1];
    this.lng = info[2];
    map.setView([this.lat, this.lng], 20);
    if (
      $(".recordDialogOffset").is(":visible") ||
      $(".googleMapRecord").is(":visible")
    ) {
      this.Toast.clear()
      this.Toast.error(
        "Cannot Show device detail, until History is opened",
        "Error Showing device Details"
      );
      return null;
    } else {
      $(".vehicleCardLeaflet").removeClass("d-none");
      $(".vehicleCardLeafletMore").addClass("d-none");
    }
  }
  // #endregion

  //#region Marker Settings and Sending Method
  MarkerSettingFunction(e, DataTrack: string, _id: any) {
    $(".vehicleCardLeaflet").addClass("d-none");
    $(".vehicleCardLeafletMore").addClass("d-none");
    let marker: string[];
    if (e.target.checked) {
      if (mapType === "Google Maps") {
        $(`[data-device_id=${_id}]`).each(() => {
          $(this).prop('checked', true)
        })
        this.newPacketParse = new PacketParser(DataTrack);
        this.data = { ...this.newPacketParse };
        // this.data.veh_id
        this.idArr.push(this.data.veh_id)
        this.lat = parseFloat(this.data.lat);
        this.lng = parseFloat(this.data.lng);
        marker = [this.data.device_id, this.data.lat, this.data.lng];
        let tempObj = this.checkedDevices.find((item) => item.id == this.data.device_id)
        if (!tempObj) {
          this.checkedDevices.push({
            event: e,
            id: _id,
          });
        }
        this.markers.push(marker);
        this.AllDevices.push(this.data);
        this.markersService.SetMarkers(this.markers);
        let deviceID = this.AllDevices[this.AllDevices.length - 1].device_id
        let clusterID = this.AllDevices[this.AllDevices.length - 1].cluster_id
        let vehicleID = this.AllDevices[this.AllDevices.length - 1].veh_id
        this.fetchAlarms(deviceID, clusterID, vehicleID)
        this.setLeafLetMarkers();
        this.AllDeviceDataService.SetDevices(this.AllDevices);
        this.AllDeviceDataService.AllDevices.subscribe((data) => {
          this.AllDevices = data;
        });
      }
      if (mapType === "Open Street Maps") {
        this.newPacketParse = new PacketParser(DataTrack);
        this.data = { ...this.newPacketParse };
        // this.data.veh_id
        this.idArr.push(this.data.veh_id)
        this.lat = parseFloat(this.data.lat);
        this.lng = parseFloat(this.data.lng);
        marker = [this.data.device_id, this.data.lat, this.data.lng];
        let tempObj = this.checkedDevices.find((item) => item.id == this.data.device_id)
        if (!tempObj) {
          this.checkedDevices.push({
            event: e,
            id: _id,
          });
        }
        this.markers.push(marker);
        this.markersService.SetMarkers(this.markers);
        this.setLeafLetMarkers();
        this.AllDevices.push(this.data);
        let deviceID = this.AllDevices[this.AllDevices.length - 1].device_id
        let clusterID = this.AllDevices[this.AllDevices.length - 1].cluster_id
        let vehicleID = this.AllDevices[this.AllDevices.length - 1].veh_id
        this.fetchAlarms(deviceID, clusterID, vehicleID)
        $(".notificationPanel").addClass("d-none");
        $(".notificationsRead").addClass("d-none");
        this.AllDeviceDataService.SetDevices(this.AllDevices);
        this.AllDeviceDataService.AllDevices.subscribe((data) => {
          this.AllDevices = data
        });
      }
    }
    else {
      if (this.AllDevices.length < 1) {
        $('.notificationsUnread').addClass('d-none')
        $(".notificationPanel").addClass("d-none");
        $(".notificationsRead").addClass("d-none");
      }
      this.closeDetails();
      let index = this.AllDevices.findIndex(
        (item: { device_id: any }) => item.device_id === _id
      );
      let checkedDeviceIndex = this.checkedDevices.findIndex(
        (item) => item.id === _id
      );
      $(`[data-device_id=${_id}]`).each((index, el) => { $(`#${el.id}`).prop('checked', false) })
      this.checkedDevices.splice(checkedDeviceIndex, 1);
      this.AllDevices.splice(index, 1);
      if (this.AllDevices.length) {
        let deviceID = this.AllDevices[this.AllDevices.length - 1].device_id
        let clusterID = this.AllDevices[this.AllDevices.length - 1].cluster_id
        let vehicleID = this.AllDevices[this.AllDevices.length - 1].veh_id
        this.fetchAlarms(deviceID, clusterID, vehicleID)
      }
      let MarkerIndex = this.markers.findIndex(
        (item: any[]) => item[0] === _id
      );
      this.markers.splice(MarkerIndex, 1);
      this.markersService.SetMarkers(this.markers);
      setTimeout(() => {
        this.AllDeviceDataService.SetDevices(this.AllDevices);
        this.AllDeviceDataService.AllDevices.subscribe(
          (data) => (this.AllDevices = data)
        );
      }, 100);
      if (mapType === "Open Street Maps") {

        this.RefreshMap();
        setTimeout(() => {
          this.setLeafLetMarkers();
        }, 1000);
      }
      if (!this.AllDevices.length) {
        $(".vehicleCard").addClass("d-none");
      }
    }
  }
  //#endregion

  //#region On CheckBox
  onCheck(e, DataTrack: string, _id: any) {
    this.MarkerSettingFunction(e, DataTrack, _id);
  }
  //#endregion

  //#region Close Car Details Card
  closeDetails() {
    $(".vehicleCardLeaflet").addClass("d-none");
    $(".vehicleCardLeafletMore").addClass("d-none");
  }
  toggleInfo() {
    $(".vehicleCardLeaflet").toggleClass("d-none");
    $(".vehicleCardLeafletMore").toggleClass("d-none");
  }
  //#endregion

  //#region Dialog Methods
  openHistoryDialog() {
    if (this.AllDevices.length == 1) {
      if (
        $(".vehicleCardMore").is(":visible") ||
        $(".vehicleCard").is(":visible") ||
        $(".vehicleCardLeafletMore").is(":visible") ||
        $(".vehicleCardLeaflet").is(":visible")
      ) {
        this.Toast.clear()
        this.Toast.error(
          "Please Close Details to proceed",
          "Error showing Dialog"
        );
      } else {
        this.reg_no = this.AllDevices[0].veh_reg_no;
        this.RegistrationNoService.newRegNo(this.reg_no)
        this.dialog.open(historyDialogComponent,{disableClose: true});
        this.isHistory = true;
        this.closeDetails();
      }
    } else if (this.AllDevices.length > 1) {
      this.Toast.clear()
      this.Toast.error("Please Select only One Device", "Error showing Dialog");
    } else {
      this.Toast.clear()
      this.Toast.error("Please Select a Device", "Error Showing Dialog");
    }
    return null;
  }
  openAssetTripDialog() {
    this.dialog.open(AssetTripDialogComponent,{disableClose: true});
  }
  openAllControlsDialog() {
    if (this.AllDevices.length == 1) {
      if (
        $(".vehicleCardMore").is(":visible") ||
        $(".vehicleCard").is(":visible") ||
        $(".vehicleCardLeafletMore").is(":visible") ||
        $(".vehicleCardLeaflet").is(":visible")
      ) {
        this.Toast.clear()
        this.Toast.error(
          "Please Close Details to proceed",
          "Error showing Dialog"
        );
      }
      else {
        this.dev_id = this.AllDevices[0].device_id;
        this.DeviceIdService.setId(parseInt(this.dev_id))
        this.dialog.open(AllControlsDialogComponent,{disableClose: true});
      }
    }
    else if (this.AllDevices.length > 1) {
      this.Toast.clear()
      this.Toast.error("Please Select only One Device", "Error showing Dialog");
    }
    else {
      this.Toast.clear()
      this.Toast.error("Please Select a Device", "Error Showing Dialog");
    }
    return null;
  }
  openAllSettingsDialog() {
    if (this.AllDevices.length == 1) {
      if (
        $(".vehicleCardMore").is(":visible") ||
        $(".vehicleCard").is(":visible") ||
        $(".vehicleCardLeafletMore").is(":visible") ||
        $(".vehicleCardLeaflet").is(":visible")
      ) {
        this.Toast.clear()
        this.Toast.error(
          "Please Close Details to proceed",
          "Error showing Dialog"
        );
      } else {
        this.dev_id = this.AllDevices[0].device_id;
        this.dialog.open(AllSettingsDialogComponent,{disableClose: true});
      }
    } else if (this.AllDevices.length > 1) {
      this.Toast.clear()
      this.Toast.error("Please Select only One Device", "Error showing Dialog");
    } else {
      this.Toast.clear()
      this.Toast.error("Please Select a Device", "Error Showing Dialog");
    }
    return null;
  }
  closeHistoryDialog() {
    this.dialog.closeAll();
    $(".vehicleCard").addClass("d-none");
    $(".vehicleCardMore").addClass("d-none");
    $(".vehicleCardLeaflet").addClass("d-none");
    $(".vehicleCardLeafletMore").addClass("d-none");
    this.isHistory = false;
  }
  closeHistory() {
    this.stop();
    this.RefreshMap()
    setTimeout(() => {
      this.setLeafLetMarkers();
    }, 1000);
    $(".recordDialogOffset").addClass("d-none");
    $('.closeHistory').addClass('d-none')
    this.isHistory = false;
  }
  //#endregion

  //#region All GeoFencing Methods
  Draw(fenceData: any) {
    let nest = [];
    let nestArray = [];
    fenceData.FenceParam.split("|").forEach((element) => {
      let str;
      var tempArr = [];
      if (element.includes("@")) {
        str = element.split("@");
        tempArr.push(parseFloat(str[0]));
        tempArr.push(parseFloat(str[1]));
        nestArray.push({ lat: parseFloat(str[0]), lng: parseFloat(str[1]) });
      }
      if (element.includes(",")) {
        str = element.split(",");
        tempArr.push(parseFloat(str[0]));
        tempArr.push(parseFloat(str[1]));
        nestArray.push({ lat: parseFloat(str[0]), lng: parseFloat(str[1]) });
      }
      nest.push(tempArr);
    });
    if (fenceData.gf_type == "Polygon") {
      map.setView(nest[nest.length - 1], 10);
      if (plgn) {
        map.removeLayer(plgn);
      }
      if (circle) {
        map.removeLayer(circle);
      }
      if (rect) {
        map.removeLayer(rect);
      }
      if (marker) {
        map.removeLayer(marker);
      }
      plgn = L.polygon(nest, { color: "#FF1111" });
      plgn.addTo(map);
      if (mapType === "Google Maps") {
        $(".closeGeoFenceBtnGoogle").removeClass("d-none");
      } else if (mapType === "Open Street Maps") {
        $(".closeGeoFenceBtn").removeClass("d-none");
      }
      let postdata = {
        gf_type: fenceData.gf_type,
        fenceParam: nestArray,
      }
      this.GeoFencingService.newFence(postdata);
      map.fitBounds(nest);
      nest = [];
    }
    if (fenceData.gf_type == "Rectangle") {
      map.setView(nest[0], 10);
      if (rect) {
        map.removeLayer(rect);
      }
      if (circle) {
        map.removeLayer(circle);
      }
      if (plgn) {
        map.removeLayer(plgn);
      }
      if (marker) {
        map.removeLayer(marker);
      }
      rect = L.rectangle(nest, { color: "#2876FC" });
      rect.addTo(map);
      if (mapType === "Google Maps") {
        $(".closeGeoFenceBtnGoogle").removeClass("d-none");
      } else if (mapType === "Open Street Maps") {
        $(".closeGeoFenceBtn").removeClass("d-none");
      }
      let postdata ={
        gf_type: fenceData.gf_type,
        fenceParam: nestArray,
      }
      this.GeoFencingService.newFence(postdata);
      map.fitBounds(nest);
      nest = [];
    }
    if (fenceData.gf_type == "Circle") {
      map.setView(nest[0], 10);
      if (circle) {
        map.removeLayer(circle);
      }
      if (rect) {
        map.removeLayer(rect);
      }
      if (plgn) {
        map.removeLayer(plgn);
      }
      if (marker) {
        map.removeLayer(marker);
        $(
          ".leaflet-marker-icon.leaflet-zoom-animated.leaflet-clickable"
        ).remove();
        $(".leaflet-marker-shadow.leaflet-zoom-animated").remove();
      }
      marker = L.marker(...nest);
      marker.addTo(map);
      circle = L.circle(...nest, fenceData.gf_diff, { color: "#00C190" });
      circle.addTo(map);
      if (mapType === "Google Maps") {
        $(".closeGeoFenceBtnGoogle").removeClass("d-none");
      } else if (mapType === "Open Street Maps") {
        $(".closeGeoFenceBtn").removeClass("d-none");
      }
      this.GeoFencingService.newFence({gf_type: fenceData.gf_type,fenceParam: nestArray,gf_diff: fenceData.gf_diff,
        }
      );
      nest = [];
    }
    $(".selectionList").addClass("d-none");;
  }
  RemoveFencing() {
    this.RefreshMap()
    $(".selectionList").removeClass("d-none");
    setTimeout(() => {
      this.setLeafLetMarkers();
    }, 1000);
    setTimeout(() => {
      $(".closeGeoFenceBtn").addClass("d-none");
    }, 1000);
  }
  GeoFencing() {
    this.fenceListLoaded = false;
    $(".createFence").addClass("d-none");
    $(".createFenceGoogleMap").addClass("d-none");
    this.GeoFence.geoFence().subscribe((data) => {
      this.geoFences = data.data.sort();
      this.fenceListLoaded = true;
    }); 
    $(".selectionList").removeClass("d-none");
  }
  geofenceQuery(e) {
    let query: string = e.target.value
    if (query.length) {
      this.searchedFences = this.geoFences.filter((fences: GeoFence) => fences.gf_name.includes(query))
    }
    else {
      this.searchedFences = [];
    }
  }
  closeFencing() {
    this.router.navigate(['/'])
    $(".selectionList").addClass("d-none");
  }
  onInputChange = (e) => {
    this.fenceType = e.target.value;
    switch (this.fenceType) {
      case "Circle":
        this.RefreshMap()
        let thismarker: any;
        setTimeout(() => {
          map.on("click", (e) => {
            if (this.circleMarkers.length < 1) {
              let radius = $(".radius").val();
              let data: any[] = e.latlng;
              let newData = { ...data };
              this.circleMarkers.push([
                parseFloat(newData["lat"]),
                parseFloat(newData["lng"]),
              ]);
              thismarker = L.marker(e.latlng)
                .bindPopup(`<strong>Double click to remove marker</strong>`, {
                  maxWidth: 500,
                })
                .on("dblclick", () => {
                  map.removeLayer(this.newCircle);
                  map.removeLayer(thismarker);
                  this.circleMarkers = [];
                });
              thismarker.addTo(map);
              map.setView(e.latlng, 13);
              this.newCircle = L.circle(...this.circleMarkers, radius);
              this.circleRadius = radius;
              this.newCircle.addTo(map);
            }
            else {
              return null;
            }
          });
        }, 300)
        break;
      case "Rectangle":
        this.RefreshMap()
        setTimeout(() => {
          map.on("click", (e) => {
            let thismarker;
            if (this.rectMarkers.length == 2) {
              this.Toast.clear()
              this.Toast.error(
                "Cannot add more than two point for a rectangle. Remove one of the markers First",
                "Error Drawing Rectangle "
              );
            } else {
              let data: any[] = e.latlng;
              let newData = { ...data };
              this.rectMarkers.push([
                parseFloat(newData["lat"]),
                parseFloat(newData["lng"]),
              ]);
              thismarker = L.marker(e.latlng)
                .bindPopup(`<strong>Double click to remove marker</strong>`, {
                  maxWidth: 500,
                })
                .on("dblclick", (event) => {
                  let removedata: any[] = event.latlng;
                  let newDataremove = { ...removedata };
                  let tempArr = [
                    parseFloat(newDataremove["lat"]),
                    parseFloat(newDataremove["lng"]),
                  ];
                  let index = this.rectMarkers.findIndex(
                    (item: any[]) =>
                      item[0] == tempArr[0] && item[1] == tempArr[1]
                  );
                  this.rectMarkers.splice(index, 1);
                  // }
                  map.removeLayer(event.target);
                  if (this.rectangle) {
                    map.removeLayer(this.rectangle);
                  }
                });
              thismarker.addTo(map);
              map.setView(e.latlng, 10);
            }
          });
        }, 300)
        break;
      case "Polygon":
        this.RefreshMap()
        setTimeout(() => {

          map.on("click", (e) => {
            let thismarker;
            let data: any[] = e.latlng;
            let newData = { ...data };
            this.polyMarkers.push([
              parseFloat(newData["lat"]),
              parseFloat(newData["lng"]),
            ]);
            thismarker = L.marker(e.latlng)
              .bindPopup(`<strong>Double click to remove marker</strong>`, {
                maxWidth: 500,
              })
              .on("dblclick", (event) => {
                map.removeLayer(thismarker);
                let data: any[] = event.latlng;
                let newData = { ...data };
                let tempArr = [
                  parseFloat(newData["lat"]),
                  parseFloat(newData["lng"]),
                ];
                let index = this.polyMarkers.findIndex(
                  (item: any[]) => item[0] == tempArr[0] && item[1] == tempArr[1]
                );

                this.polyMarkers.splice(index, 1);
                map.removeLayer(event.target);
                if (this.polygon) {
                  map.removeLayer(this.polygon);
                }
              });
            thismarker.addTo(map);
            map.setView(e.latlng, 10);
          });
        }, 300)
      default:
        map.on("click", () => {
          return null;
        });
        break;
    }
  };
  drawRectangle() {
    if (this.rectMarkers.length == 2) {
      this.rectangle = L.rectangle(this.rectMarkers, { color: "#2876FC" });
      this.rectangle.addTo(map);
    } else {
      this.Toast.clear()
      this.Toast.error(
        "You should have 2 markers to draw a rectangle",
        "Drawing not allowed"
      );
    }
  }
  drawPolygon() {
    if (this.polyMarkers.length) {
      if (this.polygon) {
        map.removeLayer(this.polygon);
      } else {
        this.polygon = L.polygon(this.polyMarkers, { color: "#FF1111" });
        this.polygon.addTo(map);
      }
    } else {
      this.Toast.clear()
      this.Toast.error(
        "you should have atleast 2 markers to draw a polygon",
        "Error Drawing Polygon"
      );
    }
  }
  CreateFencing() {
    $(".selectionList").addClass("d-none");
    if (mapType === "Google Maps") {
      $(".createFenceGoogleMap").removeClass("d-none");
      $(".gmnoprint").removeClass("d-none");
    } else if (mapType === "Open Street Maps") {
      $(".createFence").removeClass("d-none");
    }
  }
  closeCreateFencing() {
    this.router.navigate(['/'])
    this.fenceType = "Select Fence Type";
    $(".fenceType").val("Select Fence Type");

    this.RefreshMap();
    setTimeout(() => {
      this.setLeafLetMarkers();
    }, 1000);

    $(".createFence").addClass("d-none");
    $(".createFenceGoogleMap").addClass("d-none");
    if (this.rectangle) {
      map.removeLayer(this.rectangle);
      $(
        ".leaflet-marker-icon.leaflet-zoom-animated.leaflet-clickable"
      ).remove();
      $(".leaflet-marker-shadow.leaflet-zoom-animated").remove();
    }
    if (this.newCircle) {
      map.removeLayer(this.newCircle);
      $(
        ".leaflet-marker-icon.leaflet-zoom-animated.leaflet-clickable"
      ).remove();
      $(".leaflet-marker-shadow.leaflet-zoom-animated").remove();
    }
    if (this.polygon) {
      map.removeLayer(this.polygon);
      $(
        ".leaflet-marker-icon.leaflet-zoom-animated.leaflet-clickable"
      ).remove();
      $(".leaflet-marker-shadow.leaflet-zoom-animated").remove();
    }
  }
  sendCircle() {
    if (this.circleMarkers.length) {
      this.cityName = $(".city").val();
      this.countryName = $(".country").val();
      this.fenceName = $(".fenceName").val();
      let param: string = "";
      this.FenceParam = this.circleMarkers.forEach((item: any[]) => {
        param = item[0] + "," + item[1];
      });

      let circleParams = {
        cmp_id: 0,
        cust_id: 0,
        gf_name: this.fenceName,
        gf_diff: this.circleRadius,
        gf_type: this.fenceType,
        gf_type_name: this.fenceType,
        CityNCountry: this.cityName + ", " + this.countryName,
        FenceParam: param,
      };
      if (
        this.cityName.length &&
        this.countryName.length &&
        this.fenceName.length
      ) {
        this.PostFence.addGeoFence(circleParams).subscribe((data) => {
          if (data.status) {
            console.log()
            this.Toast.success(data.message, "Created Successfully");
          } else {
            this.Toast.error(
              data.message,
              `Failed to execute command due to code ${data.code}`
            );
          }
        });
      } else {
        this.Toast.clear()
        this.Toast.warning("Please Fill up all the fields", "Invalid Input");
      }
    } else {
      this.Toast.clear()
      this.Toast.error(
        "You Must Draw a Circle to proceed",
        "Couldn't proceed to your request"
      );
    }
  }
  sendPolygon() {
    // var asd = '';
    if (this.polyMarkers.length) {
      this.cityName = $(".city").val();
      this.countryName = $(".country").val();
      this.fenceName = $(".fenceName").val();
      let param: string = "";
      this.FenceParam = this.polyMarkers.forEach((item: any[]) => {
        param += item.toString() + "|";
      });
      param = param.slice(0, param.length - 1);
      let polyparams = {
        cmp_id: 0,
        cust_id: 0,
        gf_name: this.fenceName,
        gf_type: this.fenceType,
        gf_type_name: this.fenceType,
        CityNCountry: this.cityName + ", " + this.countryName,
        FenceParam: param,
      };
      if (
        this.cityName.length &&
        this.countryName.length &&
        this.fenceName.length
      ) {
        this.PostFence.addGeoFence(polyparams).subscribe((data) => {
          if (data.status) {
            this.Toast.clear()
            this.Toast.success(data.message, "Polygon Created Successfully");
          } else {
            this.Toast.clear()
            this.Toast.error(
              data.message,
              `Failed to execute command due to code ${data.code}`
            );
          }
        });
      } else {
        this.Toast.clear()
        this.Toast.warning("Please Fill up all the fields", "Invalid Input");
      }
    } else {
      this.Toast.clear()
      this.Toast.error("Please Draw a polygon first", "Coundn't save");
    }
  }
  sendRectangle() {
    if (this.rectMarkers.length) {
      this.cityName = $(".city").val();
      this.countryName = $(".country").val();
      this.fenceName = $(".fenceName").val();
      let param: string = "";
      this.FenceParam = this.rectMarkers.forEach((item: any[]) => {
        param += item.toString() + "|";
      });
      param = param.slice(0, param.length - 1);
      let rectparams = {
        cmp_id: 0,
        cust_id: 0,
        gf_name: this.fenceName,
        gf_type: this.fenceType,
        gf_type_name: this.fenceType,
        CityNCountry: this.cityName + ", " + this.countryName,
        FenceParam: param,
      };
      if (
        this.cityName.length &&
        this.countryName.length &&
        this.fenceName.length
      ) {
        this.PostFence.addGeoFence(rectparams).subscribe((data) => {
          if (data.status) {
            this.Toast.clear()
            this.Toast.success(data.message, "Rectangle Created Successfully");
          } else {
            this.Toast.clear()
            this.Toast.error(
              data.message,
              `Failed to execute command due to code ${data.code}`
            );
          }
        });
      } else {
        this.Toast.clear()
        this.Toast.warning("Please Fill up all the fields", "Invalid Input");
      }
    } else {
      this.Toast.clear()
      this.Toast.error("Please Draw a Rectangle first", "Coundn't save");
    }
  }
  //#endregion
  fetchAlarms(devId, cstId, vehId) {
    let alarmsData = {
      deviceID: devId,
      clusterID: cstId,
      vehicleID: vehId
    }
    this.Alarms.getNotifications(alarmsData).subscribe((res) => {
      if (!res.status) {
        this.Toast.clear()
        this.Toast.error(res.message, "Error Showing Notifications");
      } else {
        this.alarmsFound = false;
        this.notifications = res.data;
        $('.notificationsUnread').removeClass('d-none')
        this.alarmsFound = true;
      }
    });
  }
  //#region Alarm Metods
  fetchNotifications() {

    // let alarmsData = {
    //   deviceID: this.AllDevices[this.AllDevices.length - 1].device_id,
    //   clusterID: this.AllDevices[this.AllDevices.length - 1].cluster_id,
    //   vehicleID: this.AllDevices[this.AllDevices.length - 1].veh_id
    // }
    // this.Alarms.getNotifications(alarmsData).subscribe((res) => {
    //   if (!res.status) {
    //     this.Toast.clear()
    //     this.Toast.error(res.message, "Error Showing Notifications");
    //   } else {
    //     this.alarmsFound = false;
    //     this.notifications = res.data;
    //     $('.notificationsUnread').removeClass('d-none')
    //     this.readNotifications();
    //     this.alarmsFound = true;
    //   }

    // });
    this.readNotifications();
  }
  readNotifications() {
    $(".notificationsUnread").addClass("d-none");
    $(".notificationPanel").removeClass("d-none");
    $(".notificationsRead").removeClass("d-none");
  }
  unReadNotifications() {
    $(".notificationsUnread").removeClass("d-none");
    $(".notificationPanel").addClass("d-none");
    $(".notificationsRead").addClass("d-none");
  }
  //#endregion

  ngOnDestroy(): void {
    dataArr = [];
    this.offlineDevices = [];
    this.onlineDevices = []
    this.childArray = [];
    this.OnlineGroups = [];
    this.markers = [];
    this.AllDevices = [];
    this.AllVehicles = [];
    this.AllMarkers = [];
    this.markersData = [];
    this.checkedDevices = [];
    this.notifications = [];
    $(".notificationsUnread").addClass("d-none");
    $(".notificationPanel").addClass("d-none");
    $(".notificationsRead").addClass("d-none");
    clearInterval(this.updateTree)
    this.markersService.SetMarkers([])
    this.AllDeviceDataService.SetDevices([])
    this.RegistrationNoService.newRegNo('')
    this.DeviceIdService.setId(0)
    this.GeoFencingService.newFence({gf_type:"none", fenceParam:[{lat:0, lng:0}],gf_diff:''})
   }
   if (map) {
    map.off()
  }
}
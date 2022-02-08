import { Component, OnInit, ViewChild, HostListener, ViewChildren, QueryList } from "@angular/core";
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
import { FormGroup } from "@angular/forms";
import { historyService } from "src/app/_core/_AppServices/historyService";
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
import { CurrentStateResponse, Command, Setting, Alarm } from '../../_interfaces/DBresponse.model';
import { CommandsService } from '../../_core/_AppServices/CommandsService';
import { CommandTypeService } from '../../_core/_AppServices/CommandTypeService';
import { SettingsService } from '../../_core/_AppServices/SettingsService';
import { SettingTypeService } from '../../_core/_AppServices/SettingTypeService';
// Global Variables
declare var L;
var map;
var el;
var reg_no;
var mapType;
var rect;
var circle;
var plgn;
var polyline;
var marker;
var device_id;
var Historydata = [];
var dataArr: PacketParser[] = [];
@Component({
  selector: "app-pages",
  templateUrl: "./pages.component.html",
  styleUrls: ["./pages.component.scss"],
  providers: [MenuService],
})
export class PagesComponent implements OnInit {
  //#region Properties
  public settings: Settings;
  location: string = window.location.pathname
  username: string;
  logo: string;
  lat = 31.4884152;
  lng = 74.3704655;
  zoom = 2;
  TREE_DATA: Vehicles[] = [];
  AllDevices: any[] = [];
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
  geoFences: any;
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
  onlineDevices: PacketParser[] = [];
  offlineDevices: PacketParser[] = [];
  AllVehicles: PacketParser[] = [];
  OnlineGroups: any[] = [];
  idArr: number[] = []
  SearchedDevices: PacketParser[] = []
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
    public CurrentStateService: CurrentStateService
  ) {
    this.settings = this.appSettings.settings;
  }
  //#region OnInit
  ngOnInit() {
    $('.notificationsUnread').addClass('d-none')
    $(".notificationPanel").addClass("d-none");
    $(".notificationsRead").addClass("d-none")
    // this.dialog.open(ControlDialogComponent)
    dataArr = [];
    this.offlineDevices = [];
    this.onlineDevices = []
    this.childArray = [];
    this.OnlineGroups = [];
    this.markers = [];
    this.AllDevices = [];
    this.AllVehicles = [];
    if (window.location.pathname == "/vehicles") {
      this.isVehicles = true;
    }
    // this.icon = L.icon({
    //   iconUrl: '',
    //   iconSize: [38, 95], // size of the icon
    //   iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    //   popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    // });
    this.logo = localStorage.CompanyLogo ? 'data:image/png;base64,' + localStorage.getItem("CompanyLogo") : '../../../assets/logos/logo 1-01.svg';
    this.username = localStorage.getItem("username") || null;
    this.mapTypeService.newMap.subscribe((data) => {
      mapType = data;
      this.currentMap = mapType;
    });
    this.AllDeviceDataService.AllDevices.subscribe((data) => (this.AllDevices = JSON.parse(data)));
    this.getVehTree();
    if (map) {
      map.off();
      this.RefreshMap()
    }
    setInterval(() => {
      $('.notificationsUnread').addClass('d-none')
      $(".notificationPanel").addClass("d-none");
      $(".notificationsRead").addClass("d-none")
      this.getVehTree()
    }, 300000);

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
      setTimeout(() => {
        devices.forEach((item) => {
          $(`[data-device_id]`).each((param, el) => {
            // debugger;
            console.log(el.id)
            if (item.id == el.id) {
              $(el).prop('checked', true)
            }
            else {
              $(el).removeProp('checked')
            }
          })
        })
      });
    }
  }
  expandedPanel(e) {
    if (this.checkedDevices.length) {
      setTimeout(() => {
        this.checkedDevices.forEach((item) => {
          $(`[data-device_id= ${item.id}]`).prop('checked', true)
        })
      });
    }
  }
  //#endregion

  //#region MapType change Event
  MapType(e) {
    mapType = e.target.value;
    this.currentMap = mapType;
    this.closeFencing();
    $(".vehicleCard").addClass("d-none");
    $(".vehicleCardMore").addClass("d-none");
    $(".vehicleCardLeaflet").addClass("d-none");
    $(".vehicleCardLeafletMore").addClass("d-none");
    $(".agm-map-container-inner").addClass("rounded");
    mapType = $(".mapDropdown").find(":selected").val();
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
      $(".createFenceGoogleMap").addClass("d-none");
      $(".createFence").toggleClass("d-none");
    }
    if (
      mapType === "Open Street Maps" &&
      $(".createFenceGoogleMap").is(":visible")
    ) {
      $(".createFence").toggleClass("d-none");
      $(".createFenceGoogleMap").addClass("d-none");
    }
    if (mapType == "Google Maps") {
      map.off();
    } else if (mapType == "Open Street Maps") {
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
      this.SearchedDevices = []
    }
  }
  //#region Get Veh Data
  getVehTree() {
    dataArr = [];
    this.offlineDevices = [];
    this.onlineDevices = []
    this.childArray = [];
    this.OnlineGroups = [];
    this.AllDevices = [];
    this.AllVehicles = [];
    $('.notificationsUnread').addClass('d-none')
    $(".notificationPanel").addClass("d-none");
    $(".notificationsRead").addClass("d-none");
    try {
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
          this.AllVehicles = dataArr;
          if (dataArr.length) {
            dataArr.forEach((item: PacketParser) => {
              if (item.Online == '1') {
                let obj = this.TREE_DATA[1].SubMenu.find((data: Vehicles) => data.grp_id.toString() == item.group_id)
                obj.OnlineDevice = [];
                let nest = obj.SubMenu.find((value: Vehicles) => value.device_id == item.device_id)
                if (nest['device_id'] == item.device_id) {
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
            }, 100);
          }
          $('.ref-location').each(function () {

            var refLo = $(this).attr('data-refLocation');
            var obj2 = dataArr.find(
              (item: PacketParser) => item.device_id == refLo
            );
            obj2 ? $(this).html(`${obj2.ref_location}`) : null;
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
                `<img style="height:30px; transform:rotate(90deg)"  src="../../../assets/icons/RedArrow.png" alt=${object.veh_status}>`
              ) :
              object.veh_status == "Idle"
                ? $(this).html(
                  `<img style="height:30px;"  src="../../../assets/icons/BlueArrow.png" alt=${object.veh_status}>`
                )
                : object.veh_status == "Moving"
                  ? $(this).html(
                    `<img style="height:30px; transform:rotate(90deg)"  src="../../../assets/icons/GreenArrow.png" alt=${object.veh_status}>`
                  )
                  : object.veh_status == "Parked"
                    ? $(this).html(
                      `<img style="height:30px; transform:rotate(90deg)"  src="../../../assets/icons/YellowArrow.png" alt=${object.veh_status}>`
                    )
                    : object.veh_status == "Offline" ? $(this).html(
                      `<img style="height:30px; transform:rotate(90deg)"  src="../../../assets/icons/Disconected.png" alt=${object.veh_status}>`
                    ) : $(this).html(
                      `<img style="height:30px; transform:rotate(90deg)"  src="../../../assets/icons/Disconected.png" alt=${object.veh_status}>`)
              : null
          });
        });
      });
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
    // debugger;
    // L.Icon.Default.imagePath = "../../../assets/icons/GreenArrow.png";
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
  }
  //#endregion

  //#region All History Methods
  //#region Export History Data
  export() {
    $(".export").toggleClass("d-none");
  }
  exportToExcel() {
    this.ExportService.downloadExcelFile(Historydata, reg_no);
  }
  exportToPDF() {
    this.ExportService.downloadPDF(Historydata, reg_no);
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
      (data) => (this.markersData = JSON.parse(data))
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
        this.historyInfo = Historydata[this.currentState];
        this.currentState++;
        if (this.currentState === this.markerData.length - 1) {
          this.pause();
          this.markerData = [];
        }
        this.marker = L.marker([this.latitude, this.longitude]).addTo(map);
        map.removeLayer(this.marker);
        $(
          ".leaflet-marker-icon.leaflet-zoom-animated.leaflet-clickable"
        ).remove();
        $(".leaflet-marker-shadow.leaflet-zoom-animated").remove();
        this.marker = L.marker([this.latitude, this.longitude]).addTo(map);
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
    polyline = L.polyline([
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
          ]).on("click", () => {
            this.getMarkerInfo([
              this.markers[index][0],
              parseFloat(this.markers[index][1]),
              parseFloat(this.markers[index][2]),
            ]);
          });
          this.lat = this.markers[this.markers.length - 1][1]
          this.lng = this.markers[this.markers.length - 1][2]
          map.setView([this.lat, this.lng], 12);
          currentMarker.addTo(map);
          this.AllMarkers.push(currentMarker);
        }
      }) : this.RefreshMap();
  }
  //#endregion

  //#region Selected Marker Info
  getMarkerInfo(info: any[]) {
    this.AllDeviceDataService.AllDevices.subscribe(
      (data) => (this.AllDevices = JSON.parse(data))
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

  //#region Marker Settinfs and Sending Method
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
        let markerString = JSON.stringify(this.markers);
        this.markersService.SetMarkers(markerString);
        this.AllDevices.push(this.data);
        this.setLeafLetMarkers();
        $('.notificationsUnread').removeClass('d-none')
        this.AllDeviceDataService.SetDevices(JSON.stringify(this.AllDevices));
        this.AllDeviceDataService.AllDevices.subscribe((data) => {
          this.AllDevices = JSON.parse(data);
        });
        // this.CurrentStateService.getCurrentState(this.data.veh_id).subscribe((el: CurrentStateResponse) => {
        //   if (el.status) {
        //     this.markers = [];
        //     el.data.forEach((item) => {
        //       this.lat = parseFloat(item.lat);
        //       this.lng = parseFloat(item.long);
        //       marker = [this.data.device_id, item.lat, item.long];
        //       this.markers.push(marker);
        //       let markerString = JSON.stringify(this.markers);
        //       this.markersService.SetMarkers(markerString);
        //     })
        //   }
        // })
        // let tempObj = this.checkedDevices.find((item) => item.id == this.data.device_id)
        // if (!tempObj) {
        //   this.checkedDevices.push({
        //     event: e,
        //     id: _id,
        //   });
        // }
        // this.AllDevices.push(this.data);
        // $('.notificationsUnread').removeClass('d-none')
        // this.AllDeviceDataService.SetDevices(JSON.stringify(this.AllDevices));
        // this.AllDeviceDataService.AllDevices.subscribe((data) => {
        //   this.AllDevices = JSON.parse(data);
        // });
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
        let markerString = JSON.stringify(this.markers);
        this.markersService.SetMarkers(markerString);
        this.setLeafLetMarkers();
        this.AllDevices.push(this.data);
        $('.notificationsUnread').removeClass('d-none')
        $(".notificationPanel").addClass("d-none");
        $(".notificationsRead").addClass("d-none");
        this.AllDeviceDataService.SetDevices(JSON.stringify(this.AllDevices));
        this.AllDeviceDataService.AllDevices.subscribe((data) => {
          this.AllDevices = JSON.parse(data);
        });
      }
      //   this.CurrentStateService.getCurrentState(this.data.veh_id).subscribe((el: CurrentStateResponse) => {
      //     if (el.status) {
      //       this.markers = [];
      //       el.data.forEach((item) => {
      //         this.lat = parseFloat(item.lat);
      //         this.lng = parseFloat(item.long);
      //         marker = [this.data.device_id, item.lat, item.long];
      //         this.markers.push(marker);
      //         let markerString = JSON.stringify(this.markers);
      //         this.markersService.SetMarkers(markerString);
      //         this.setLeafLetMarkers();
      //       })
      //     }
      //   })
      //   let tempObj = this.checkedDevices.find((item) => item.id == this.data.device_id)
      //   if (!tempObj) {
      //     this.checkedDevices.push({
      //       event: e,
      //       id: _id,
      //     });
      //   }
      //   this.AllDevices.push(this.data);
      //   $('.notificationsUnread').removeClass('d-none')
      //   $(".notificationPanel").addClass("d-none");
      //   $(".notificationsRead").addClass("d-none");
      //   this.AllDeviceDataService.SetDevices(JSON.stringify(this.AllDevices));
      //   this.AllDeviceDataService.AllDevices.subscribe((data) => {
      //     this.AllDevices = JSON.parse(data);
      //   });
      // }
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
      $(`[data-device_id=${_id}]`).prop('checked', false)
      this.checkedDevices.splice(checkedDeviceIndex, 1);
      this.AllDevices.splice(index, 1);
      let MarkerIndex = this.markers.findIndex(
        (item: any[]) => item[0] === _id
      );
      this.markers.splice(MarkerIndex, 1);
      let markerString = JSON.stringify(this.markers);
      this.markersService.SetMarkers(markerString);
      setTimeout(() => {
        this.AllDeviceDataService.SetDevices(JSON.stringify(this.AllDevices));
        this.AllDeviceDataService.AllDevices.subscribe(
          (data) => (this.AllDevices = JSON.parse(data))
        );
      }, 100);
      map.off();
      this.RefreshMap();
      setTimeout(() => {
        this.setLeafLetMarkers();
      }, 1000);
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
        reg_no = this.AllDevices[0].veh_reg_no;
        this.RegistrationNoService.newRegNo(reg_no)
        this.dialog.open(historyDialogComponent);
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
    this.dialog.open(AssetTripDialogComponent);
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
        device_id = this.AllDevices[0].device_id;
        this.dialog.open(AllControlsDialogComponent);
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
        device_id = this.AllDevices[0].device_id;
        this.dialog.open(AllSettingsDialogComponent);
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
  }
  closeHistory() {
    this.RefreshMap()
    setTimeout(() => {
      this.setLeafLetMarkers();
    }, 1000);
    $(".recordDialogOffset").addClass("d-none");
    $('.closeHistory').addClass('d-none')
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
      map.setView(nest[nest.length - 1], 14);
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
      let postdata = JSON.stringify({
        gf_type: fenceData.gf_type,
        fenceParam: nestArray,
      });
      this.GeoFencingService.newFence(postdata);
      map.fitBounds(nest);
      nest = [];
    }
    if (fenceData.gf_type == "Rectangle") {
      map.setView(nest[0], 14);
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
      let postdata = JSON.stringify({
        gf_type: fenceData.gf_type,
        fenceParam: nestArray,
      });
      this.GeoFencingService.newFence(postdata);
      map.fitBounds(nest);
      nest = [];
    }
    if (fenceData.gf_type == "Circle") {
      map.setView(nest[0], 14);
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
      this.GeoFencingService.newFence(
        JSON.stringify({
          gf_type: fenceData.gf_type,
          fenceParam: nestArray,
          gf_diff: fenceData.gf_diff,
        })
      );
      nest = [];
    }
    this.closeFencing();
  }
  RemoveFencing() {
    this.RefreshMap()
    setTimeout(() => {
      this.setLeafLetMarkers();
    }, 1000);
    setTimeout(() => {
      $(".closeGeoFenceBtn").addClass("d-none");
    }, 1000);
    // if (rect) {
    //   map.removeLayer(rect);
    // }
    // if (circle) {
    //   map.removeLayer(circle);
    // }
    // if (plgn) {
    //   map.removeLayer(plgn);
    // }
    // if (marker) {
    //   map.removeLayer(marker);
    //   $(
    //     ".leaflet-marker-icon.leaflet-zoom-animated.leaflet-clickable"
    //   ).remove();
    //   $(".leaflet-marker-shadow.leaflet-zoom-animated").remove();
    // }
    // $(".GeoFence").addClass("d-none");
    // if (!rect || !plgn || !circle || !marker) {
    //   setTimeout(() => {
    //     $(".closeGeoFenceBtn").addClass("d-none");
    //   }, 1000);
    // }
  }
  GeoFencing() {
    $(".createFence").addClass("d-none");
    $(".createFenceGoogleMap").addClass("d-none");
    this.GeoFence.geoFence().subscribe((data) => {
      this.geoFences = data.data;
    });
    $(".selectionList").removeClass("d-none");
  }
  closeFencing() {
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
        setTimeout(() => {
          this.RefreshMap()
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
    this.closeFencing()
    if (mapType === "Google Maps") {
      $(".createFenceGoogleMap").removeClass("d-none");
      $(".gmnoprint").removeClass("d-none");
      // $('.googleMap').attr('ng-reflect-drawing-manager', "[object Object]")
    } else if (mapType === "Open Street Maps") {
      this.RefreshMap();
      $(".createFence").removeClass("d-none");
    }
  }
  closeCreateFencing() {
    this.fenceType = "Select Fence Type";
    $(".fenceType").val("Select Fence Type");
    map.off();
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

  //#region Alarm Metods
  fetchNotifications() {

    let alarmsData = {
      deviceID: this.AllDevices[this.AllDevices.length - 1].device_id,
      clusterID: this.AllDevices[this.AllDevices.length - 1].cluster_id,
      vehicleID: this.AllDevices[this.AllDevices.length - 1].veh_id
    }
    this.Alarms.getNotifications(alarmsData).subscribe((res) => {
      if (!res.status) {
        this.Toast.clear()
        this.Toast.error(res.message, "Error Showing Notifications");
      } else {
        this.notifications = res.data;
        $('.notificationsUnread').removeClass('d-none')
        this.readNotifications();
      }

    });
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
}
//#region Dialogs Component Declarations
@Component({
  selector: "app-history-dialog",
  templateUrl: "./Dialogs/historyDialog.html",
  styleUrls: ["../pages/pages.component.scss"],
})
export class historyDialogComponent implements OnInit {
  markerData = [];
  response: any;
  history: any;
  speed: boolean;
  lat: any;
  lng: any;
  currentState: number = 0;
  setTime: any;
  interval: number = 500;
  loading: boolean = false;
  formValid: boolean = false;
  dateValid: boolean = false;
  public form: FormGroup;
  constructor(
    public dialog: MatDialog,
    public historyService: historyService,
    public historyDataService: historyDataService,
    public Toast: ToastrService
  ) { }
  ngOnInit() { }
  onCheck(e) {
    this.speed = e.target.checked;
  }

  closeDialog() {
    this.dialog.closeAll();
  }
  onSubmit() {
    let History_type = $("#historyType").val();
    let dateStart = $("#de_start").val().toLocaleString().replace("T", " ");
    let dateEnd = $("#de_end").val().toLocaleString().replace("T", " ");
    let speed = this.speed;
    let veh_reg_no = reg_no;
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
            this.historyDataService.setNewMarkers(JSON.stringify(res.data.History));
            if (res.status) {
              Historydata = res.data.History;
              if (res.data.History.length) {
                res.data.History.forEach((el, i) => {
                  this.markerData.push([
                    parseFloat(el.Latitude),
                    parseFloat(el.Longitude),
                  ]);
                  this.lat = parseFloat(el.Latitude);
                  this.lng = parseFloat(el.Longitude);
                });
                this.Toast.clear()
                this.Toast.success(res.data.ErrorMessage, res.message);
                map.setView([this.lat, this.lng], 10);
                L.polyline(this.markerData).addTo(map);
                this.dialog.closeAll();
                if (mapType == "Google Maps") {
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
@Component({
  selector: "app-asset-report-dialog",
  templateUrl: "./Dialogs/AssetTripDialog.html",
  styleUrls: ["../pages/pages.component.scss"],
})
export class AssetTripDialogComponent {
  constructor(public dialog: MatDialog) { }
}
@Component({
  selector: "app-all-controls-dialog",
  templateUrl: "./Dialogs/AllControlsDialog.html",
  styleUrls: [
    "../pages/pages.component.scss",
    "../pages/Dialogs/ControlDialog.scss",
  ],
})
export class AllControlsDialogComponent implements OnInit {
  AllCommands: Command[] = [{
    Name: "No data available",
    camera_channel: "",
    channel: "No data available",
    check_status: false,
    fb_id: 0,
    p_cell_no: "",
    p_cmd_id: 1,
    p_dev_id: 0,
    _picQ: ""
  }]
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
  constructor(public dialog: MatDialog, public CommandsService: CommandsService, public CommandTypeService: CommandTypeService, public SettingsService: SettingsService, public SettingTypeService: SettingTypeService) { }
  ngOnInit(): void {
    this.CommandsService.GetCommands().subscribe(res => {
      if (res.status) {
        this.AllCommands = res.data
      }
    })
    this.SettingsService.GetSettings().subscribe(settings => this.AllSettings = settings.data)

  }

  OpenSettingDialog(name, id): void {
    this.SettingTypeService.setSetting(name);
    this.SettingTypeService.setSettingId(id)
    this.dialog.open(SettingDialogComponent)
  }
  OpenCommandDialog(name, id): void {
    this.CommandTypeService.setCommand(name)
    this.CommandTypeService.setCommandId(id)
    setTimeout(() => {
      this.dialog.open(ControlDialogComponent)
    }, 400)
  } closeDialog() {
    this.dialog.closeAll();
  }
}

@Component({
  selector: 'app-control-dialog',
  templateUrl: './Dialogs/ControlDialog.html',
  styleUrls: [
    "../pages/pages.component.scss",
    "../pages/Dialogs/ControlDialog.scss",]
})
export class ControlDialogComponent implements OnInit {

  commandType: string;
  commandId: number;
  channel: string;
  picQualtity: string;
  camChannel: string;
  phoneNumber: string;
  constructor(public CommandTypeService: CommandTypeService, public CommandsService: CommandsService, public Toast: ToastrService, public dialog: MatDialog) { }
  ngOnInit(): void {
    this.CommandTypeService.currnetCommand.subscribe(command => this.commandType = command)
    this.CommandTypeService.currentCommandId.subscribe(id => this.commandId = id)
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
          p_dev_id: device_id,
          channel: this.channel
        }
        this.CommandsService.SendCommand(data).subscribe(res => {
          if (typeof res._object.Message == "string") {
            this.Toast.clear()
            this.Toast.error(res._object.Message)
          }
          else {
            data.check_status = true;
            data.fb_id = res._object.Message;
            this.CommandsService.SendCommand(data).subscribe(newRes => {
              if (newRes._object.Message == "") {
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
          p_dev_id: device_id,
          channel: this.channel
        }
        this.CommandsService.SendCommand(data).subscribe(res => {
          if (typeof parseInt(res._object.Message) == "number") {
            data.check_status = true;
            data.fb_id = res._object.Message;
            this.CommandsService.SendCommand(data).subscribe(newRes => {
              if (newRes._object.Message == "") {
                this.Toast.clear()
                this.Toast.success(`${this.commandType} command successfully executed`, "Success")
                this.dialog.closeAll();
                this.dialog.open(AllControlsDialogComponent)
              }
            })
          }
          else {
            this.Toast.clear()
            this.Toast.error(res._object.Message)
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
          p_dev_id: device_id,
          channel: this.channel
        }
        this.CommandsService.SendCommand(data).subscribe(res => {
          if (typeof res._object.Message == "string") {
            this.Toast.clear()
            this.Toast.error(res._object.Message)
          }
          else {
            data.check_status = true;
            data.fb_id = res._object.Message;
            this.CommandsService.SendCommand(data).subscribe(newRes => {
              if (newRes._object.Message == "") {
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
          p_dev_id: device_id,
          channel: this.channel
        }
        this.CommandsService.SendCommand(data).subscribe(res => {
          if (typeof res._object.Message == "string") {
            this.Toast.clear()
            this.Toast.error(res._object.Message)
          }
          else {
            data.check_status = true;
            data.fb_id = res._object.Message;
            this.CommandsService.SendCommand(data).subscribe(newRes => {
              if (newRes._object.Message == "") {
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
          p_dev_id: device_id,
          channel: this.channel
        }
        this.CommandsService.SendCommand(data).subscribe(res => {
          if (typeof res._object.Message == "string") {
            this.Toast.clear()
            this.Toast.error(res._object.Message)
          }
          else {
            data.check_status = true;
            data.fb_id = res._object.Message;
            this.CommandsService.SendCommand(data).subscribe(newRes => {
              if (newRes._object.Message == "") {
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
          p_dev_id: device_id,
          channel: this.channel
        }
        this.CommandsService.SendCommand(data).subscribe(res => {
          if (typeof res._object.Message == "string") {
            this.Toast.clear()
            this.Toast.error(res._object.Message)
          }
          else {
            data.check_status = true;
            data.fb_id = res._object.Message;
            this.CommandsService.SendCommand(data).subscribe(newRes => {
              if (newRes._object.Message == "") {
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
          p_dev_id: device_id,
          channel: this.channel
        }
        this.CommandsService.SendCommand(data).subscribe(res => {
          if (typeof res._object.Message == "string") {
            this.Toast.clear()
            this.Toast.error(res._object.Message)
          }
          else {
            data.check_status = true;
            data.fb_id = res._object.Message;
            this.CommandsService.SendCommand(data).subscribe(newRes => {
              if (newRes._object.Message == "") {
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
          p_dev_id: device_id,
          channel: this.channel
        }
        this.CommandsService.SendCommand(data).subscribe(res => {
          if (typeof res._object.Message == "string") {
            this.Toast.clear()
            this.Toast.error(res._object.Message)
          }
          else {
            data.check_status = true;
            data.fb_id = res._object.Message;
            this.CommandsService.SendCommand(data).subscribe(newRes => {
              if (newRes._object.Message == "") {
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
          p_dev_id: device_id,
          channel: this.channel
        }
        this.CommandsService.SendCommand(data).subscribe(res => {
          if (typeof res._object.Message == "string") {
            this.Toast.clear()
            this.Toast.error(res._object.Message)
          }
          else {
            data.check_status = true;
            data.fb_id = res._object.Message;
            this.CommandsService.SendCommand(data).subscribe(newRes => {
              if (newRes._object.Message == "") {
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
          p_dev_id: device_id,
          channel: this.channel
        }
        this.CommandsService.SendCommand(data).subscribe(res => {
          if (typeof res._object.Message == "string") {
            this.Toast.clear()
            this.Toast.error(res._object.Message)
          }
          else {
            data.check_status = true;
            data.fb_id = res._object.Message;
            this.CommandsService.SendCommand(data).subscribe(newRes => {
              if (newRes._object.Message == "") {
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
          p_dev_id: device_id,
          channel: this.channel
        }
        this.CommandsService.SendCommand(data).subscribe(res => {
          if (typeof res._object.Message == "string") {
            this.Toast.clear()
            this.Toast.error(res._object.Message)
          }
          else {
            data.check_status = true;
            data.fb_id = res._object.Message;
            this.CommandsService.SendCommand(data).subscribe(newRes => {
              if (newRes._object.Message == "") {
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
          p_dev_id: device_id,
          channel: this.channel
        }
        this.CommandsService.SendCommand(data).subscribe(res => {
          if (typeof res._object.Message == "string") {
            this.Toast.clear()
            this.Toast.error(res._object.Message)
          }
          else {
            data.check_status = true;
            data.fb_id = res._object.Message;
            this.CommandsService.SendCommand(data).subscribe(newRes => {
              if (newRes._object.Message == "") {
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

@Component({
  selector: 'app-all-settings-dialog',
  templateUrl: './Dialogs/AllSettingsDialog.html',
  styleUrls: [
    "../pages/pages.component.scss",
    "../pages/Dialogs/ControlDialog.scss",]
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
    this.SettingsService.GetSettings().subscribe(settings => this.AllSettings = settings.data)
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
@Component({
  selector: 'app-settings-dialog',
  templateUrl: './Dialogs/SettingsDialog.html',
  styleUrls: [
    "../pages/pages.component.scss",
    "../pages/Dialogs/ControlDialog.scss",]
})
export class SettingDialogComponent implements OnInit {
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
  constructor(public SettingsService: SettingsService, public SettingTypeService: SettingTypeService, public dialog: MatDialog, public Toast: ToastrService) { }
  ngOnInit(): void {
    this.SettingTypeService.currnetSetting.subscribe(setting => this.settingName = setting)
    this.SettingTypeService.currentSettingId.subscribe(id => this.settingId = id)
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
        p_dev_id: device_id,
        channel: this.channel
      }
      if (this.channel && this.phoneNumber) {
        this.SettingsService.SendSettings(data).subscribe(res => {
          if (typeof parseInt(res._object.Message) != "number") {
            this.Toast.clear()
            this.Toast.error(res._object.Message)
          }
          else {
            data.check_status = true;
            data.fb_id = res._object.Message;
            this.SettingsService.SendSettings(data).subscribe(newRes => {
              if (newRes._object.Message == "") {
                this.Toast.clear()
                this.Toast.success(`${this.settingName} command successfully executed`, "Success")
                this.dialog.closeAll();
                this.dialog.open(AllSettingsDialogComponent)
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
        p_dev_id: device_id,
        channel: this.channel
      }
      if (this.channel) {
        this.SettingsService.SendSettings(data).subscribe(res => {
          if (typeof parseInt(res._object.Message) != "number") {
            this.Toast.clear()
            this.Toast.error(res._object.Message)
          }
          else {
            data.check_status = true;
            data.fb_id = res._object.Message;
            this.SettingsService.SendSettings(data).subscribe(newRes => {
              if (newRes._object.Message == "") {
                this.Toast.clear()
                this.Toast.success(`${this.settingName} command successfully executed`, "Success")
                this.dialog.closeAll();
                this.dialog.open(AllSettingsDialogComponent)
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
          p_dev_id: device_id,
          channel: this.channel
        }
        if (this.channel) {
          this.SettingsService.SendSettings(data).subscribe(res => {
            if (typeof parseInt(res._object.Message) != "number") {
              this.Toast.clear()
              this.Toast.error(res._object.Message)
            }
            else {
              data.check_status = true;
              data.fb_id = res._object.Message;
              this.SettingsService.SendSettings(data).subscribe(newRes => {
                if (newRes._object.Message == "") {
                  this.Toast.clear()
                  this.Toast.success(`${this.settingName} command successfully executed`, "Success")
                  this.dialog.closeAll();
                  this.dialog.open(AllSettingsDialogComponent)
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
          p_dev_id: device_id,
          channel: this.channel
        }
        if (this.channel) {
          this.SettingsService.SendSettings(data).subscribe(res => {
            if (typeof parseInt(res._object.Message) != "number") {
              this.Toast.clear()
              this.Toast.error(res._object.Message)
            }
            else {
              data.check_status = true;
              data.fb_id = res._object.Message;
              this.SettingsService.SendSettings(data).subscribe(newRes => {
                if (newRes._object.Message == "") {
                  this.Toast.clear()
                  this.Toast.success(`${this.settingName} command successfully executed`, "Success")
                  this.dialog.closeAll();
                  this.dialog.open(AllSettingsDialogComponent)
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
          p_dev_id: device_id,
          channel: this.channel
        }
        if (this.channel) {
          this.SettingsService.SendSettings(data).subscribe(res => {
            if (typeof parseInt(res._object.Message) != "number") {
              this.Toast.clear()
              this.Toast.error(res._object.Message)
            }
            else {
              data.check_status = true;
              data.fb_id = res._object.Message;
              this.SettingsService.SendSettings(data).subscribe(newRes => {
                if (newRes._object.Message == "") {
                  this.Toast.clear()
                  this.Toast.success(`${this.settingName} command successfully executed`, "Success")
                  this.dialog.closeAll();
                  this.dialog.open(AllSettingsDialogComponent)
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
      // this.apn = $('.apnInput').val().toString();
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
          p_dev_id: device_id,
          channel: this.channel
        }
        if (this.channel) {
          this.SettingsService.SendSettings(data).subscribe(res => {
            if (typeof parseInt(res._object.Message) != "number") {
              this.Toast.clear()
              this.Toast.error(res._object.Message)
            }
            else {
              data.check_status = true;
              data.fb_id = res._object.Message;
              this.SettingsService.SendSettings(data).subscribe(newRes => {
                if (newRes._object.Message == "") {
                  this.Toast.clear()
                  this.Toast.success(`${this.settingName} command successfully executed`, "Success")
                  this.dialog.closeAll();
                  this.dialog.open(AllSettingsDialogComponent)
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
      this.mileage = $('.MileageInput').val().toString();
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
          p_dev_id: device_id,
          channel: this.channel
        }
        if (this.channel) {
          this.SettingsService.SendSettings(data).subscribe(res => {
            if (typeof parseInt(res._object.Message) != "number") {
              this.Toast.clear()
              this.Toast.error(res._object.Message)
            }
            else {
              data.check_status = true;
              data.fb_id = res._object.Message;
              this.SettingsService.SendSettings(data).subscribe(newRes => {
                if (newRes._object.Message == "") {
                  this.Toast.clear()
                  this.Toast.success(`${this.settingName} command successfully executed`, "Success")
                  this.dialog.closeAll();
                  this.dialog.open(AllSettingsDialogComponent)
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
          p_dev_id: device_id,
          channel: this.channel
        }
        if (this.channel) {
          this.SettingsService.SendSettings(data).subscribe(res => {
            if (typeof parseInt(res._object.Message) != "number") {
              this.Toast.clear()
              this.Toast.error(res._object.Message)
            }
            else {
              data.check_status = true;
              data.fb_id = res._object.Message;
              this.SettingsService.SendSettings(data).subscribe(newRes => {
                if (newRes._object.Message == "") {
                  this.Toast.clear()
                  this.Toast.success(`${this.settingName} command successfully executed`, "Success")
                  this.dialog.closeAll();
                  this.dialog.open(AllSettingsDialogComponent)
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
    this.dialog.open(AllSettingsDialogComponent)
  }

}
//#endregion

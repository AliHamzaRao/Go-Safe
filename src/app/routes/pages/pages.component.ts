import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  ViewChildren,
  QueryList,
} from "@angular/core";
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
declare var L;
var map;
var el;
var reg_no;
var mapType;
var rect;
var circle;
var plgn;
var marker;
var polyline;
var Historydata = [];
var dataArr: PacketParser[] = [];
@Component({
  selector: "app-pages",
  templateUrl: "./pages.component.html",
  styleUrls: ["./pages.component.scss"],
  providers: [MenuService],
})
export class PagesComponent implements OnInit {
  public settings: Settings;
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
  message: string;
  latitude: 0;
  longitude: 0;
  interval: number = 1000;
  markerData = [];
  markersData = [];
  currentState: number = 0;
  setTime: any;
  marker: any;
  notifications: any = [];
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
    public RegistrationNoService: RegistrationNoService
  ) {
    this.settings = this.appSettings.settings;
  }
  //#region OnInit
  ngOnInit() {
    this.logo = localStorage.getItem("CompanyLogo");
    this.mapTypeService.newMap.subscribe((mapType) => {
      mapType = mapType;
      this.currentMap = mapType;
    });
    this.AllDeviceDataService.AllDevices.subscribe((data) => (this.AllDevices = JSON.parse(data)));
    this.getVehTree();
    setInterval(() => {
      this.childArray = [];
      $('.notificationsUnread').addClass('d-none')
      $(".notificationPanel").addClass("d-none");
      $(".notificationsRead").addClass("d-none");
      this.dashboardService.GetVehiclesTree().subscribe((data) => {
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
        setTimeout(() => {
          $(".speedCheck").each(function () {
            var vehicle = $(this).attr("data-idforspeed");
            var obj = dataArr.find(
              (item: PacketParser) => item.device_id == vehicle
            );

            obj ? $(this).html(`${obj.speed} <br> kph`) : null;
          });
          $(".veh_status").each(function () {
            var device = $(this).attr("device-id-vrn");
            var object = dataArr.find(
              (item: PacketParser) => item.device_id == device
            );
            object ?
              object.veh_status == "Idle"
                ? $(this).html(
                  `<img style="height:30px; transform:rotate(${object.dir_angle}deg)"  src="../../../assets/icons/YellowArrow.png" alt=${object.veh_status}>`
                )
                : object.veh_status == "Moving"
                  ? $(this).html(
                    `<img style="height:30px; transform:rotate(${object.dir_angle}deg)"  src="../../../assets/icons/YellowArrow.png" alt=${object.veh_status}>`
                  )
                  : object.veh_status == "Parked"
                    ? $(this).html(
                      `<img style="height:30px; transform:rotate(${object.dir_angle}deg)"  src="../../../assets/icons/RedArrow.png" alt=${object.veh_status}>`
                    )
                    : $(this).html(
                      `<img style="height:30px; transform:rotate(${object.dir_angle}deg)"  src="../../../assets/icons/Disconected.png" alt=${object.veh_status}>`
                    )
              : null

          });
          if (this.checkedDevices.length) {
            this.markers = [];
            setTimeout(() => {
              console.log(this.checkedDevices)
              this.checkedDevices.forEach((item) => {
                this.AllMarkers.forEach((CM) => {
                  map.removeLayer(CM);
                  $(
                    ".leaflet-marker-icon.leaflet-zoom-animated.leaflet-clickable"
                  ).remove();
                  $(".leaflet-marker-shadow.leaflet-zoom-animated").remove();
                });
                let obj = this.childArray.find((data: Vehicles) => data.device_id == item.id);
                this.MarkerSettingFunction(
                  item.event,
                  obj.datatrack,
                  obj.device_id
                );

                $(`#${item.id}`).prop("checked", true);
              }, 5000);
              this.checkedDevices = [];
              this.AllMarkers = [];
            });
          }
        }, 3000);
      });
    }, 300000);
    mapType = $(".mapDropdown").find(":selected").val();
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
  // MatMapType(e){
  //   
  // }
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
  getVehTree() {
    try {
      // // this.route.data.subscribe((data) => {
      // //   data["model"].data.forEach((item: any, index: any) => {
      // //     this.TREE_DATA.push(item);
      // //   });
      // //   this.TREE_DATA[1].SubMenu.sort(
      // //     (a: { grp_name: number }, b: { grp_name: number }) =>
      // //       a.grp_name > b.grp_name ? 1 : b.grp_name > a.grp_name ? -1 : 0
      // //   );
      // // });
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
          this.Toast.error(data.message, `Error Code ${data.code}`);
        }
        setTimeout(() => {
          // let anchor = document.createElement('a')
          // var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ TreeData: this.TREE_DATA[1], paprsedData: dataArr }));
          // anchor.setAttribute("href", dataStr);
          // anchor.setAttribute("download", "Data.json");
          // anchor.click();
          $(".speedCheck").each(function () {
            var vehicle = $(this).attr("data-idforspeed");
            var obj = dataArr.find(
              (item: PacketParser) => item.device_id == vehicle
            );
            obj ? $(this).html(`${obj.speed} <br> kph`) : null;
          });
          $(".veh_status").each(function () {
            var device = $(this).attr("device-id-vrn");
            var object = dataArr.find(
              (item: PacketParser) => item.device_id == device
            );
            object ?
              object.veh_status == "Idle"
                ? $(this).html(
                  `<img style="height:30px; transform:rotate(${object.dir_angle}deg)"  src="../../../assets/icons/YellowArrow.png" alt=${object.veh_status}>`
                )
                : object.veh_status == "Moving"
                  ? $(this).html(
                    `<img style="height:30px; transform:rotate(${object.dir_angle}deg)"  src="../../../assets/icons/YellowArrow.png" alt=${object.veh_status}>`
                  )
                  : object.veh_status == "Parked"
                    ? $(this).html(
                      `<img style="height:30px; transform:rotate(${object.dir_angle}deg)"  src="../../../assets/icons/RedArrow.png" alt=${object.veh_status}>`
                    ) : $(this).html(
                      `<img style="height:30px; transform:rotate(${object.dir_angle}deg)"  src="../../../assets/icons/Disconected.png" alt=${object.veh_status}>`
                    )
              : null
          });
        }, 3000);
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
    map = L.map(el).setView([this.lat, this.lng], 10);
    L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors',
    }).addTo(map);
  }
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
  toggleDisplay() {
    $(".vehicleCardLeaflet").addClass("d-none");
    $(".vehicleCardLeafletMore").addClass("d-none");
  }
  export() {
    $(".export").toggleClass("d-none");
  }
  exportToExcel() {
    this.ExportService.downloadExcelFile(Historydata, reg_no);
  }
  exportToPDF() {
    this.ExportService.downloadPDF(Historydata, reg_no);
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
    this.markers.forEach((element: any, index: string | number) => {
      if ((this.markers[index][1] === "0", this.markers[index][2] === "0")) {
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
        map.setView([this.lat, this.lng], 12);
        currentMarker.addTo(map);
        this.AllMarkers.push(currentMarker);
      }
    });
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
      this.Toast.error(
        "Cannot Show device detail, until History is opened",
        "Error Showing device Details"
      );
      return null;
    } else {
      $(".vehicleCardLeaflet").removeClass("d-none");
      $(".vehicleCardLeafletMore").addClass("d-none");
      if (
        $(".vehicleCardLeaflet").is(":visible") ||
        $(".vehicleCardLeafletMore").is(":visible")
      ) {
        setTimeout(() => {
          this.closeDetails();
        }, 10000);
      }
    }
  }
  // #endregion

  MarkerSettingFunction(e, DataTrack: string, _id: any) {
    $(".vehicleCardLeaflet").addClass("d-none");
    $(".vehicleCardLeafletMore").addClass("d-none");
    let marker: string[];
    if (e.target.checked) {
      if (mapType === "Google Maps") {
        this.newPacketParse = new PacketParser(DataTrack);
        this.data = { ...this.newPacketParse };
        this.lat = parseFloat(this.data.lat);
        this.lng = parseFloat(this.data.lng);
        marker = [this.data.device_id, this.data.lat, this.data.lng];
        debugger;
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
        $('.notificationsUnread').removeClass('d-none')
        this.AllDeviceDataService.SetDevices(JSON.stringify(this.AllDevices));
        this.AllDeviceDataService.AllDevices.subscribe((data) => {
          this.AllDevices = JSON.parse(data);
        });
      }
      if (mapType === "Open Street Maps") {
        this.newPacketParse = new PacketParser(DataTrack);
        this.data = { ...this.newPacketParse };
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
        this.AllDeviceDataService.SetDevices(JSON.stringify(this.AllDevices));
        this.AllDeviceDataService.AllDevices.subscribe((data) => {
          this.AllDevices = JSON.parse(data);
        });
      }
    } else {
      if (this.AllDevices.length === 0) {
        $('.notificationsUnread').addClass('d-none')
        $(".notificationPanel").addClass("d-none");
        $(".notificationsRead").addClass("d-none");
      }
      this.closeDetails();
      let index = this.AllDevices.findIndex(
        (item: { device_id: any }) => item.device_id === _id
      );
      let checkedDeviceIndex = this.checkedDevices.findIndex(
        (item) => item === _id
      );
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
      this.Toast.error("Please Select only One Device", "Error showing Dialog");
    } else {
      this.Toast.error("Please Select a Device", "Error Showing Dialog");
    }
    return null;
  }
  openAssetTripDialog() {
    this.dialog.open(AssetTripDialogComponent);
  }
  openControlDialog() {
    if (this.AllDevices.length == 1) {
      this.dialog.open(ControlDialogComponent);
    } else if (this.AllDevices.length > 1) {
      this.Toast.error("Please Select only One Device", "Error showing Dialog");
    } else {
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
    this.GeoFence.geoFence().subscribe((data) => {
      this.geoFences = data.data;
    });
    $(".selectionList").removeClass("d-none");
  }
  closeFencing() {
    $(".selectionList").addClass("d-none");
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

  onInputChange = (e) => {
    this.fenceType = e.target.value;
    switch (this.fenceType) {
      case "Circle":
        let thismarker: any;
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
          } else {
            return null;
          }
        });
        break;
      case "Rectangle":
        map.on("click", (e) => {
          let thismarker;
          if (this.rectMarkers.length == 2) {
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
        break;
      case "Polygon":
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
      this.Toast.error(
        "you should have atleast 2 markers to draw a polygon",
        "Error Drawing Polygon"
      );
    }
  }
  CreateFencing() {
    if (mapType === "Google Maps") {
      $(".createFenceGoogleMap").removeClass("d-none");
      $(".gmnoprint").removeClass("d-none");
      // $('.googleMap').attr('ng-reflect-drawing-manager', "[object Object]")
    } else if (mapType === "Open Street Maps") {
      $(".createFence").removeClass("d-none");
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
        this.Toast.warning("Please Fill up all the fields", "Invalid Input");
      }
    } else {
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
    } else {
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
    } else {
      this.Toast.error("Please Draw a Rectangle first", "Coundn't save");
    }
  }
  fetchNotifications() {

    let alarmsData = {
      deviceID: this.AllDevices[this.AllDevices.length - 1].device_id,
      clusterID: this.AllDevices[this.AllDevices.length - 1].cluster_id,
      vehicleID: this.AllDevices[this.AllDevices.length - 1].veh_id
    }
    this.Alarms.getNotifications(alarmsData).subscribe((res) => {
      if (!res.status) {
        this.Toast.error(res.message, "Error Showing Notifications");
      } else {
        console.log(res.data)
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
  onSubmit() {
    this.loading = true;
    let History_type = $("#historyType").val();
    let dateStart = $("#de_start").val().toLocaleString().replace("T", " ");
    let dateEnd = $("#de_end").val().toLocaleString().replace("T", " ");
    let speed = this.speed;
    let veh_reg_no = reg_no;
    var data = {
      veh_reg_no: "G1C-2424",
      History_type: "Replay",
      de_start: "2021-04-01 00:00:00.000",
      de_end: "2021-04-15 00:00:00.000",
      speed: false,
    };
    // var data = {
    //   veh_reg_no: veh_reg_no,
    //   History_type: History_type,
    //   de_start: dateStart,
    //   de_end: dateEnd,
    //   speed: speed,
    // };
    this.historyService.DeviceHistory(data).subscribe((data) => {
      this.historyDataService.setNewMarkers(JSON.stringify(data.data.History));
      if (data.status) {
        Historydata = data.data.History;
        if (data.data.History.length) {
          data.data.History.forEach((el, i) => {
            this.markerData.push([
              parseFloat(el.Latitude),
              parseFloat(el.Longitude),
            ]);
            this.lat = parseFloat(el.Latitude);
            this.lng = parseFloat(el.Longitude);
          });
          this.Toast.success(data.data.ErrorMessage, data.message);
          map.setView([this.lat, this.lng], 10);
          L.polyline(this.markerData).addTo(map);
          this.dialog.closeAll();
          if (mapType == "Google Maps") {
            $(".googleMapRecord").removeClass("d-none");
          } else {
            $(".recordDialogOffset").removeClass("d-none");
          }
          $(".vehicleCard").addClass("d-none");
          $(".vehicleCardMore").addClass("d-none");
          $(".vehicleCardLeaflet").addClass("d-none");
          $(".vehicleCardLeafletMore").addClass("d-none");
        } else {
          this.Toast.error(data.data.ErrorMessage, data.message);
        }
      } else {
        this.Toast.error(
          "We cannot proceed to your request now please check your network connection",
          "Error Drawing Route"
        );
      }
    });
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
  selector: "app-control-dialog",
  templateUrl: "./Dialogs/ControlDialog.html",
  styleUrls: [
    "../pages/pages.component.scss",
    "../pages/Dialogs/ControlDialog.scss",
  ],
})
export class ControlDialogComponent {
  constructor(public dialog: MatDialog) { }
  resetOdometer() {
    this.dialog.closeAll();
    this.dialog.open(ResetOdometerDialogComponent);
  }
  takePicture() {
    this.dialog.closeAll();
    this.dialog.open(SendTakePictureDialogComponent);
  }
}
@Component({
  selector: "app-reset-odometer-dialog",
  templateUrl: "./Dialogs/ResetOdometerDialog.html",
  styleUrls: [
    "../pages/pages.component.scss",
    "../pages/Dialogs/ResetOdometerDialog.scss",
  ],
})
export class ResetOdometerDialogComponent {
  constructor(public dialog: MatDialog) { }
  onOdometerReset() {
    this.dialog.closeAll();
    this.dialog.open(OdometerResetSuccessDialogComponent);
  }
  closeResetOdometer() {
    this.dialog.closeAll();
    this.dialog.open(ControlDialogComponent);
  }
}
@Component({
  selector: "app-reset-odometer-success-dialog",
  templateUrl: "./Dialogs/OdometerResetSuccessDialog.html",
  styleUrls: [
    "../pages/pages.component.scss",
    "../pages/Dialogs/ResetOdometerDialog.scss",
  ],
})
export class OdometerResetSuccessDialogComponent {
  constructor(public dialog: MatDialog) { }

  closeResetOdometer() {
    this.dialog.closeAll();
    this.dialog.open(ControlDialogComponent);
  }
}
@Component({
  selector: "app-take-picture-dialog",
  templateUrl: "./Dialogs/SendTakePictureDialog.html",
  styleUrls: [
    "../pages/pages.component.scss",
    "../pages/Dialogs/TakePictureDialog.scss",
  ],
})
export class SendTakePictureDialogComponent {
  constructor(public dialog: MatDialog) { }
  sendTakePicture() {
    this.dialog.closeAll();
    this.dialog.open(PictureChannelDialogComponent);
  }
  back() {
    this.dialog.closeAll();
    this.dialog.open(ControlDialogComponent);
  }
  closeTakePicture() {
    return null;
  }
}
@Component({
  selector: "app-picture-channel-dialog",
  templateUrl: "./Dialogs/PictureChannelDialog.html",
  styleUrls: [
    "../pages/pages.component.scss",
    "../pages/Dialogs/TakePictureDialog.scss",
  ],
})
export class PictureChannelDialogComponent {
  constructor(public dialog: MatDialog) { }
  back() {
    this.dialog.closeAll();
    this.dialog.open(ControlDialogComponent);
  }
  sendTakePicture() {
    this.dialog.closeAll();
    this.dialog.open(PictureTakenDialogComponent);
  }
  closeTakePicture() {
    this.dialog.closeAll();
    this.dialog.open(ControlDialogComponent);
  }
}

@Component({
  selector: "app-picture-taken-dialog",
  templateUrl: "./Dialogs/PictureTakeSuccessDialog.html",
  styleUrls: [
    "../pages/pages.component.scss",
    "../pages/Dialogs/TakePictureDialog.scss",
  ],
})
export class PictureTakenDialogComponent {
  constructor(public dialog: MatDialog) { }
  back() {
    this.dialog.closeAll();
    this.dialog.open(ControlDialogComponent);
  }
  closeTakePicture() {
    this.dialog.closeAll();
  }
}
//#endregion

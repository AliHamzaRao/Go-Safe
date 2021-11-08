import { Component, OnInit, ViewChild, HostListener, ViewChildren, QueryList } from '@angular/core';
// import { Router, NavigationEnd } from '@angular/router';
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { AppSettings } from '../../_core/settings/app.settings';
import { Settings } from '../../_core/settings/app.settings.model';
import { MenuService } from 'src/app/theme/components/menu/menu.service';
import { PacketParser } from "../dashboard/PacketParser"
// import { VehicleListResolver } from '../../_resolvers/Vehicle_Post_Resolver';
import 'leaflet-map';
import { MatDialog } from '@angular/material/dialog';
import { markerService } from 'src/app/_core/_AppServices/MarkerService';
import { mapTypeService } from 'src/app/_core/_AppServices/MapTypeService';
import { AllDevicesDataService } from 'src/app/_core/_AppServices/AllDevicesDataService';
import { FormGroup } from "@angular/forms"
import { historyService } from 'src/app/_core/_AppServices/historyService';
import { historyDataService } from 'src/app/_core/_AppServices/HistoryDataService';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ToastrService } from "ngx-toastr"
import { SingleDeviceDataService } from 'src/app/_core/_AppServices/SingleDeviceDataService';
declare var L;
var map;
var el;
var reg_no;
var mapType;
@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
  providers: [MenuService],
})
export class PagesComponent implements OnInit {

  public settings: Settings;
  el: any;
  map: any;
  lat = 0;
  lng = 0;
  zoom = 2;
  googleMapType = "roadmap";
  TREE_DATA: any = [];
  AllDevices: any = [];
  singleDeviceData: any = [];
  mapType: any;
  markers: any = [];
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

  @ViewChild(DashboardComponent, { static: true }) child: DashboardComponent;
  @ViewChild('sidenav') sidenav: any;
  @ViewChild('backToTop') backToTop: any;
  @ViewChildren(PerfectScrollbarDirective) pss: QueryList<PerfectScrollbarDirective>;
  public menus = ['vertical', 'horizontal'];
  public menuOption: string;
  public menuTypes = ['default', 'compact', 'mini'];
  public menuTypeOption: string;
  public lastScrollTop: number = 0;
  public showBackToTop: boolean = false;
  public toggleSearchBar: boolean = false;
  private defaultMenu: string;

  constructor(public appSettings: AppSettings, public router: Router, private menuService: MenuService, public dialog: MatDialog, public route: ActivatedRoute, public markersService: markerService, public mapTypeService: mapTypeService, public AllDeviceDataService: AllDevicesDataService, public historyDataService: historyDataService, public singleDeviceDataService: SingleDeviceDataService, public Toast: ToastrService) {
    this.settings = this.appSettings.settings;
  }
  //#region OnInit
  ngOnInit() {
    this.mapTypeService.newMap.subscribe((mapType) => mapType = mapType)
    this.AllDeviceDataService.AllDevices.subscribe((data) => this.AllDevices = JSON.parse(data))
    this.route.data.subscribe((data) => {
      data["model"].data.forEach((item: any, index: any) => {
        this.TREE_DATA.push(item);
      });
      this.TREE_DATA[1].SubMenu.sort((a: { grp_name: number; }, b: { grp_name: number; }) => (a.grp_name > b.grp_name) ? 1 : ((b.grp_name > a.grp_name) ? -1 : 0))
    });
    mapType = $(".mapDropdown").find(':selected').val()
    $('.mapDropdown').on('change', ($event) => {
      $(".vehicleCard").addClass('d-none');
      $('.vehicleCardMore').addClass('d-none')
      $('.agm-map-container-inner').addClass('rounded')
      mapType = $(".mapDropdown").find(':selected').val()
      this.loadLeafLetMap();
      setTimeout(() => {
        this.setLeafLetMarkers();
      }, 1000);
    })
    if (window.innerWidth <= 768) {
      this.settings.menu = 'vertical';
      this.settings.sidenavIsOpened = false;
      this.settings.sidenavIsPinned = false;
    }
    this.menuOption = this.settings.menu;
    this.menuTypeOption = this.settings.menuType;
    this.defaultMenu = this.settings.menu;
    this.loadLeafLetMap();
    setTimeout(() => {
      this.setLeafLetMarkers();
    }, 1000);
  }
  //#endregion
  //#region AfterViewInit Hook
  ngAfterViewInit() {
    this.loadLeafLetMap();
    setTimeout(() => { this.settings.loadingSpinner = false }, 300);
    this.backToTop.nativeElement.style.display = 'none';
    this.router.events.subscribe(event => {
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
      this.menuService.expandActiveSubMenu(this.menuService.getVerticalMenuItems());
  }
  //#endregion
  //#region Logout
  Logout() {
    localStorage.removeItem("token");
    this.router.navigate(['/login']);
  }
  //#endregion
  //#region Menu Events
  public chooseMenu() {
    this.settings.menu = this.menuOption;
    this.defaultMenu = this.menuOption;
    this.router.navigate(['/']);
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
    (event.target.scrollTop > 300) ? this.backToTop.nativeElement.style.display = 'flex' : this.backToTop.nativeElement.style.display = 'none';
    if (this.settings.menu == 'horizontal') {
      if (this.settings.fixedHeader) {
        var currentScrollTop = (event.target.scrollTop > 56) ? event.target.scrollTop : 0;
        if (currentScrollTop > this.lastScrollTop) {
          document.querySelector('#horizontal-menu').classList.add('sticky');
          event.target.classList.add('horizontal-menu-hidden');
        }
        else {
          document.querySelector('#horizontal-menu').classList.remove('sticky');
          event.target.classList.remove('horizontal-menu-hidden');
        }
        this.lastScrollTop = currentScrollTop;
      }
      else {
        if (event.target.scrollTop > 56) {
          document.querySelector('#horizontal-menu').classList.add('sticky');
          event.target.classList.add('horizontal-menu-hidden');
        }
        else {
          document.querySelector('#horizontal-menu').classList.remove('sticky');
          event.target.classList.remove('horizontal-menu-hidden');
        }
      }
    }
  }
  public scrollToTop() {
    this.pss.forEach(ps => {
      if (ps.elementRef.nativeElement.id == 'main' || ps.elementRef.nativeElement.id == 'main-content') {
        ps.scrollToTop(0, 250);
      }
    });
  }
  @HostListener('window:resize')
  public onWindowResize(): void {
    if (window.innerWidth <= 768) {
      this.settings.sidenavIsOpened = false;
      this.settings.sidenavIsPinned = false;
      this.settings.menu = 'vertical'
    }
    else {
      (this.defaultMenu == 'horizontal') ? this.settings.menu = 'horizontal' : this.settings.menu = 'vertical'
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
          if (child.children[0].classList.contains('expanded')) {
            child.children[0].classList.remove('expanded');
            child.children[1].classList.remove('show');
          }
        }
      }
    }
  }
  //#endregion
  //#region Load Leaflet Maps
  loadLeafLetMap() {
    setTimeout(() => {
      el = document.getElementById("leaflet-map");
      L.Icon.Default.imagePath = 'assets/img/vendor/leaflet/';
      map = L.map(el).setView([this.lat, this.lng], 10);
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);
    });
  }
  stop() {
    $('.leaflet-marker-icon.leaflet-zoom-animated.leaflet-clickable').remove()
    $('.leaflet-marker-shadow.leaflet-zoom-animated').remove()
    this.currentState = 0;
    this.pause();
    this.interval = 1000;
  }
  drawLine() {
    this.historyDataService.newMarkers.subscribe(data => this.markersData = JSON.parse(data))
    this.markersData.forEach((el) => {
      this.markerData.push([el.Latitude, el.Longitude])
    })
  }
  play() {
    this.drawLine()
    $('.pauseBtn').removeClass('d-none');
    $('.playBtn').addClass('d-none')
    if (this.currentState !== this.markerData.length - 1) {
      this.setTime = setInterval(() => {
        this.latitude = this.markerData[this.currentState][0];
        this.longitude = this.markerData[this.currentState][1];
        this.currentState++;
        if (this.currentState === this.markerData.length - 1) {
          this.pause();
          this.markerData = [];
        }
        this.marker = L.marker([this.latitude, this.longitude]).addTo(map)
        map.removeLayer(this.marker)
        $('.leaflet-marker-icon.leaflet-zoom-animated.leaflet-clickable').remove()
        $('.leaflet-marker-shadow.leaflet-zoom-animated').remove()
        this.marker = L.marker([this.latitude, this.longitude]).addTo(map)
        map.setView([this.latitude, this.longitude], 17)
      }, this.interval);
    }
  }
  pause() {
    $('.pauseBtn').addClass('d-none');
    $('.playBtn').removeClass('d-none')
    clearInterval(this.setTime)
    this.interval = null;
    this.interval = 500
    this.markerData = [];
    this.interval = this.interval
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
  draw() {
    $(".shapeSelect").toggleClass("d-none")
  }
  toggleInfoCard() {
    $('.infoCard').toggleClass('d-none')
  }
  //#endregion
  //#region SetLeafLet Markers
  setLeafLetMarkers() {
    this.markers.forEach((element: any, index: string | number) => {
      if (this.markers[index][1] === '0', this.markers[index][2] === '0') {
        return false;
      }
      else {
        new L.marker([this.markers[index][1], this.markers[index][2]]).bindPopup("<strong>Current Locataion</strong>", { maxWidth: 500 })
          .addTo(map).on('click', () => {
            this.getMarkerInfo([this.markers[index][0], this.markers[index][1], this.markers[index][2]])
          })
        map.setView([this.lat, this.lng], 12);
        this.mapBounds.push([this.markers[index][1], this.markers[index][2]])
        map.fitBounds(this.mapBounds);
      }
    });
  }
  //#endregion
  //#region Selected Marker Info
  getMarkerInfo(info: any[]) {

    this.AllDeviceDataService.AllDevices.subscribe((data) => this.AllDevices = JSON.parse(data))
    let singleDevice = this.AllDevices.filter((item: { device_id: any; }) => item.device_id === info[0]);
    this.singleDeviceData = singleDevice;
    this.singleDeviceDataService.SetDevice(JSON.stringify(this.singleDeviceData))
    map.setView([info[1], info[2]], 20);
    this.lat = info[1];
    this.lng = info[2];
    if ($('.recordDialogOffset').is(":visible") || $(".googleMapRecord").is(":visible")) {
      this.Toast.error("Cannot Show device detail, until History is opened", "Error Showing device Details")
      return null;
    }
    else {
      $('.vehicleCard').removeClass('d-none');
      $('.vehicleCardMore').addClass('d-none');

    }
  }
  // #endregion
  //#region On CheckBox
  onCheck(e, DataTrack: string, _id: any) {
    $(".vehicleCard").addClass('d-none');
    $('.vehicleCardMore').addClass('d-none')
    let marker: string[];
    if (e.target.checked) {
      this.newPacketParse = new PacketParser(DataTrack);
      this.data = { ...this.newPacketParse };
      this.lat = parseFloat(this.data.lat);
      this.lng = parseFloat(this.data.lng);
      marker = [this.data.device_id, this.data.lat, this.data.lng];
      this.markers.push(marker);
      let markerString = JSON.stringify(this.markers)
      this.markersService.SetMarkers(markerString);
      this.setLeafLetMarkers()
      this.AllDevices.push(this.data);
      this.AllDeviceDataService.SetDevices(JSON.stringify(this.AllDevices))
      this.AllDeviceDataService.AllDevices.subscribe((data) => {
        this.AllDevices = JSON.parse(data)
      })
    }
    else {
      this.closeDetails();
      let index = this.AllDevices.findIndex((item: { device_id: any; }) => item.device_id === _id)
      this.AllDevices.splice(index, 1)
      let MarkerIndex = this.markers.findIndex((item: any[]) => item[0] === _id);
      this.markers.splice(MarkerIndex, 1)
      let markerString = JSON.stringify(this.markers)
      this.markersService.SetMarkers(markerString);
      setTimeout(() => {
        this.AllDeviceDataService.SetDevices(JSON.stringify(this.AllDevices))
        this.AllDeviceDataService.AllDevices.subscribe((data) => this.AllDevices = JSON.parse(data))
      }, 100);
      if (map) {
        map.remove();
        this.loadLeafLetMap();
      } setTimeout(() => {
        this.setLeafLetMarkers();
      }, 1000)
      if (!this.AllDevices.length) {
        $('.vehicleCard').addClass('d-none')
      }
    }
  }
  //#endregion
  //#region Close Car Details Card
  closeDetails() {
    $('.vehicleCard').addClass('d-none')
    $('.vehicleCardMore').addClass('d-none')
  }
  //#endregion
  //#region Dialog Methods 
  openHistoryDialog() {
    if (this.AllDevices.length == 1) {
      if ($(".vehicleCardMore").is(":visible") || $('.vehicleCard').is(":visible")) {
        this.Toast.error("Please Close Details to proceed", "Error showing Dialog");
      }
      else {

        reg_no = this.AllDevices[0].veh_reg_no;
        this.dialog.open(historyDialogComponent);
        this.closeDetails();
      }
    }
    else if (this.AllDevices.length > 1) {
      this.Toast.error("Please Select only One Device", "Error showing Dialog");

    }
    else {
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
    }
    else if (this.AllDevices.length > 1) {
      this.Toast.error("Please Select only One Device", "Error showing Dialog");
    }
    else {
      this.Toast.error("Please Select a Device", "Error Showing Dialog");
    }
    return null;
  }
  closeHistoryDialog() {
    this.dialog.closeAll();
    $(".vehicleCard").addClass('d-none');
    $('.vehicleCardMore').addClass('d-none')
  }
  //#endregion
}
//#region Dialogs Component Declarations
@Component({
  selector: 'app-history-dialog',
  templateUrl: './Dialogs/historyDialog.html',
  styleUrls: ["../pages/pages.component.scss"]
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
  public form: FormGroup
  constructor(public dialog: MatDialog, public historyService: historyService, public historyDataService: historyDataService, public Toast: ToastrService) { }
  ngOnInit() {
  }
  onCheck(e) {
    this.speed = e.target.checked;
  }
  onSubmit() {
    let History_type = $('#historyType').val();
    let dateStart = $('#de_start').val().toLocaleString().replace("T", " ");
    let dateEnd = $('#de_end').val().toLocaleString().replace("T", " ");
    let speed = this.speed;
    let veh_reg_no = reg_no;
    var data = {
      veh_reg_no: "G797W",
      History_type: History_type,
      de_start: dateStart,
      de_end: dateEnd,
      speed: speed,
    }
    this.historyService.DeviceHistory(data).subscribe((data) => {
      this.historyDataService.setNewMarkers(JSON.stringify(data.data.History))
      if (data.status) {
        if (data.data.History.length) {
          data.data.History.forEach((el, i) => {
            this.markerData.push([parseFloat(el.Latitude), parseFloat(el.Longitude)])
            this.lat = parseFloat(el.Latitude);
            this.lng = parseFloat(el.Longitude)
          })
          this.Toast.success(data.data.ErrorMessage, data.message)
          map.setView([this.lat, this.lng], 10)
          L.polyline(this.markerData).addTo(map)
          this.dialog.closeAll();
          if (mapType == "Google Maps") {
            $('.googleMapRecord').removeClass("d-none")
          }
          else {
            $(".recordDialogOffset").removeClass("d-none")
          }
          $(".vehicleCard").addClass('d-none');
          $('.vehicleCardMore').addClass('d-none')
        }
        else {
          this.Toast.error(data.data.ErrorMessage, data.message)
        }
      }
      else {
        this.Toast.error("We cannot proceed to your request now please check your network connection", "Error Drawing Route")
      }
    })
  }
};
// @Component({
//   selector: 'app-history-record-dialog',
//   templateUrl: './Dialogs/historyRecordDialog.html',
//   styleUrls: ["../pages/pages.component.scss"]
// })
// export class historyRecordDialogComponent {
//   toggleDisplay() {
//     $('.playPause').toggleClass('d-none')
//     $(".vehicleCard").addClass('d-none');
//     $('.vehicleCardMore').addClass('d-none')
//   }
//   export() {
//     $('.export').toggleClass('d-none')
//   }
//   toggleInfoCard() {
//     $('.infoCard').toggleClass('d-none')
//   }
// }
@Component({
  selector: 'app-asset-report-dialog',
  templateUrl: './Dialogs/AssetTripDialog.html',
  styleUrls: ["../pages/pages.component.scss"]
})
export class AssetTripDialogComponent {
  constructor(public dialog: MatDialog) { }
};
@Component({
  selector: 'app-control-dialog',
  templateUrl: './Dialogs/ControlDialog.html',
  styleUrls: ["../pages/pages.component.scss", "../pages/Dialogs/ControlDialog.scss"]
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
};
@Component({
  selector: 'app-reset-odometer-dialog',
  templateUrl: './Dialogs/ResetOdometerDialog.html',
  styleUrls: ["../pages/pages.component.scss", "../pages/Dialogs/ResetOdometerDialog.scss"]
})
export class ResetOdometerDialogComponent {
  constructor(public dialog: MatDialog) { }
  onOdometerReset() {
    this.dialog.closeAll();
    this.dialog.open(OdometerResetSuccessDialogComponent)
  }
  closeResetOdometer() {
    this.dialog.closeAll();
    this.dialog.open(ControlDialogComponent)
  }

};
@Component({
  selector: 'app-reset-odometer-success-dialog',
  templateUrl: './Dialogs/OdometerResetSuccessDialog.html',
  styleUrls: ["../pages/pages.component.scss", "../pages/Dialogs/ResetOdometerDialog.scss"]
})
export class OdometerResetSuccessDialogComponent {
  constructor(public dialog: MatDialog) { }

  closeResetOdometer() {
    this.dialog.closeAll();
    this.dialog.open(ControlDialogComponent)
  }
};
@Component({
  selector: 'app-take=picture-dialog',
  templateUrl: './Dialogs/SendTakePictureDialog.html',
  styleUrls: ["../pages/pages.component.scss", "../pages/Dialogs/TakePictureDialog.scss"]
})
export class SendTakePictureDialogComponent {
  constructor(public dialog: MatDialog) { }
  sendTakePicture() {
    console.log("Take Picture")
  }
  closeTakePicture() {
    console.log("Close Take Picture")
  }

};
//#endregion
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
declare var L;
@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
  providers: [MenuService]
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
  private defaultMenu: string; //declared for return default menu when window resized 

  constructor(public appSettings: AppSettings, public router: Router, private menuService: MenuService, public dialog: MatDialog, public route: ActivatedRoute) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      data["model"].data.forEach((item: any, index: any) => {
        this.TREE_DATA.push(item);
      });
      this.TREE_DATA[1].SubMenu.sort((a: { grp_name: number; }, b: { grp_name: number; }) => (a.grp_name > b.grp_name) ? 1 : ((b.grp_name > a.grp_name) ? -1 : 0))
    });

    this.mapType = $(".mapDropdown").find(':selected').val()
    $('.mapDropdown').on('change', ($event) => {
      console.log($event)
      $(".vehicleCard").addClass('d-none');
      $('.vehicleCardMore').addClass('d-none')
      $('.agm-map-container-inner').addClass('rounded')
      this.mapType = $(".mapDropdown").find(':selected').val()
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
  Logout() {
    localStorage.removeItem("token");
    this.router.navigate(['/login']);
  }
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

  loadLeafLetMap() {
    setTimeout(() => {
      this.el = document.getElementById("leaflet-map");
      L.Icon.Default.imagePath = 'assets/img/vendor/leaflet/';
      this.map = L.map(this.el).setView([this.lat, this.lng], 10);
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(this.map);
    });
  }
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
  openHistoryDialog() {
    this.dialog.open(historyDialogComponent);
    $(".vehicleCard").addClass('d-none');
    $('.vehicleCardMore').addClass('d-none')
  }
  openAssetTripDialog() {
    this.dialog.open(AssetTripDialogComponent);
  }

  openControlDialog() {
    this.dialog.open(ControlDialogComponent);
  }
  closeHistoryDialog() {
    // console.log(e)
    this.dialog.closeAll();
    $(".vehicleCard").addClass('d-none');
    $('.vehicleCardMore').addClass('d-none')
  }

  // #region Parent Checkbox
  onParentCheckBox(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.checked) {
      let singleDevice: any = $('.singleDevice input[type="checkbox"]');
      for (let i = 0; i <= singleDevice.length; i++) {
        console.log(singleDevice[i]);
        singleDevice[i].attr('checked', 'checked')
        let data_track = singleDevice[i].attr('data-datatrack');
        let deviceId = singleDevice[i].attr('data-device_id');
        this.onCheck(e, data_track, deviceId)
      }
    }
  }
  // #endregion


  setLeafLetMarkers() {
    this.markers.forEach((element: any, index: string | number) => {
      if (this.markers[index][1] === '0', this.markers[index][2] === '0') {
        return false;
      }
      else {
        new L.marker([this.markers[index][1], this.markers[index][2]])
          .addTo(this.map).on('click', () => {
            this.getMarkerInfo([this.markers[index][0], this.markers[index][1], this.markers[index][2]])
          })
        // $('.leaflet-marker-icon.leaflet-zoom-animated.leaflet-clickable').attr('id',this.markers[index][0])
        this.map.setView([this.lat, this.lng], 12);
        this.mapBounds.push([this.markers[index][1], this.markers[index][2]])
        this.map.fitBounds(this.mapBounds);
      }
    });
  }

  // #region Selected Marker Info
  getMarkerInfo(info: any[]) {
    debugger;
    let singleDevice = this.AllDevices.filter((item: { device_id: any; }) => item.device_id === info[0]);
    this.singleDeviceData = singleDevice;
    this.map.setView([info[1], info[2]], 20);
    this.lat = info[1];
    this.lng = info[2];
    $('.vehicleCard').removeClass('d-none');
    $('.vehicleCardMore').addClass('d-none');
  }
  // #endregion

  onCheck(e, DataTrack: string, _id: any) {
    debugger;
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
      this.AllDevices.push(this.data);
      this.setLeafLetMarkers();
    }
    else {
      this.closeDetails();
      this.map.remove();
      this.loadLeafLetMap();
      setTimeout(() => {
        this.setLeafLetMarkers();
      }, 1000)
      let index = this.AllDevices.findIndex((item: { device_id: any; }) => item.device_id === _id)
      this.AllDevices.splice(index, 1)
      let MarkerIndex = this.markers.findIndex((item: any[]) => item[0] === _id);
      this.markers.splice(MarkerIndex, 1)
      if (!this.AllDevices.length) {
        $('.vehicleCard').addClass('d-none')
      }
    }
  }

  closeDetails() {
    $('.vehicleCard').addClass('d-none')
    $('.vehicleCardMore').addClass('d-none')
  }
}
@Component({
  selector: 'app-history-dialog',
  templateUrl: './Dialogs/historyDialog.html',
  styleUrls: ["../pages/pages.component.scss"]
})
export class historyDialogComponent {
  constructor(public dialog: MatDialog) { }
  closeHistoryDialog() {
    this.dialog.closeAll();
    this.dialog.open(historyRecordDialogComponent)
    $(".vehicleCard").addClass('d-none');
    $('.vehicleCardMore').addClass('d-none')
  }
};

@Component({
  selector: 'app-history-record-dialog',
  templateUrl: './Dialogs/historyRecordDialog.html',
  styleUrls: ["../pages/pages.component.scss"]
})
export class historyRecordDialogComponent {
  toggleDisplay() {
    $('.playPause').toggleClass('d-none')
    $(".vehicleCard").addClass('d-none');
    $('.vehicleCardMore').addClass('d-none')
  }
  export() {
    console.log("test")
    $('.export').toggleClass('d-none')
  }
  toggleInfoCard() {
    $('.infoCard').toggleClass('d-none')
  }
}
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
  styleUrls: ["../pages/pages.component.scss"]
})
export class ControlDialogComponent {
  constructor(public dialog: MatDialog) { }
};
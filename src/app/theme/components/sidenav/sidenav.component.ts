import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { AppSettings } from '../../../_core/settings/app.settings';
import { Settings } from '../../../_core/settings/app.settings.model';
import { MenuService } from '../menu/menu.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ MenuService ]
})
export class SidenavComponent implements OnInit {
  public userImage= '../assets/img/users/user.jpg';
  public menuItems:Array<any>;
  public settings: Settings;
  constructor(public appSettings:AppSettings, public menuService:MenuService,private router: Router){
      this.settings = this.appSettings.settings; 
  }

  ngOnInit() {
    this.menuItems = this.menuService.getVerticalMenuItems();
  }

  public closeSubMenus(){
    let menu = document.getElementById("vertical-menu");
    if(menu){
      for (let i = 0; i < menu.children[0].children.length; i++) {
        let child = menu.children[0].children[i];
        if(child){
          if(child.children[0].classList.contains('expanded')){
              child.children[0].classList.remove('expanded');
              child.children[1].classList.remove('show');
          }
        }
      }
    }
  }
  Logout(){
    localStorage.removeItem("token");
    this.router.navigate(['/login']);
  }
}

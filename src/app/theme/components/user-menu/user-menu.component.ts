import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserMenuComponent implements OnInit {
  public userImage = '../assets/img/users/user.jpg';
  constructor(private router: Router) { }

  ngOnInit() {
  }
  Logout(){
    localStorage.removeItem("token");
    this.router.navigate(['/login']);
  }
}

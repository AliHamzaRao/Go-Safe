import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { CompanyInfoService } from './companyInfoService';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class userService {
  constructor(private fb: FormBuilder, private http: HttpClient, public companyInfoService: CompanyInfoService, public Router: Router) { }
  userManagement = this.fb.group({
    Id: 0,
    UserName: ['', Validators.required],
    Email: [''],
    Password: ['', Validators.required],
    OTP: ['', Validators.required]
  });
  login(values) {
    if (this.getApiUrl().length) {
      const bodyToPost = "grant_type=password&username=" + values.username + "&password=" + values.password;
      return this.http.post(this.getApiUrl() + '/token', bodyToPost);
    }
    else {
      this.Router.navigateByUrl('/login')
    }
  }
  getApiUrl() {
    var apiInfo = JSON.parse(localStorage.getItem('apiinfo'));
    if (apiInfo != null && apiInfo != undefined) {
      return 'http://' + apiInfo.IpAddress + ':' + apiInfo.Port
    }
    return '';
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { CompanyInfoService } from './companyInfoService';

@Injectable({
  providedIn: 'root'
})
export class userService {
  constructor(private fb: FormBuilder, private http: HttpClient, public companyInfoService: CompanyInfoService) { }
  userManagement = this.fb.group({
    Id: 0,
    UserName: ['', Validators.required],
    Email: [''],
    Password: ['', Validators.required],
    OTP: ['', Validators.required]
  });

  // companyInfo = {
  //   version: {
  //     producer: "GoSafe",
  //     remarks: "Copyright (c) 2021 GoSafe System For Company Verification.",
  //     stats_version: "1.0",
  //     UTC_offset: "+5",
  //     production_date: "2021-11-26T04:59:02Z",
  //     records_interval: {
  //       start_date: "2021-11-26T18:09:00Z",
  //       end_date: "2022-11-24T19:35:05Z"
  //     }
  //   },
  //   network_config: [
  //     {
  //       cmp_code: "at",
  //       cmp_image: "img1.png",
  //       address: "42.201.208.179",
  //       port: "789"
  //     },
  //     {
  //       cmp_code: "ex",
  //       cmp_image: "img2.png",
  //       address: "110.39.49.154",
  //       port: "1212"
  //     },
  //     {
  //       cmp_code: "ts",
  //       cmp_image: "img3.png",
  //       address: "172.45.33.555",
  //       port: "7866"
  //     },
  //     {
  //       cmp_code: "cbt",
  //       cmp_image: "img4.png",
  //       address: "172.45.33.555",
  //       port: "7866"
  //     },
  //     {
  //       cmp_code: "ft",
  //       cmp_image: "img5.png",
  //       address: "172.45.33.555",
  //       port: "7866"
  //     },
  //     {
  //       cmp_code: "rt",
  //       cmp_image: "img6.png",
  //       address: "110.39.49.154",
  //       port: "1212"
  //     },
  //     {
  //       cmp_code: "ct",
  //       cmp_image: "img7.png",
  //       address: "172.45.33.555",
  //       port: "7866"
  //     },
  //     {
  //       cmp_code: "sd",
  //       cmp_image: "img8.png",
  //       address: "172.45.33.555",
  //       port: "7866"
  //     },
  //     {
  //       cmp_code: "xt",
  //       cmp_image: "img9.png",
  //       address: "172.45.33.555",
  //       port: "7866"
  //     },
  //     {
  //       cmp_code: "co",
  //       cmp_image: "img10.png",
  //       address: "110.39.49.154",
  //       port: "1212"
  //     },
  //     {
  //       cmp_code: "uts",
  //       cmp_image: "img11.png",
  //       address: "172.45.33.555",
  //       port: "7866"
  //     },
  //     {
  //       cmp_code: "mx",
  //       cmp_image: "img12.png",
  //       address: "172.45.33.555",
  //       port: "7866"
  //     },
  //     {
  //       cmp_code: "to",
  //       cmp_image: "img13.png",
  //       address: "172.45.33.555",
  //       port: "7866"
  //     },
  //     {
  //       cmp_code: "ps",
  //       cmp_image: "img14.png",
  //       address: "110.39.49.154",
  //       port: "1212"
  //     },
  //     {
  //       cmp_code: "kt",
  //       cmp_image: "img15.png",
  //       address: "172.45.33.555",
  //       port: "7866"
  //     },
  //     {
  //       cmp_code: "tpl",
  //       cmp_image: "img16.png",
  //       address: "172.45.33.555",
  //       port: "7866"
  //     },
  //     {
  //       cmp_code: "dt",
  //       cmp_image: "img17.png",
  //       address: "172.45.33.555",
  //       port: "7866"
  //     },
  //     {
  //       cmp_code: "tw",
  //       cmp_image: "img18.png",
  //       address: "172.45.33.555",
  //       port: "7866"
  //     }
  //   ]
  // };
  login(values) {
    const bodyToPost = "grant_type=password&username=" + values.username + "&password=" + values.password;
    // let cmpCode = values.username.split("_");
    return this.http.post(this.getApiUrl() + '/token', bodyToPost);
  }
  // getPort() {
  //   var port = null;
  //   const apiInfo = localStorage.getItem('apiinfo');
  //   if (apiInfo != null && apiInfo != undefined) {
  //     port = JSON.parse(apiInfo).Port
  //   }
  //   return port;
  // }
  // getIpAddress() {
  //   var IpAddress = null;
  //   const apiInfo = localStorage.getItem('apiinfo');
  //   if (apiInfo != null && apiInfo != undefined) {
  //     IpAddress = JSON.parse(apiInfo).IpAddress
  //   }
  //   return IpAddress;
  // }
  getApiUrl() {
    var apiInfo = JSON.parse(localStorage.getItem('apiinfo'));
    if (apiInfo != null && apiInfo != undefined) {
      return 'http://' + apiInfo.IpAddress + ':' + apiInfo.Port
    }
    return '';
  }
}

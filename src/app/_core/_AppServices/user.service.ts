import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class userService {
  constructor(private fb: FormBuilder, private http: HttpClient) { }
  userManagement = this.fb.group({
     Id: 0,
     UserName: ['',Validators.required],
     Email: [''],
     Password: ['',Validators.required],
     OTP: ['',Validators.required]
    });
    login(values:any){
      const bodyToPost = "grant_type=password&username="+values.username+"&password="+ values.password;
      return this.http.post(this.getApiUrl() + '/token', bodyToPost);
    }
    getPort() {
      var port = null;
      const apiInfo = localStorage.getItem('apiinfo');
      if(apiInfo != null && apiInfo != undefined)
      {
        port = JSON.parse(apiInfo).Port
      }
      return port;
  }
  getIpAddress() {
    var IpAddress = null;
    const apiInfo = localStorage.getItem('apiinfo');
    if(apiInfo != null && apiInfo != undefined)
    {
      IpAddress = JSON.parse(apiInfo).IpAddress
    }
    return IpAddress;
  }
   getApiUrl() {
      var apiInfo =  JSON.parse(localStorage.getItem('apiinfo'));
      if(apiInfo != null && apiInfo != undefined)
      {
        return 'http://'+apiInfo.IpAddress+':'+apiInfo.Port
      }
      return '';
  }
}

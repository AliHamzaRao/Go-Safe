import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { City, RootResponse } from '../../_interfaces/DBresponse.model';
@Injectable({
    providedIn: 'root',
})
export class CityService {
    response: any;
    constructor(public http: HttpClient, public Router: Router) { }
    getCities(): Observable<RootResponse<City>> {
        if (this.getApiUrl().length) {
            return this.http.get<RootResponse<City>>(this.getApiUrl() + '/api/City/List');
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

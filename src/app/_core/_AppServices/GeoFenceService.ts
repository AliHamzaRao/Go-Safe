import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { GeoFence, PagingResponse } from '../../_interfaces/DBresponse.model';
@Injectable({
    providedIn: 'root',
})
export class GeoFenceService {
    response: any;
    constructor(public http: HttpClient, public Router: Router) { }
    geoFence(pageNo:number): Observable<PagingResponse<GeoFence>> {
        if (this.getApiUrl().length) {
            return this.http.get<PagingResponse<GeoFence>>(`${this.getApiUrl()}/api/GEOFENCES/list/20/${pageNo}`);
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

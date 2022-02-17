import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { Observable } from 'rxjs';
import { GeoFenceResponse } from 'src/app/_interfaces/DBresponse.model';
import { Router } from '@angular/router';
@Injectable({
    providedIn: 'root',
})
export class GeoFenceService {
    response: any;
    constructor(public http: HttpClient, public Router: Router) { }

    geoFence(): Observable<GeoFenceResponse> {
        if (this.getApiUrl().length) {
            return this.http.get<GeoFenceResponse>(this.getApiUrl() + '/api/GEOFENCES/list');
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

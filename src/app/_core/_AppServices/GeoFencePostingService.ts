import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { Observable } from 'rxjs';
import { Response } from 'src/app/_interfaces/DBresponse.model';
import { Router } from '@angular/router';
@Injectable({
    providedIn: 'root',
})
export class GeoFencePostService {
    response: any;
    constructor(public http: HttpClient, public Router: Router) { }

    addGeoFence(value: any): Observable<Response> {
        if (this.getApiUrl().length) {
            return this.http.post<Response>(this.getApiUrl() + '/api/GEOFENCES/Add', value)
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

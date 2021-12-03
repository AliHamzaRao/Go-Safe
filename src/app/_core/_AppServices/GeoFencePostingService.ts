import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { Observable } from 'rxjs';
import { Response } from 'src/app/_interfaces/DBresponse.model';
@Injectable({
    providedIn: 'root',
})
export class GeoFencePostService {
    response: any;
    constructor(public http: HttpClient) { }

    addGeoFence(value: any): Observable<Response> {
        return this.http.post<Response>(this.getApiUrl() + '/api/GEOFENCES/Add', value)
    }
    getApiUrl() {
        var apiInfo = JSON.parse(localStorage.getItem('apiinfo'));
        if (apiInfo != null && apiInfo != undefined) {
            return 'http://' + apiInfo.IpAddress + ':' + apiInfo.Port
        }
        return '';
    }
}

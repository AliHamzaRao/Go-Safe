import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { Observable } from 'rxjs';
import { fenceDeleteResponse, GeoFenceResponse,Response } from 'src/app/_interfaces/DBresponse.model';
import { Router } from '@angular/router';
@Injectable({
    providedIn: 'root',
})
export class GeoFenceService {
    response: any;
    constructor(public http: HttpClient, public Router: Router) { }
    geoFence(pageNo:number): Observable<GeoFenceResponse> {
        if (this.getApiUrl().length) {
            return this.http.get<GeoFenceResponse>(`${this.getApiUrl()}/api/GEOFENCES/list/20/${pageNo}`);
        }
        else {
            this.Router.navigateByUrl('/login')
        }
    }
    addGeoFence(value: any): Observable<Response> {
        if (this.getApiUrl().length) {
            return this.http.post<Response>(this.getApiUrl() + '/api/GEOFENCES/Add', value)
        }
        else {
            this.Router.navigateByUrl('/login')
        }
    }
    deleteFence(id:any):Observable<fenceDeleteResponse>{
        if(this.getApiUrl().length){
            return this.http.delete<fenceDeleteResponse>(this.getApiUrl() + '/api/GEOFENCES/'+id)
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

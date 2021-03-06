import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { Observable } from 'rxjs';
import { Alarm, RootResponse } from 'src/app/_interfaces/DBresponse.model';
import { Router } from '@angular/router';
@Injectable({
    providedIn: 'root',
})
export class AlarmsService {
    response: any;
    constructor(public http: HttpClient, public Router: Router) { }
    getNotifications(value: any): Observable<RootResponse<Alarm>> {
        if (this.getApiUrl().length) {
            return this.http.post<RootResponse<Alarm>>(this.getApiUrl() + '/api/Alarm/veh_alrm', value);
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

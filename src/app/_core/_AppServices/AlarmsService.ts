import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { Observable } from 'rxjs';
import { AlarmsResponse } from 'src/app/_interfaces/DBresponse.model';
@Injectable({
    providedIn: 'root',
})
export class AlarmsService {
    response: any;
    constructor(public http: HttpClient) { }

    // private currentMap = new BehaviorSubject('Open Street Maps');
    // newMap = this.currentMap.asObservable();
    getNotifications(value: any): Observable<AlarmsResponse> {
        return this.http.post<AlarmsResponse>(this.getApiUrl() + '/api/Alarm/veh_alrm', value);
    }
    getApiUrl() {
        var apiInfo = JSON.parse(localStorage.getItem('apiinfo'));
        if (apiInfo != null && apiInfo != undefined) {
            return 'http://' + apiInfo.IpAddress + ':' + apiInfo.Port
        }
        return '';
    }
}

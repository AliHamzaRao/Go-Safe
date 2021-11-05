import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { BehaviorSubject, Observable } from 'rxjs';
import { Response } from 'src/app/_interfaces/DBresponse.model';
@Injectable({
    providedIn: 'root',
})
export class historyService {
    response: any;
    constructor(public http: HttpClient) { }

    // private currentMap = new BehaviorSubject('Open Street Maps');
    // newMap = this.currentMap.asObservable();
    DeviceHistory(value: any): Observable<Response> {
        return this.http.post<Response>(this.getApiUrl() + '/api/HistoryReplay/view', value);
    }
    getApiUrl() {
        var apiInfo = JSON.parse(localStorage.getItem('apiinfo'));
        if (apiInfo != null && apiInfo != undefined) {
            return 'http://' + apiInfo.IpAddress + ':' + apiInfo.Port
        }
        return '';
    }
}

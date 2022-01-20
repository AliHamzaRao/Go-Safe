import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { Observable } from 'rxjs';
import { SettingsResponse, Setting, commandPostResponse } from 'src/app/_interfaces/DBresponse.model';
@Injectable({
    providedIn: 'root',
})
export class SettingsService {
    constructor(public http: HttpClient) { }

    SendSettings(value: Setting): Observable<commandPostResponse> {
        return this.http.post<commandPostResponse>(this.getApiUrl() + '/api/Command/send', value);
    }
    GetSettings(): Observable<SettingsResponse> {

        return this.http.get<SettingsResponse>(this.getApiUrl() + '/api/Command/Settings/List')
    }
    getApiUrl() {
        var apiInfo = JSON.parse(localStorage.getItem('apiinfo'));
        if (apiInfo != null && apiInfo != undefined) {
            return 'http://' + apiInfo.IpAddress + ':' + apiInfo.Port
        }
        return '';
    }
}

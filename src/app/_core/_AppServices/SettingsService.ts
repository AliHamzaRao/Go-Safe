import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { Observable } from 'rxjs';
import { SettingsResponse, Setting, commandPostResponse,RootResponse  } from 'src/app/_interfaces/DBresponse.model';
import { Router } from '@angular/router';
import { Settings } from '../settings/app.settings.model';
@Injectable({
    providedIn: 'root',
})
export class SettingsService {
    constructor(public http: HttpClient, public Router: Router) { }
    SendSettings(value: Setting): Observable<commandPostResponse> {
        if (this.getApiUrl().length) {
            return this.http.post<commandPostResponse>(this.getApiUrl() + '/api/Command/send', value);
        }
        else {
            this.Router.navigateByUrl('/login')
        }
    }
    GetSettings(): Observable<RootResponse<Setting>> {
        if (this.getApiUrl().length) {
            return this.http.get<RootResponse<Setting>>(this.getApiUrl() + '/api/Command/Settings/List')
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

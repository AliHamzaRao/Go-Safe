import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { Observable } from 'rxjs';
import { CurrentStateResponse } from 'src/app/_interfaces/DBresponse.model';

@Injectable({
    providedIn: 'root'
})
export class CurrentStateService {
    constructor(public http: HttpClient) { }
    getCurrentState(value: any): Observable<CurrentStateResponse> {
        return this.http.get<CurrentStateResponse>(this.getApiUrl() + `/api/CurrentState/${value}`)
    }
    getApiUrl() {
        var apiInfo = JSON.parse(localStorage.getItem('apiinfo'));
        if (apiInfo != null && apiInfo != undefined) {
            return 'http://' + apiInfo.IpAddress + ':' + apiInfo.Port
        }
        return '';
    }
}
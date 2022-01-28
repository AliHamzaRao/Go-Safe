import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { Observable } from 'rxjs';
import { CurrentStateResponse } from 'src/app/_interfaces/DBresponse.model';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class CurrentStateService {
    constructor(public http: HttpClient, public Router: Router) { }
    getCurrentState(value: any): Observable<CurrentStateResponse> {
        if (this.getApiUrl().length) {
            return this.http.get<CurrentStateResponse>(this.getApiUrl() + `/api/CurrentState/${value}`)
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
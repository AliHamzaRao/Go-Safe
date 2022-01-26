import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { Observable } from 'rxjs';
import { CommandResponse, Command } from 'src/app/_interfaces/DBresponse.model';
import { commandPostResponse } from '../../_interfaces/DBresponse.model';
import { Router } from '@angular/router';
@Injectable({
    providedIn: 'root',
})
export class CommandsService {
    constructor(public http: HttpClient, public Router: Router) { }

    SendCommand(value: Command): Observable<commandPostResponse> {
        if (this.getApiUrl().length) {
            return this.http.post<commandPostResponse>(this.getApiUrl() + '/api/Command/send', value);
        }
        else {
            this.Router.navigateByUrl('/login')
        }
    }
    GetCommands(): Observable<CommandResponse> {
        if (this.getApiUrl().length) {
            return this.http.get<CommandResponse>(this.getApiUrl() + '/api/Command/Controls/List')
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

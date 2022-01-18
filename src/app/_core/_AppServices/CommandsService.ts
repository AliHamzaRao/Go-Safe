import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { Observable } from 'rxjs';
import { CommandResponse, Command } from 'src/app/_interfaces/DBresponse.model';
import { commandPostResponse } from '../../_interfaces/DBresponse.model';
@Injectable({
    providedIn: 'root',
})
export class CommandsService {
    constructor(public http: HttpClient) { }

    SendCommand(value: Command): Observable<commandPostResponse> {
        return this.http.post<commandPostResponse>(this.getApiUrl() + '/api/Command/send', value);
    }
    GetCommands(): Observable<CommandResponse> {
        return this.http.get<CommandResponse>(this.getApiUrl() + '/api/Command/Controls/List')
    }
    getApiUrl() {
        var apiInfo = JSON.parse(localStorage.getItem('apiinfo'));
        if (apiInfo != null && apiInfo != undefined) {
            return 'http://' + apiInfo.IpAddress + ':' + apiInfo.Port
        }
        return '';
    }
}

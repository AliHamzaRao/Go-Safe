import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { Observable } from 'rxjs';
import { Root } from 'src/app/_interfaces/DBresponse.model';
@Injectable({
    providedIn: 'root',
})
export class CompanyInfoService {
    response: any;
    constructor(public http: HttpClient) { }

    // private currentMap = new BehaviorSubject('Open Street Maps');
    // newMap = this.currentMap.asObservable();
    getCompanyInfo(): Observable<Root> {
        return this.http.get<Root>('https://clickupapi-web.azurewebsites.net/ftp/getcompanyinfo')
    }
}

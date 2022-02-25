import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { Observable } from 'rxjs';
import { Root } from 'src/app/_interfaces/DBresponse.model';
@Injectable({
    providedIn: 'root',
})
export class CompanyInfoService {
    constructor(public http: HttpClient) { }

    getCompanyInfo(): Observable<Root> {
        return this.http.get<Root>('https://clickupapi-web.azurewebsites.net/ftp/getcompanyinfo')
    }
}

import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { RootResponse, BrandTypes } from '../../_interfaces/DBresponse.model';
@Injectable()
export class BrandTypesVersionService {
    response: any;
    constructor(private http: HttpClient, private Router: Router) { }
    getBrandTypes(): Observable<RootResponse<BrandTypes>> {
        if (this.getApiUrl().length) {
            return this.http.get<RootResponse<BrandTypes>>(`${this.getApiUrl()}/api/Brn_typ_ver/List`);
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

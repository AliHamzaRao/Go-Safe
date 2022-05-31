import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { PagingResponse, BrandTypes } from '../../_interfaces/DBresponse.model';
@Injectable()
export class BrandTypesService {
    response: any;
    constructor(private http: HttpClient, private Router: Router) { }
    getBrandTypes(): Observable<PagingResponse<BrandTypes>> {
        if (this.getApiUrl().length) {
            return this.http.get<PagingResponse<BrandTypes>>(`${this.getApiUrl()}/api/BRAND_TYPES/list`);
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

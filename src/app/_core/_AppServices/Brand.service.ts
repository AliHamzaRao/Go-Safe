import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { PagingResponse, Brand } from '../../_interfaces/DBresponse.model';
@Injectable()
export class BrandsService {
    response: any;
    constructor(private http: HttpClient, private Router: Router) { }
    getBrands(pageNo:number): Observable<PagingResponse<Brand[]>> {
        if (this.getApiUrl().length) {
            return this.http.get<PagingResponse<Brand[]>>(`${this.getApiUrl()}/api/Brand/list/100/${pageNo}`);
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

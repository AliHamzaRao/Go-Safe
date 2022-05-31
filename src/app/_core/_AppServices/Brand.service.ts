import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { RootResponse, Brand, commandPostResponse } from '../../_interfaces/DBresponse.model';
@Injectable()
export class BrandsService {
    response: any;
    constructor(private http: HttpClient, private Router: Router) { }
    getBrands(): Observable<RootResponse<Brand>> {
        if (this.getApiUrl().length) {
            return this.http.get<RootResponse<Brand>>(`${this.getApiUrl()}/api/Brand/list`);
        }
        else {
            this.Router.navigateByUrl('/login')
        }
    }
    deleteBrand(id:number):Observable<commandPostResponse>{
        if(this.getApiUrl().length){
            return this.http.delete<commandPostResponse>(`${this.getApiUrl()}/api/Brand/${id}`)
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

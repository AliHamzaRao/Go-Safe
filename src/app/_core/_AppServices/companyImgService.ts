import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { img } from "src/app/_interfaces/DBresponse.model";
@Injectable({
    providedIn: 'root'
})
export class CompanyImageService {
    constructor(public http: HttpClient) { }
    getImg(value: string): Observable<img> {
        return this.http.get<img>(`https://clickupapi-web.azurewebsites.net/ftp/getimage?imageName=${value}`)
    }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';
import { AuthService } from './auth.service';
import { userService } from './user.service';
import { Observable, of } from 'rxjs';
import { Vehicles } from '../../_interfaces/vehicle.model';
import { VehicleResponse } from 'src/app/_interfaces/DBresponse.model';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class dashboardService {
  constructor(private fb: FormBuilder, private http: HttpClient, private auth: AuthService, private userSer: userService, private vehicleser: Vehicles, private router: Router) { }

  headers = { 'Authorization': 'Bearer ' + this.auth.getToken() }
  GetInvoiceNumber() {
    return this.http.get(environment.BaseURI2 + "Sale/GetInvoiceNumber");
  }
  GetVehiclesTree(): Observable<VehicleResponse> {
    var url = this.userSer.getApiUrl();
    var list = this.http.get<VehicleResponse>(url + "/api/VehicleTree/list/", { 'headers': this.headers }).pipe(
      catchError(error => {
        this.router.navigate(['/500']);
        return of(null);
      }));
    return list;
  }
}

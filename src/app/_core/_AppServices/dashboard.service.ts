import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';
import { AuthService } from './auth.service';
import { userService } from './user.service';
import { observable, Observable } from 'rxjs';
import { Vehicles } from '../../_interfaces/vehicle.model';

@Injectable({
  providedIn: 'root'
})
export class dashboardService {
  constructor(private fb: FormBuilder, private http: HttpClient, private auth: AuthService, private userSer: userService, private vehicleser: Vehicles) { }

  headers = { 'Authorization': 'Bearer ' + this.auth.getToken() }
  GetInvoiceNumber() {
    return this.http.get(environment.BaseURI2 + "Sale/GetInvoiceNumber");
  }

  GetVehiclesTree(): Observable<Vehicles> {
    var url = this.userSer.getApiUrl();
    var list = this.http.get<Vehicles>(url + "/api/VehicleTree/list/", { 'headers': this.headers });
    return list;
  }
}

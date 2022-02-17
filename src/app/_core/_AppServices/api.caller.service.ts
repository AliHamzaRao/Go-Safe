
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Vehicles } from '../../_interfaces/DBresponse.model';

@Injectable()
export class ApiCallerService {
  constructor(private http: HttpClient, public Toast: ToastrService) { }
  get(): Observable<Vehicles> {
    return this.http.get<Vehicles>(this.getApiUrl() + '/api/VehicleTree/list/').pipe(tap(next => { }, error => this.handleError(error)));
  };

  getApiUrl() {
    var apiInfo = JSON.parse(localStorage.getItem('apiinfo'));
    if (apiInfo != null && apiInfo != undefined) {
      return 'http://' + apiInfo.IpAddress + ':' + apiInfo.Port
    }
    return '';
  }
  public handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      this.Toast.error('An error occurred:' + error.error, "error")
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      this.Toast.error(error.error, "error");
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }
}
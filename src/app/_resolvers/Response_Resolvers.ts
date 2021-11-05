import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { take, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { historyService } from '../_core/_AppServices/historyService';
import { Response } from '../_interfaces/DBresponse.model';

@Injectable()
export class VehicleListResolver implements Resolve<Response>{

  constructor(private historyService: historyService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, value: any): Observable<Response> {
    return this.historyService.DeviceHistory(value).pipe(
      catchError(error => {
        this.router.navigate(['/500']);
        return of(null);
      }));
  }
}
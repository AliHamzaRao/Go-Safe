import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { dashboardService } from '../_core/_AppServices/dashboard.service'
import { Observable, of } from 'rxjs';
import { Vehicles } from 'src/app/_interfaces/vehicle.model';

@Injectable()
export class VehicleListResolver implements Resolve<Vehicles>{
  constructor(private dashboardService: dashboardService, private router: Router) { }
  resolve(): Observable<Vehicles> {
    return this.dashboardService.GetVehiclesTree().pipe(
      catchError(() => {
        this.router.navigate(['/500']);
        return of(null);
      }));
  }
}
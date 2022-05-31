import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitiesComponent } from './Cities.component';
import { SharedModule } from '../../../Shared/shared.module';
import { CityService } from '../../../_core/_AppServices/City.service';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

export const routes = [
  { path: '', component: CitiesComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PerfectScrollbarModule,
    SharedModule
  ],
  declarations: [CitiesComponent],
  providers:[CityService]
})
export class CitiesModule { }

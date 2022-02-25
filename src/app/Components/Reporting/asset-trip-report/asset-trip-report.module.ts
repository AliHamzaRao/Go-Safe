import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { AssetTripReportComponent } from './asset-trip-report.component';

export const routes = [
  { path: '', component: AssetTripReportComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PerfectScrollbarModule,
  ],
  declarations: [
  ],
  providers: [
  ]
})
export class AssetTripReportModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { DashboardComponent } from './dashboard.component';
import { AgmCoreModule } from '@agm/core';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { VehicleListResolver } from 'src/app/_resolvers/Vehicle_Post_Resolver';
import { AgmDrawingModule } from "@agm/drawing"
import {AgmDirectionModule} from "agm-direction"
export const routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    NgxChartsModule,
    PerfectScrollbarModule,
    AgmCoreModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    AgmDrawingModule,
    AgmDirectionModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBc7ZR2g0xCZD881nyphW7hCe2OsUvBIw8',
      libraries: ['drawing', 'places', 'geometry', 'directions']
    })
  ],
  declarations: [
    DashboardComponent
  ],
  providers: [
    VehicleListResolver
  ]
})
export class DashboardModule { }

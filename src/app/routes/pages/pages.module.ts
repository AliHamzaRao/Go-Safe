import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PagesComponent, historyDialogComponent, historyRecordDialogComponent, AssetTripDialogComponent, ControlDialogComponent } from './pages.component';
import { AgmCoreModule } from '@agm/core';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { VehicleListResolver } from 'src/app/_resolvers/Vehicle_Post_Resolver';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatDividerModule} from "@angular/material/divider"
import {MatDialogModule} from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { DashboardModule } from '../dashboard/dashboard.module';

export const routes = [
  { path: '', component: PagesComponent, pathMatch: 'full' }
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
    MatTabsModule,
    MatExpansionModule,
    MatDividerModule,
    MatDialogModule,
    MatDatepickerModule,
    MatInputModule,
    DashboardModule,
  ],
  declarations: [
    historyDialogComponent,
    historyRecordDialogComponent,
    AssetTripDialogComponent,
    ControlDialogComponent
  ],
  providers:[
    VehicleListResolver
  ],
})
export class PagesModule { }

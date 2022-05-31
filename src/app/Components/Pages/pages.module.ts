import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PagesComponent } from './pages.component';
import { AgmCoreModule } from '@agm/core';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { VehicleListResolver } from 'src/app/_resolvers/Vehicle_Post_Resolver';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from "@angular/material/divider"
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { DashboardModule } from '../dashboard/dashboard.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatRadioModule } from '@angular/material/radio';
import {InfiniteScrollModule} from "ngx-infinite-scroll"
import { BrandsService } from '../../_core/_AppServices/Brand.service';
import { SharedModule } from '../../Shared/shared.module';
import { BrandsModule } from '../Admin/brands/brands.module';
import { BrandTypesModule } from '../Admin/BrandTypes/brandTypes.module';
import { CountriesModule } from "../Admin/Countries/Countries.Module"
export const routes = [
  { path: '', component: PagesComponent, pathMatch: 'full' },
  { path: '/vehicles', component: PagesComponent, pathMatch: 'full' },
  { path: '/createfence', component: PagesComponent, pathMatch: 'full' },
  { path: '/showgeofence', component: PagesComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    InfiniteScrollModule,
    MatToolbarModule,
    MatIconModule,
    FormsModule,
    NgxChartsModule,
    PerfectScrollbarModule,
    SharedModule,
    AgmCoreModule,
    MatTreeModule,
    MatButtonModule,
    MatTabsModule,
    MatDividerModule,
    MatDialogModule,
    MatDatepickerModule,
    MatInputModule,
    MatRadioModule,
    DashboardModule,
    BrandsModule,
    BrandTypesModule,
    CountriesModule,
    RouterModule.forChild(routes),
  ],
  declarations: [],
  providers: [
    VehicleListResolver,
    BrandsService
  ],
  schemas: [
    NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class PagesModule { }

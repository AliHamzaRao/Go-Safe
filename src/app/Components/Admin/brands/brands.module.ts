import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { BrandsComponent } from './brands.component';
import { SharedGridModule } from '../../../Shared/SharedGridComponent/sharedgrid.module';

export const routes = [
  { path: '', component: BrandsComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PerfectScrollbarModule,
    SharedGridModule
  ],
  declarations: [
  ],
  providers: [
  ]
})
export class BrandsModule { }

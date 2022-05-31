import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountriesComponent } from './Countries.component';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from '../../../Shared/shared.module';

export const routes = [
  { path: '', component: CountriesComponent }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PerfectScrollbarModule,
    SharedModule
  ],
  declarations: [CountriesComponent]
})
export class CountriesModule { }

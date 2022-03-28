import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedGrid } from './sharedgrid.component';

export const routes = [
  { path: '', component: SharedGrid, pathMatch: 'full' }
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
export class SharedGridModule { }

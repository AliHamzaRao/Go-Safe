import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { BrandsComponent } from './brands.component';
import { BrandsService } from 'src/app/_core/_AppServices/Brand.service';
import { SharedModule } from 'src/app/Shared/shared.module';

export const routes = [
  { path: '', component: BrandsComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PerfectScrollbarModule,
    SharedModule,
  ],
  declarations: [
    BrandsComponent
  ],
  providers: [
    BrandsService
  ]
})
export class BrandsModule { }

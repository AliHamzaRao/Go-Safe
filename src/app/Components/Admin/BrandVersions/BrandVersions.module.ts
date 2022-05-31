import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandVersionsComponent } from './BrandVersions.component';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from '../../../Shared/shared.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { BrandTypesVersionService } from '../../../_core/_AppServices/BrandTypesVersion.service copy';

export const routes =[
  {path:'',Component:BrandVersionsComponent}
]

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    PerfectScrollbarModule
  ],
  declarations: [BrandVersionsComponent],
  providers:[
    BrandTypesVersionService
  ]
})
export class BrandVersionsModule { }

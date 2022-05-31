import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from 'src/app/Shared/shared.module';
import { BrandTypesComponent } from './BrandTypes.component';
import { BrandTypesService } from '../../../_core/_AppServices/BrandTypes.service';

export const routes = [
  { path: '', component: BrandTypesComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PerfectScrollbarModule,
    SharedModule
  ],
  declarations: [
    BrandTypesComponent
  ],
  providers: [
    BrandTypesService
  ]
})
export class BrandTypesModule { }

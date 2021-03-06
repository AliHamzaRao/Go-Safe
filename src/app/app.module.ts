import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { OverlayContainer } from '@angular/cdk/overlay';
import { CustomOverlayContainer } from './theme/utils/custom-overlay-container';
import { MatBadgeModule } from "@angular/material/badge"
import { AgmCoreModule } from '@agm/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true,
  suppressScrollX: true
};
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { SharedModule } from './shared/shared.module';
import { PipesModule } from './theme/pipes/pipes.module';
import { AppRoutingModule } from './app.routing';

import { AppComponent } from './app.component';
import { PagesComponent } from 'src/app/Components/Pages/pages.component';
import { NotFoundComponent } from './Components/Pages/errors/not-found/not-found.component';
import { ErrorComponent } from './Components/Pages/errors/error/error.component';
import { AppSettings } from './_core/settings/app.settings';
import { SidenavComponent } from './theme/components/sidenav/sidenav.component';
import { VerticalMenuComponent } from './theme/components/menu/vertical-menu/vertical-menu.component';
import { HorizontalMenuComponent } from './theme/components/menu/horizontal-menu/horizontal-menu.component';
import { BreadcrumbComponent } from './theme/components/breadcrumb/breadcrumb.component';
import { FlagsMenuComponent } from './theme/components/flags-menu/flags-menu.component';
import { FullScreenComponent } from './theme/components/fullscreen/fullscreen.component';
import { ApplicationsComponent } from './theme/components/applications/applications.component';
import { MessagesComponent } from './theme/components/messages/messages.component';
import { UserMenuComponent } from './theme/components/user-menu/user-menu.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { JwtInterceptor } from './_core/_AppServices/_interceptor/JwtInterceptor';
import { JwtModule } from "@auth0/angular-jwt";
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import * as moment from 'moment';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { VehicleListResolver } from './_resolvers/Vehicle_Post_Resolver';
import { Vehicles } from './_interfaces/vehicle.model';
import { AgmDrawingModule } from "@agm/drawing"
import { AllControlsDialogComponent } from './Components/Pages/Dialogs/AllControlsDialog/AllControlsDialog.component';
import { AllSettingsDialogComponent } from './Components/Pages/Dialogs/AllSettingsDialog/AllSettingsDialog.component';
import { ControlDialogComponent } from './Components/Pages/Dialogs/ControlDialog/ControlDialog.component';
import { SettingDialogComponent } from './Components/Pages/Dialogs/SettingDialog/SettingDialog.component';
import { AssetTripDialogComponent } from './Components/Pages/Dialogs/ReportsDialogs/AssetTripDialog/AssetTripDialog.component';
import { HeaderComponent } from './theme/components/header/header.component';
import { historyDialogComponent } from './Components/Pages/Dialogs/HistoryDialog/historyDialog.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BrandsService } from './_core/_AppServices/Brand.service';
@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgSelectModule,
    MatBadgeModule,
    SharedModule,
    InfiniteScrollModule,
    PerfectScrollbarModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    PipesModule,
    AppRoutingModule,
    JwtModule.forRoot({
      config: {
        // ...
        tokenGetter: () => {
          return localStorage.getItem("token");
        },
      },
    }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    NgbModule
  ],
  declarations: [
    AppComponent,
    PagesComponent,
    NotFoundComponent,
    ErrorComponent,
    SidenavComponent,
    VerticalMenuComponent,
    HorizontalMenuComponent,
    BreadcrumbComponent,
    FlagsMenuComponent,
    FullScreenComponent,
    ApplicationsComponent,
    MessagesComponent,
    UserMenuComponent,
    AssetTripDialogComponent,
    historyDialogComponent,
    ControlDialogComponent,
    AllControlsDialogComponent,
    AllSettingsDialogComponent,
    SettingDialogComponent,
    HeaderComponent
  ],

  providers: [
    VehicleListResolver,
    BrandsService,
    Vehicles,
    AppSettings,
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
    { provide: OverlayContainer, useClass: CustomOverlayContainer },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: 'moment', useFactory: (): any => moment },
    // mapInforProviderService
  ],
  schemas: [
    NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
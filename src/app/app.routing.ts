import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { PagesComponent } from 'src/app/routes/pages/pages.component';
import { NotFoundComponent } from 'src/app/routes/pages/errors/not-found/not-found.component';
import { ErrorComponent } from 'src/app/routes/pages/errors/error/error.component';
import { AuthGuard } from './_core/auth.guard';
import { VehicleListResolver } from './_resolvers/Vehicle_Post_Resolver';

export const routes: Routes = [
    {
        path: '',
        component: PagesComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        data: { breadcrumb: 'Dashboard' },
        resolve: { model: VehicleListResolver },
        children: [
            { path: '', loadChildren: () => import('./routes/dashboard/dashboard.module').then(m => m.DashboardModule) },
            { path: 'asset-trip-report', data: { breadcrumb: 'Asset Trip Report' }, loadChildren: () => import('./routes/Assets/asset-trip-report/asset-trip-report.module').then(m => m.AssetTripReportModule) },
        ],
    },
    { path: 'login', loadChildren: () => import('./routes/login/login.module').then(m => m.LoginModule) },
    { path: 'error', component: ErrorComponent, data: { breadcrumb: 'Error' } },
    { path: '**', component: NotFoundComponent }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            preloadingStrategy: PreloadAllModules, // <- comment this line for activate lazy load
            relativeLinkResolution: 'legacy',
            // useHash: true
        })
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }
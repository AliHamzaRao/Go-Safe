import { NgModule } from "@angular/core";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";

import { PagesComponent } from "src/app/Components/Pages/pages.component";
import { NotFoundComponent } from "src/app/Components/Pages/errors/not-found/not-found.component";
import { ErrorComponent } from "src/app/Components/Pages/errors/error/error.component";
import { AuthGuard } from "./_core/auth.guard";
import { VehicleListResolver } from "./_resolvers/Vehicle_Post_Resolver";

export const routes: Routes = [
  {
    path: "",
    component: PagesComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    data: { breadcrumb: "Dashboard" },
    // resolve: { model: VehicleListResolver },
    children: [
      {
        path: "",
        loadChildren: () =>
          import("./Components/dashboard/dashboard.module").then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: "asset-trip-report",
        data: { breadcrumb: "Asset Trip Report" },
        loadChildren: () =>
          import(
            "./Components/Reporting/asset-trip-report/asset-trip-report.module"
          ).then((m) => m.AssetTripReportModule),
      },
      {
        path: "asset-trip-report",
        data: { breadcrumb: "Asset Trip Report" },
        loadChildren: () =>
          import(
            "./Components/Reporting/asset-trip-report/asset-trip-report.module"
          ).then((m) => m.AssetTripReportModule),
      },
      {
        path: "brands",
        data: { breadcrumb: "Brands" },
        loadChildren: () =>
          import("./Components/Admin/brands/brands.module").then(
            (m) => m.BrandsModule
          ),
      },
      // { path: 'vehicles', data: { breadcrumb: 'Vehicles' }, loadChildren: () => import('./Components/dashboard/dashboard.module').then(m => m.DashboardModule) },
    ],
  },
  {
    path: "vehicles",
    component: PagesComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    // resolve: { model: VehicleListResolver },
    children: [
      {
        path: "",
        data: { breadcrumb: "Vehicles" },
        loadChildren: () =>
          import("./Components/dashboard/dashboard.module").then(
            (m) => m.DashboardModule
          ),
      },
    ],
  },
  {
    path: "showgeofence",
    component: PagesComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    data: { breadcrumb: "Geo Fence" },
    // resolve: { model: VehicleListResolver },
    children: [
      {
        path: "",
        loadChildren: () =>
          import("./Components/dashboard/dashboard.module").then(
            (m) => m.DashboardModule
          ),
      },
    ],
  },
  {
    path: "createfence",
    component: PagesComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    data: { breadcrumb: "Geo Fence" },
    // resolve: { model: VehicleListResolver },
    children: [
      {
        path: "",
        loadChildren: () =>
          import("./Components/dashboard/dashboard.module").then(
            (m) => m.DashboardModule
          ),
      },
    ],
  },
  {
    path: "login",
    loadChildren: () =>
      import("./Components/login/login.module").then((m) => m.LoginModule),
  },
  { path: "error", component: ErrorComponent, data: { breadcrumb: "Error" } },
  { path: "**", component: NotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules, // <- comment this line for activate lazy load
      relativeLinkResolution: "legacy",
      // useHash: true
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

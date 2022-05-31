import { NgModule } from "@angular/core";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";

import { PagesComponent } from "src/app/Components/Pages/pages.component";
import { NotFoundComponent } from "src/app/Components/Pages/errors/not-found/not-found.component";
import { ErrorComponent } from "src/app/Components/Pages/errors/error/error.component";
import { AuthGuard } from "./_core/auth.guard";
import { VehicleListResolver } from "./_resolvers/Vehicle_Post_Resolver";
import { BrandsComponent } from './Components/Admin/brands/brands.component';

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
        path: "brands",
        data: { breadcrumb: "brands" },
        loadChildren: () =>
        import(
          "./Components/Admin/brands/brands.module"
          ).then(
            (m) => m.BrandsModule
          )
      },
      {
        path: "brandtypes",
        data: { breadcrumb: "brand types" },
        loadChildren: () =>
        import(
          "./Components/Admin/BrandTypes/brandTypes.module"
          ).then(
            (m) => m.BrandTypesModule
          )
      },
      {
        path: "countries",
        data: { breadcrumb: "countries" },
        loadChildren: () =>
        import(
          "./Components/Admin/Countries/Countries.module"
          ).then(
            (m) => m.CountriesModule
          )
      },
      {
        path: "cities",
        data: { breadcrumb: "cities" },
        loadChildren: () =>
        import(
          "./Components/Admin/Cities/Cities.module"
          ).then(
            (m) => m.CitiesModule
          )
      },
      {
        path: "brandversions",
        data: { breadcrumb: "Brand Versions" },
        loadChildren: () =>
        import(
          "./Components/Admin/BrandVersions/BrandVersions.module"
          ).then(
            (m) => m.BrandVersionsModule
          )
      },
    ],
  },
  {
    path: "vehicles",
    component: PagesComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    data:{breadCrumb:''},
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

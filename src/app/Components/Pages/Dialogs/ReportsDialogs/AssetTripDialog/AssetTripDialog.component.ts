import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

@Component({
    selector: "app-asset-report-dialog",
    templateUrl: "./AssetTripDialog.html",
    styleUrls: ["../../../../pages/pages.component.scss"],
  })
  export class AssetTripDialogComponent {
    constructor(public dialog: MatDialog) { }
  }
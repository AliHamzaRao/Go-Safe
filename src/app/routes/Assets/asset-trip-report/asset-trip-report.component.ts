import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-asset-trip-report',
  templateUrl: './asset-trip-report.component.html',
  styleUrls: ['./asset-trip-report.component.scss']
})
export class AssetTripReportComponent implements OnInit {

  constructor(public dialog: MatDialog ) {}
  ngOnInit(): void {
    this.dialog.closeAll();
  }
}
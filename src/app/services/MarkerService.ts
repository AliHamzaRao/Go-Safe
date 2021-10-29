import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class markerService {
  constructor() { }

  private currentMarkers = new BehaviorSubject('[[0,0,0]]');
  newMarkers = this.currentMarkers.asObservable();
  SetMarkers(markers: string) {
    debugger;
    this.currentMarkers.next(markers);
  }
}

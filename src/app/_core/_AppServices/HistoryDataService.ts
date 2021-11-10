import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class historyDataService {
    constructor() { }
    private currentMarkers = new BehaviorSubject("[Latitude:31.488415,Longitude:74.370465]");
    newMarkers = this.currentMarkers.asObservable();
    setNewMarkers(markers: string) {
        this.currentMarkers.next(markers)
    }
}
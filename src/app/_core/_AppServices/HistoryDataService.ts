import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { History } from 'src/app/_interfaces/DBresponse.model';
@Injectable({
    providedIn: 'root',
})
export class historyDataService {
    constructor() { }
    private currentMarkers = new BehaviorSubject<History[]>([]);
    newMarkers = this.currentMarkers.asObservable();
    setNewMarkers(markers: any[]) {
        this.currentMarkers.next(markers)
    }
}
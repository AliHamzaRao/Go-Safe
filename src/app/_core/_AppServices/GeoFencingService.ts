import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GeoFenceVM } from '../../_interfaces/DBresponse.model';
@Injectable({
    providedIn: 'root',
})
export class GeoFencingService {
    constructor() { }
    private now = new BehaviorSubject<GeoFenceVM>(new GeoFenceVM);
    currentFence = this.now.asObservable();
    newFence(fence: GeoFenceVM) {
        this.now.next(fence)
    }
}
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class GeoFencingService {
    constructor() { }
    private now = new BehaviorSubject('{"gf_type":"none", "fenceParam":[]}');
    currentFence = this.now.asObservable();
    newFence(fence: string) {
        this.now.next(fence)
    }
}
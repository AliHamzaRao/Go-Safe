import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class mapTypeService {
    constructor() { }

    private currentMap = new BehaviorSubject('Google Maps');
    newMap = this.currentMap.asObservable();
    SetMap(map: string) {
        this.currentMap.next(map);
        localStorage.setItem('maptype', map)
    }
}

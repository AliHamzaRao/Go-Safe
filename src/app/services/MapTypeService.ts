import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class mapTypeService {
    constructor() { }

    private currentMap = new BehaviorSubject('Open Street Maps');
    newMap = this.currentMap.asObservable();
    SetMap(map: string) {
        debugger;
        this.currentMap.next(map);
    }
}

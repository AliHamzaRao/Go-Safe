import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class AllDevicesDataService {
    constructor() { }
    private AllDevicesData = new BehaviorSubject('[]');
    AllDevices = this.AllDevicesData.asObservable();
    SetDevices(data: string) {
        this.AllDevicesData.next(data);
    }
}
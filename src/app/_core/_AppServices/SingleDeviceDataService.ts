import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class SingleDeviceDataService {
    constructor() { }
    private SingleDeviceData = new BehaviorSubject('[]');
    singleDevice = this.SingleDeviceData.asObservable();
    SetDevice(data: string) {
        this.SingleDeviceData.next(data);
    }
}
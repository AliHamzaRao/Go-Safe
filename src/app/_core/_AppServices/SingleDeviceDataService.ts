import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PacketParser } from '../../Components/dashboard/PacketParser';
@Injectable({
    providedIn: 'root',
})
export class SingleDeviceDataService {
    constructor() { }
    private SingleDeviceData = new BehaviorSubject<PacketParser[]>([]);
    singleDevice = this.SingleDeviceData.asObservable();
    SetDevice(data: PacketParser[]) {
        this.SingleDeviceData.next(data);
    }
}
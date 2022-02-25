import { Injectable, QueryList } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PacketParser } from '../../Components/dashboard/PacketParser';
@Injectable({
    providedIn: 'root',
})
export class AllDevicesDataService {
    constructor() { }
    private AllDevicesData = new BehaviorSubject<PacketParser[]>([]);
    AllDevices = this.AllDevicesData.asObservable();
    SetDevices(data: PacketParser[]) {
        this.AllDevicesData.next(data);
    }
}
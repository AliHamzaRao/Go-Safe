import { Injectable } from "@angular/core"
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DeviceIdService {
    private newdeviceId = new BehaviorSubject(0);
    deviceId = this.newdeviceId.asObservable();
    constructor() { }
    setId(newId: number) {
        this.newdeviceId.next(newId)
    }
}
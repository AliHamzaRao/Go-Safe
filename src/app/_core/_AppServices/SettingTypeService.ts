import { Injectable } from "@angular/core"
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SettingTypeService {
    private newSetting = new BehaviorSubject('');
    currnetSetting = this.newSetting.asObservable();
    private newSettingId = new BehaviorSubject(null);
    currentSettingId = this.newSettingId.asObservable();
    constructor() { }
    setSetting(Setting: string) {
        this.newSetting.next(Setting)
    }
    setSettingId(id: number) {
        this.newSettingId.next(id)
    }
}
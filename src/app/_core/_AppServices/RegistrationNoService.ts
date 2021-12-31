import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class RegistrationNoService {
    constructor() { }
    private now = new BehaviorSubject('');
    regNumber = this.now.asObservable();
    newRegNo(regNo: string) {
        this.now.next(regNo)
    }
}
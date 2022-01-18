import { Injectable } from "@angular/core"
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CommandTypeService {
    private newCommand = new BehaviorSubject('');
    currnetCommand = this.newCommand.asObservable();
    constructor() { }
    setCommand(value: string) {
        this.newCommand.next(value)
    }
}
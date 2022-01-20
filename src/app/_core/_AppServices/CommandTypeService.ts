import { Injectable } from "@angular/core"
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CommandTypeService {
    private newCommand = new BehaviorSubject('');
    currnetCommand = this.newCommand.asObservable();
    private newCommandId = new BehaviorSubject(null);
    currentCommandId = this.newCommandId.asObservable();
    constructor() { }
    setCommand(command: string) {
        this.newCommand.next(command)
    }
    setCommandId(id: number) {
        this.newCommandId.next(id)
    }
}
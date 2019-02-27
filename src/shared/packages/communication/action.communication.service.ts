import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ActionCommunicationService {
    private _triggerAddAction: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    get triggerAddAction(): BehaviorSubject<boolean> {
        return this._triggerAddAction;
    }
}

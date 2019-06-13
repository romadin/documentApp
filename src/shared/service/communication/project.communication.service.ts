import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ProjectCommunicationService {
    private _triggerAddWorkFunction: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    get triggerAddWorkFunction(): BehaviorSubject<boolean> {
        return this._triggerAddWorkFunction;
    }

}

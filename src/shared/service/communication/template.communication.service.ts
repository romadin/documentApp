import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class TemplateCommunicationService {
    private _triggerAddTemplate: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    get triggerAddTemplate(): BehaviorSubject<boolean> {
        return this._triggerAddTemplate;
    }

}

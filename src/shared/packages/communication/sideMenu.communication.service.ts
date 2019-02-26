import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class SideMenuCommunicationService {
    private _triggerAddUserPopup: Subject<boolean> = new Subject<boolean>();

    get triggerAddUserPopup(): Subject<boolean> {
        return this._triggerAddUserPopup;
    }
}

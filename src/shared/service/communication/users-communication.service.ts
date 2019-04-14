import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class UsersCommunicationService {
    private _triggerAddUserPopup: Subject<boolean> = new Subject<boolean>();
    private _addUserInUserComponent: Subject<boolean> = new Subject<boolean>();

    get triggerAddUserPopup(): Subject<boolean> {
        return this._triggerAddUserPopup;
    }

    get addUserInUserComponent(): Subject<boolean> {
        return this._addUserInUserComponent;
    }

}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class HeaderWithFolderCommunicationService {

    private _triggerAddItem: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private _triggerReadMode: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private _showAddUserButton: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    get triggerAddItem(): BehaviorSubject<boolean> {
        return this._triggerAddItem;
    }

    get triggerReadMode(): BehaviorSubject<boolean> {
        return this._triggerReadMode;
    }

    get showAddUserButton(): BehaviorSubject<boolean> {
        return this._showAddUserButton;
    }
}

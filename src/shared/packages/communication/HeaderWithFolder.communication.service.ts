import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class HeaderWithFolderCommunicationService {

    private _triggerAddItem: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    get triggerAddItem(): BehaviorSubject<boolean> {
        return this._triggerAddItem;
    }
}

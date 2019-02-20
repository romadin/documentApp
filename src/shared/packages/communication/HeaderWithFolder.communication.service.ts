import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class HeaderWithFolderCommunicationService {

    private _triggerAddFolder: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    get triggerAddFolder(): BehaviorSubject<boolean> {
        return this._triggerAddFolder;
    }
}

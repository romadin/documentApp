import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

interface ButtonWrapper {
    show?: boolean;
    trigger?: boolean;
}

@Injectable()
export class HeaderWithFolderCommunicationService {
    private _headerTitle: Subject<string> = new Subject<string>();

    get headerTitle(): Subject<string> {
        return this._headerTitle;
    }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class FolderCommunicationService {
    private _OnDocumentEditListener: BehaviorSubject<boolean> = new BehaviorSubject(false);

    get onItemCloseListener(): BehaviorSubject<boolean> {
        return this._OnDocumentEditListener;
    }

}


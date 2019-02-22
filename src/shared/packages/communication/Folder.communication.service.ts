import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class FolderCommunicationService {
    private _OnDocumentEditListener: BehaviorSubject<boolean> = new BehaviorSubject(false);

    get onDocumentEditListener(): BehaviorSubject<boolean> {
        return this._OnDocumentEditListener;
    }

}


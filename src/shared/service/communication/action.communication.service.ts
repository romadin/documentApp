import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable()
export class ActionCommunicationService {
    private _triggerAddAction: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private _showArchivedActions: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private _showArchivedActionsButton: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private _exportToPdfButton: Subject<boolean> = new Subject<boolean>();

    get triggerAddAction(): BehaviorSubject<boolean> {
        return this._triggerAddAction;
    }

    get showArchivedActions(): BehaviorSubject<boolean> {
        return this._showArchivedActions;
    }

    get showArchivedActionsButton(): BehaviorSubject<boolean> {
        return this._showArchivedActionsButton;
    }

    get exportToPdf(): Subject<boolean> {
        return this._exportToPdfButton;
    }
}

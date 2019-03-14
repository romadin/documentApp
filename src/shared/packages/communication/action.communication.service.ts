import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ActionCommunicationService {
    private _triggerAddAction: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private _showArchivedActions: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private _showArchivedActionsButton: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    get triggerAddAction(): BehaviorSubject<boolean> {
        return this._triggerAddAction;
    }

    get showArchivedActions(): BehaviorSubject<boolean> {
        return this._showArchivedActions;
    }

    get showArchivedActionsButton(): BehaviorSubject<boolean> {
        return this._showArchivedActionsButton;
    }
}

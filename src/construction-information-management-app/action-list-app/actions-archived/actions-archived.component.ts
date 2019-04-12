import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material';
import { Action } from '../../../shared/packages/action-package/action.model';
import { ApiActionEditPostData } from '../../../shared/packages/action-package/api-action.interface';
import { ActionService } from '../../../shared/packages/action-package/action.service';
import { ActionCommunicationService } from '../../../shared/service/communication/action.communication.service';
import { ToastService } from '../../../shared/toast.service';

@Component({
    selector: 'cim-actions-archived',
    templateUrl: './actions-archived.component.html',
    styleUrls: ['./actions-archived.component.css'],
})
export class ActionsArchivedComponent {
    @ViewChild(MatTable) archivedActions: MatTable<any>;
    @Output() removeFromArchive: EventEmitter<Action> = new EventEmitter<Action>();
    @Output() closeView: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() actions: Action[];
    displayedColumns: string[] = ['code', 'description', 'actionHolder', 'week', 'status', 'comment'];

    private timerId: number;

    constructor(private actionService: ActionService,
                private toastService: ToastService,
                private actionCommunication: ActionCommunicationService) { }

    changeActionStatus(e: MouseEvent, actionEdited: Action): void {
        e.preventDefault();
        e.stopPropagation();
        if (this.timerId) {
            clearTimeout(this.timerId);
        }
        this.timerId = setTimeout(() => {
            actionEdited.isDone = !actionEdited.isDone;
            const postData: ApiActionEditPostData  = {
                isDone: actionEdited.isDone
            };
            this.actionService.editAction(actionEdited, postData);

            this.actions.splice(this.actions.findIndex(action => action === actionEdited), 1);
            this.removeFromArchive.emit(actionEdited);
            this.toastService.showSuccess('Actie: ' + actionEdited.code + ' is gedearchiveerd', 'Gedearchiveerd');
            this.archivedActions.renderRows();
            if (this.actions.length === 0 ) {
                this.actionCommunication.showArchivedActionsButton.next(false);
                this.onCloseView();
            }
        }, 500);
    }

    onCloseView(): void {
        this.closeView.emit(true);
    }

}
